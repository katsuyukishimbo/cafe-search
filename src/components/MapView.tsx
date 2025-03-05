"use client";

import React from "react";
import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { db } from "../lib/firebase";
import StoreInfoCard from "./StoreInfoCard";
import type { FilterOptions } from "./FilterPanel";
import type { Store } from "../types/store";

// 位置情報の型
interface LatLng {
  lat: number;
  lng: number;
}

// Google Maps API用のオプション
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// 日本の中心あたりをデフォルト位置に
const defaultCenter: LatLng = {
  lat: 35.6895,
  lng: 139.6917,
};

// 混雑度に応じたマーカーアイコンの色を定義
const getCongestionIcon = (level: number) => {
  const colors: { [key: number]: string } = {
    0: "#94a3b8", // データなし: グレー
    1: "#22c55e", // 空いている: 緑
    2: "#84cc16", // やや混雑: 黄緑
    3: "#facc15", // 混雑: 黄色
    4: "#f97316", // やや混んでいる: オレンジ
    5: "#ef4444", // 非常に混雑: 赤
  };

  return {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
    fillColor: colors[level] || colors[0],
    fillOpacity: 0.9,
    strokeWeight: 1,
    strokeColor: "#ffffff",
    scale: 1.5,
  };
};

interface MapViewProps {
  filters: FilterOptions;
}

export default function MapView({ filters }: MapViewProps): React.ReactElement {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);

  // Google Mapsの読み込み
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"] as const,
  });

  // Firestoreから店舗データを取得
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storesCollection = collection(db, "stores");
        const storeSnapshot = await getDocs(storesCollection);
        const storesList = storeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Store[];
        setStores(storesList);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    fetchStores();
  }, []);

  // ユーザーの現在地を取得
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  // マップのロード時にマップの参照を保存
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  // マップの中心をユーザーの位置に設定
  useEffect(() => {
    if (mapRef && userLocation) {
      mapRef.panTo(userLocation);
      mapRef.setZoom(14);
    }
  }, [mapRef, userLocation]);

  // マーカーがクリックされたときの処理
  const handleMarkerClick = (store: Store) => {
    setSelectedStore(store);
  };

  // InfoWindowが閉じられたときの処理
  const handleInfoWindowClose = () => {
    setSelectedStore(null);
  };

  if (loadError)
    return <div className="p-4 text-red-500">地図の読み込みに失敗しました</div>;
  if (!isLoaded) return <div className="p-4">地図を読み込み中...</div>;

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={userLocation || defaultCenter}
        zoom={14}
        onLoad={onMapLoad}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
      >
        {/* ユーザーの現在地のマーカー */}
        {userLocation && (
          <MarkerF
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            }}
          />
        )}

        {/* 店舗のマーカー */}
        {stores.map((store) => (
          <MarkerF
            key={store.id}
            position={{
              lat: store.location.latitude,
              lng: store.location.longitude,
            }}
            onClick={() => handleMarkerClick(store)}
            icon={getCongestionIcon(store.congestion?.level || 0)}
          />
        ))}

        {/* 選択された店舗の情報ウィンドウ */}
        {selectedStore && (
          <InfoWindowF
            position={{
              lat: selectedStore.location.latitude,
              lng: selectedStore.location.longitude,
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <StoreInfoCard store={selectedStore} />
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}
