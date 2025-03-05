import axios from "axios";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
} from "firebase/firestore";
import { Store, App } from "../types/store";

// 型定義
interface StoreFilters {
  types?: string[];
  onlyWithApps?: boolean;
  congestion?: number[];
}

interface GeocodingResponse {
  status: string;
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
}

interface LatLng {
  lat: number;
  lng: number;
}

// Firebase Cloud Functionsへのエンドポイント
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://your-firebase-functions-url.com";

// 店舗データの取得
export const fetchStores = async (
  filters: StoreFilters = {}
): Promise<Store[]> => {
  try {
    const storesRef = collection(db, "stores");
    const queryConstraints: QueryConstraint[] = [];

    // フィルター適用
    if (filters.types && filters.types.length > 0) {
      queryConstraints.push(where("type", "in", filters.types));
    }

    // 公式アプリがある店舗のみにフィルタリング
    if (filters.onlyWithApps) {
      queryConstraints.push(where("officialApps", "!=", null));
    }

    const storesQuery =
      queryConstraints.length > 0
        ? query(storesRef, ...queryConstraints)
        : storesRef;

    const snapshot = await getDocs(storesQuery);

    let stores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Store[];

    // 混雑度によるフィルタリング
    if (filters.congestion && filters.congestion.length > 0) {
      stores = stores.filter(
        (store) =>
          store.congestion &&
          filters.congestion?.includes(store.congestion.level)
      );
    }

    return stores;
  } catch (error) {
    console.error("Error fetching stores:", error);
    throw error;
  }
};

// 特定の店舗の詳細を取得
export const fetchStoreById = async (storeId: string): Promise<Store> => {
  try {
    const storeDoc = await getDoc(doc(db, "stores", storeId));

    if (!storeDoc.exists()) {
      throw new Error("Store not found");
    }

    return {
      id: storeDoc.id,
      ...storeDoc.data(),
    } as Store;
  } catch (error) {
    console.error(`Error fetching store ${storeId}:`, error);
    throw error;
  }
};

// 地理的に近い店舗を取得
export const fetchNearbyStores = async (
  lat: number,
  lng: number,
  radiusKm: number = 2
): Promise<Store[]> => {
  try {
    const snapshot = await getDocs(collection(db, "stores"));

    const stores = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Store[];

    // 2点間の距離を計算（ヒュベニの公式）
    const calculateDistance = (
      lat1: number,
      lng1: number,
      lat2: number,
      lng2: number
    ): number => {
      const R = 6371; // 地球の半径（km）
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLng = ((lng2 - lng1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    return stores
      .filter((store) => {
        if (!store.location) return false;

        const distance = calculateDistance(
          lat,
          lng,
          store.location.latitude,
          store.location.longitude
        );

        return distance <= radiusKm;
      })
      .sort((a, b) => {
        const distA = calculateDistance(
          lat,
          lng,
          a.location.latitude,
          a.location.longitude
        );
        const distB = calculateDistance(
          lat,
          lng,
          b.location.latitude,
          b.location.longitude
        );
        return distA - distB;
      });
  } catch (error) {
    console.error("Error fetching nearby stores:", error);
    throw error;
  }
};

// 店舗情報を更新
export const updateStoreDetails = async (
  storeId: string,
  data: Partial<Store>
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/updateStoreDetails`, {
      storeId,
      data,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating store:", error);
    throw error;
  }
};

// 店舗アプリ情報を更新または追加
export const updateStoreApp = async (
  storeId: string,
  appData: App
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/updateStoreApp`, {
      storeId,
      appData,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating store app:", error);
    throw error;
  }
};

// 地名から位置情報を取得（Geocoding API）
export const geocodeAddress = async (address: string): Promise<LatLng> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await axios.get<GeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status !== "OK") {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }

    const location = response.data.results[0].geometry.location;
    return {
      lat: location.lat,
      lng: location.lng,
    };
  } catch (error) {
    console.error("Error geocoding address:", error);
    throw error;
  }
};
