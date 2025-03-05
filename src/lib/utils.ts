// utils.js - 汎用ユーティリティ関数

import { Timestamp } from "firebase/firestore";

// 型定義
type CongestionLevel = 0 | 1 | 2 | 3 | 4 | 5;
type StoreType =
  | "cafe"
  | "restaurant"
  | "family_restaurant"
  | "fast_food"
  | "bakery"
  | "other";
type AppType = "line" | "ios" | "android" | "web";

interface AppTypeInfo {
  label: string;
  icon: string;
  class: string;
}

// 混雑レベルに基づく表示ラベルを返す
export const getCongestionLabel = (level: CongestionLevel): string => {
  const labels: Record<CongestionLevel, string> = {
    0: "データなし",
    1: "空いています",
    2: "やや混雑",
    3: "混雑中",
    4: "かなり混雑",
    5: "非常に混雑",
  };

  return labels[level] || labels[0];
};

// 混雑レベルに基づくクラス名を返す
export const getCongestionClass = (level: CongestionLevel): string => {
  const classes: Record<CongestionLevel, string> = {
    0: "congestion-unknown",
    1: "congestion-empty",
    2: "congestion-light",
    3: "congestion-medium",
    4: "congestion-high",
    5: "congestion-extreme",
  };

  return classes[level] || classes[0];
};

// タイムスタンプを「〇分前」のような形式に変換
export const formatTimeAgo = (timestamp: Timestamp | Date | null): string => {
  if (!timestamp) return "データなし";

  // FirestoreのタイムスタンプをネイティブのDateに変換
  const date = "toDate" in timestamp ? timestamp.toDate() : timestamp;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // 時間の差を計算
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  // 日本語表記で返す
  if (diffSec < 60) return `${diffSec}秒前`;
  if (diffMin < 60) return `${diffMin}分前`;
  if (diffHour < 24) return `${diffHour}時間前`;
  if (diffDay < 30) return `${diffDay}日前`;

  // それ以上は日付を表示
  return date.toLocaleDateString("ja-JP");
};

// 店舗タイプに基づくラベルを返す
export const getStoreTypeLabel = (type: StoreType): string => {
  const types: Record<StoreType, string> = {
    cafe: "カフェ",
    restaurant: "レストラン",
    family_restaurant: "ファミレス",
    fast_food: "ファストフード",
    bakery: "ベーカリー",
    other: "その他",
  };

  return types[type] || types["other"];
};

// アプリタイプに基づくラベルとアイコンを返す
export const getAppTypeInfo = (type: AppType): AppTypeInfo => {
  const info: Record<AppType, AppTypeInfo> = {
    line: {
      label: "LINE公式アカウント",
      icon: "🟢",
      class: "bg-green-50 text-green-600 border-green-200",
    },
    ios: {
      label: "iOSアプリ",
      icon: "📱",
      class: "bg-gray-50 text-gray-600 border-gray-200",
    },
    android: {
      label: "Androidアプリ",
      icon: "🤖",
      class: "bg-blue-50 text-blue-600 border-blue-200",
    },
    web: {
      label: "Webサイト",
      icon: "🌐",
      class: "bg-purple-50 text-purple-600 border-purple-200",
    },
  };

  return (
    info[type] || {
      label: "その他",
      icon: "📱",
      class: "bg-gray-50 text-gray-600 border-gray-200",
    }
  );
};

// 営業時間を整形して表示する
export const formatOpeningHours = (
  openingHours: string | string[] | null
): string => {
  if (!openingHours) return "営業時間情報なし";

  // 配列の場合は整形して返す
  if (Array.isArray(openingHours)) {
    return openingHours.join("<br>");
  }

  // 文字列の場合はそのまま返す
  return openingHours;
};

// 住所を整形して表示（都道府県や市区町村などを強調）
export const formatAddress = (address: string | null): string => {
  if (!address) return "";

  // 都道府県名を太字にする
  const prefectures = [
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ];

  let formattedAddress = address;

  prefectures.forEach((pref) => {
    formattedAddress = formattedAddress.replace(
      new RegExp(`(${pref})`, "g"),
      "<strong>$1</strong>"
    );
  });

  return formattedAddress;
};

// 緯度・経度から推定される住所を取得する（Reverse Geocoding）
export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&language=ja`
    );

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Reverse geocoding failed: ${data.status}`);
    }

    // 適切な住所情報を選択（最も詳細なもの）
    return data.results[0].formatted_address;
  } catch (error) {
    console.error("Error in reverse geocoding:", error);
    return null;
  }
};

interface QueryParams {
  [key: string]: string | string[];
}

// クエリパラメータからオブジェクトを生成
export const parseQueryParams = (queryString: string): QueryParams => {
  if (!queryString || queryString === "?") return {};

  const params: QueryParams = {};
  const searchParams = new URLSearchParams(queryString.replace(/^\?/, ""));

  for (const [key, value] of searchParams.entries()) {
    // 配列の場合はカンマ区切りで分割
    if (value.includes(",")) {
      params[key] = value.split(",");
    } else {
      params[key] = value;
    }
  }

  return params;
};

// オブジェクトからクエリパラメータ文字列を生成
export const buildQueryString = (params: QueryParams): string => {
  if (!params || Object.keys(params).length === 0) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      searchParams.append(key, value.join(","));
    } else if (value !== null && value !== undefined) {
      searchParams.append(key, value.toString());
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};
