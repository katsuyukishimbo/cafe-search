import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import axios from "axios";
import cors from "cors";

// 型定義
interface StoreData {
  placeId?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  name?: string;
  address?: string;
  type?: string;
  openingHours?: string;
  officialApps?: AppData[];
  congestion?: {
    level: number;
    lastUpdated: admin.firestore.Timestamp;
    liveData: boolean;
  };
}

interface AppData {
  type: "line" | "ios" | "android" | "web";
  url: string;
  name: string;
}

interface UpdateStoreRequest {
  storeId: string;
  data: Partial<StoreData>;
}

interface UpdateAppRequest {
  storeId: string;
  appData: AppData;
}

interface DetectedApp {
  storeId: string;
  name: string;
  type: AppData["type"];
  url: string;
}

// Firebase Admin初期化
admin.initializeApp();
const db = admin.firestore();

// CORSミドルウェアの設定
const corsHandler = cors({ origin: true });

// Google Maps Places APIから混雑情報を取得して更新する関数
exports.updateCongestionData = functions.pubsub
  .schedule("every 15 minutes")
  .onRun(async (context: functions.EventContext) => {
    const storesRef = db.collection("stores");
    const snapshot = await storesRef.get();

    const updatePromises: Promise<any>[] = [];

    snapshot.forEach((doc) => {
      const store = doc.data() as StoreData;
      const { location } = store;

      if (!location) return;

      const placeId = store.placeId;

      if (!placeId) return;

      // Google Places APIを呼び出して混雑情報を取得
      const promise = axios
        .get<{
          result?: {
            current_popularity?: number;
            current_opening_hours?: {
              weekday_text?: string[];
            };
          };
        }>(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,current_opening_hours,current_popularity&key=${
            functions.config().google.maps_api_key
          }`
        )
        .then((response) => {
          const data = response.data;
          let congestionLevel = 0;
          let liveData = false;

          // 混雑度を0-5のレベルに変換
          if (data && data.result?.current_popularity !== undefined) {
            liveData = true;
            const popularity = data.result.current_popularity;

            if (popularity < 20) congestionLevel = 1; // 空いている
            else if (popularity < 40) congestionLevel = 2; // やや混雑
            else if (popularity < 60) congestionLevel = 3; // 混雑中
            else if (popularity < 80) congestionLevel = 4; // かなり混雑
            else congestionLevel = 5; // 非常に混雑
          }

          // 営業時間情報があれば更新
          const openingHours = data.result?.current_opening_hours?.weekday_text
            ? data.result.current_opening_hours.weekday_text.join(", ")
            : null;

          // 混雑情報を更新
          return storesRef.doc(doc.id).update({
            congestion: {
              level: congestionLevel,
              lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
              liveData: liveData,
            },
            ...(openingHours && { openingHours }),
          });
        })
        .catch((error) => {
          console.error(
            `Error updating congestion for store ${doc.id}:`,
            error
          );
        });

      updatePromises.push(promise);
    });

    await Promise.all(updatePromises);

    console.log(`Updated congestion data for ${updatePromises.length} stores`);
    return null;
  });

// 店舗の新しい詳細情報をクライアントから受け取るAPI
exports.updateStoreDetails = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    // POSTリクエスト以外は拒否
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { storeId, data } = req.body as UpdateStoreRequest;

      if (!storeId || !data) {
        return res.status(400).send("Missing store ID or data");
      }

      // 許可されたフィールドのみ更新
      const allowedFields = [
        "name",
        "address",
        "type",
        "openingHours",
      ] as const;
      const updateData: Partial<StoreData> = {};

      allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
          updateData[field] = data[field];
        }
      });

      // 更新するデータがなければエラー
      if (Object.keys(updateData).length === 0) {
        return res.status(400).send("No valid fields to update");
      }

      // Firestoreを更新
      await db
        .collection("stores")
        .doc(storeId)
        .update({
          ...updateData,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      res
        .status(200)
        .send({ success: true, message: "Store updated successfully" });
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).send({ error: "Failed to update store" });
    }
  });
});

// 新しい店舗アプリ情報を登録または更新するAPI
exports.updateStoreApp = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const { storeId, appData } = req.body as UpdateAppRequest;

      if (
        !storeId ||
        !appData ||
        !appData.type ||
        !appData.url ||
        !appData.name
      ) {
        return res.status(400).send("Missing required data");
      }

      // 有効なアプリタイプか確認
      const validTypes: AppData["type"][] = ["line", "ios", "android", "web"];
      if (!validTypes.includes(appData.type)) {
        return res.status(400).send("Invalid app type");
      }

      // 店舗ドキュメントを取得
      const storeRef = db.collection("stores").doc(storeId);
      const storeDoc = await storeRef.get();

      if (!storeDoc.exists) {
        return res.status(404).send("Store not found");
      }

      // 現在のofficialAppsを取得
      const store = storeDoc.data() as StoreData;
      const officialApps = store.officialApps || [];

      // 同じタイプのアプリが既にあるか確認
      const appIndex = officialApps.findIndex(
        (app) => app.type === appData.type
      );

      if (appIndex !== -1) {
        // 既存のアプリ情報を更新
        officialApps[appIndex] = appData;
      } else {
        // 新しいアプリ情報を追加
        officialApps.push(appData);
      }

      // Firestoreを更新
      await storeRef.update({
        officialApps,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // app_updatesコレクションに記録
      await db.collection("app_updates").add({
        storeId,
        appName: appData.name,
        appType: appData.type,
        url: appData.url,
        discoveredAt: admin.firestore.FieldValue.serverTimestamp(),
        processed: true,
      });

      res.status(200).send({
        success: true,
        message: "App information updated successfully",
      });
    } catch (error) {
      console.error("Error updating app information:", error);
      res.status(500).send({ error: "Failed to update app information" });
    }
  });
});

// 定期的に新しいアプリを検知するスケジュール関数
exports.detectNewApps = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async (context: functions.EventContext) => {
    try {
      console.log("Running app detection process...");

      // 検出されたアプリ情報を格納
      const detectedApps: DetectedApp[] = [];

      // 検出したアプリをFirestoreに保存
      const savePromises = detectedApps.map((app) => {
        return db.collection("app_updates").add({
          storeId: app.storeId,
          appName: app.name,
          appType: app.type,
          url: app.url,
          discoveredAt: admin.firestore.FieldValue.serverTimestamp(),
          processed: false,
        });
      });

      await Promise.all(savePromises);

      // 管理者に通知を送信
      if (detectedApps.length > 0) {
        await sendNotificationToAdmin(detectedApps);
      }

      console.log(`Detected ${detectedApps.length} new apps`);
      return null;
    } catch (error) {
      console.error("Error in app detection:", error);
      return null;
    }
  });

// 管理者へ通知を送信する関数
async function sendNotificationToAdmin(apps: DetectedApp[]): Promise<void> {
  const message =
    `新しいアプリが検出されました (${apps.length}件):\n` +
    apps.map((app) => `- ${app.name} (${app.type}): ${app.storeId}`).join("\n");

  try {
    // LINE Notify APIにPOST
    await axios.post(
      "https://notify-api.line.me/api/notify",
      `message=${encodeURIComponent(message)}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${functions.config().line.notify_token}`,
        },
      }
    );

    console.log("Notification sent successfully");
  } catch (error) {
    console.error("Error sending notification:", error);
  }
}
