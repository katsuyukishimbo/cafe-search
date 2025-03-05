"use client";

import React from "react";
import {
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  MapPinIcon,
  ClockIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import type { Store, App } from "../types/store";

interface CongestionLabel {
  label: string;
  className: string;
}

interface CongestionLabels {
  [key: number]: CongestionLabel;
}

interface Congestion {
  level: number;
  liveData: boolean;
  lastUpdated: {
    toDate: () => Date;
  };
}

interface Location {
  latitude: number;
  longitude: number;
}

interface PopularTimes {
  current: string | null;
}

// 混雑レベルに応じたラベルとスタイルを定義
const getCongestionInfo = (level: number): CongestionLabel => {
  const congestionLabels: CongestionLabels = {
    0: { label: "データなし", className: "congestion-unknown" },
    1: { label: "空いています", className: "congestion-empty" },
    2: { label: "やや混雑", className: "congestion-light" },
    3: { label: "混雑中", className: "congestion-medium" },
    4: { label: "かなり混雑", className: "congestion-high" },
    5: { label: "非常に混雑", className: "congestion-extreme" },
  };

  return congestionLabels[level] || congestionLabels[0];
};

// 最終更新時刻の表示
const getLastUpdatedText = (
  timestamp: { toDate: () => Date } | undefined
): string => {
  if (!timestamp) return "情報なし";

  const lastUpdated = timestamp.toDate();
  const now = new Date();
  const diffMinutes = Math.floor(
    (now.getTime() - lastUpdated.getTime()) / (1000 * 60)
  );

  if (diffMinutes < 1) return "数秒前";
  if (diffMinutes < 60) return `${diffMinutes}分前`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}時間前`;

  return lastUpdated.toLocaleDateString("ja-JP");
};

// 外部アプリアイコン
const getAppIcon = (type: App["type"]): string => {
  switch (type) {
    case "line":
      return "🟢"; // LINEの色をイメージした緑の丸
    case "ios":
      return "📱"; // iOSアプリ
    case "android":
      return "🤖"; // Androidアプリ
    case "web":
      return "🌐"; // Webサイト
    default:
      return "📱";
  }
};

export default function StoreInfoCard({
  store,
}: {
  store: Store;
}): React.ReactElement {
  const congestionInfo = getCongestionInfo(store.congestion?.level || 0);

  return (
    <div className="info-window">
      <h3 className="text-lg font-bold mb-2">{store.name}</h3>

      {/* 混雑状況 */}
      <div className="mb-4">
        <div className="flex items-center mb-1">
          <span
            className={`congestion-indicator ${congestionInfo.className}`}
          ></span>
          <span className="font-medium">{congestionInfo.label}</span>
        </div>
        <p className="text-xs text-gray-500">
          {store.congestion?.liveData ? "リアルタイムデータ" : "予測データ"} •
          更新: {getLastUpdatedText(store.congestion?.lastUpdated)}
        </p>
      </div>

      {/* 基本情報 */}
      <div className="mb-4">
        <div className="flex items-start mb-1">
          <MapPinIcon className="h-4 w-4 text-gray-500 mr-1 mt-1 flex-shrink-0" />
          <p className="text-sm text-gray-700">{store.address}</p>
        </div>

        {store.openingHours && (
          <div className="flex items-start mb-1">
            <ClockIcon className="h-4 w-4 text-gray-500 mr-1 mt-1 flex-shrink-0" />
            <p className="text-sm text-gray-700">{store.openingHours}</p>
          </div>
        )}
      </div>

      {/* 公式アプリへのリンク */}
      {store.officialApps && store.officialApps.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-semibold mb-2">公式アプリで詳細確認</h4>
          <div className="space-y-2">
            {store.officialApps.map((app, index) => (
              <a
                key={index}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
              >
                <span className="mr-2">{getAppIcon(app.type)}</span>
                <span className="text-sm">{app.name}</span>
                <ExternalLinkIcon className="h-4 w-4 ml-auto" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 人気の時間帯情報がある場合 */}
      {store.popularTimes && (
        <div className="mt-2">
          <details>
            <summary className="text-sm font-semibold cursor-pointer focus:outline-none">
              一般的な混雑状況
            </summary>
            <div className="mt-2 text-xs text-gray-600">
              <p>
                現在の時間帯の平均混雑度:{" "}
                {store.popularTimes.current || "情報なし"}
              </p>
              <p className="mt-1">※ 実際の混雑状況は異なる場合があります</p>
            </div>
          </details>
        </div>
      )}

      {/* Googleマップで見るリンク */}
      <div className="mt-3 pt-2 border-t border-gray-200">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${store.location.latitude},${store.location.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline flex items-center"
        >
          <InformationCircleIcon className="h-4 w-4 mr-1" />
          Google マップで見る
        </a>
      </div>
    </div>
  );
}
