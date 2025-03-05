"use client";

import React from "react";
import { useState } from "react";
import {
  AdjustmentsHorizontalIcon as AdjustmentsIcon,
  XMarkIcon as XIcon,
} from "@heroicons/react/24/outline";

interface StoreType {
  id: string;
  name: string;
}

interface CongestionLevel {
  id: number;
  name: string;
  color: string;
}

export interface FilterOptions {
  types: string[] | null;
  congestion: number[] | null;
  onlyWithApps: boolean;
}

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const storeTypes: StoreType[] = [
  { id: "cafe", name: "カフェ" },
  { id: "restaurant", name: "レストラン" },
  { id: "family_restaurant", name: "ファミレス" },
  { id: "fast_food", name: "ファストフード" },
  { id: "bakery", name: "ベーカリー" },
];

const congestionLevels: CongestionLevel[] = [
  { id: 1, name: "空いている", color: "bg-congestion-empty" },
  { id: 2, name: "やや混雑", color: "bg-congestion-light" },
  { id: 3, name: "混雑中", color: "bg-congestion-medium" },
  { id: 4, name: "かなり混雑", color: "bg-congestion-high" },
  { id: 5, name: "非常に混雑", color: "bg-congestion-extreme" },
];

export default function FilterPanel({
  onFilterChange,
}: FilterPanelProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCongestion, setSelectedCongestion] = useState<number[]>([]);
  const [onlyWithApps, setOnlyWithApps] = useState<boolean>(false);

  // フィルターの変更を親コンポーネントに通知
  const applyFilters = (): void => {
    onFilterChange({
      types: selectedTypes.length > 0 ? selectedTypes : null,
      congestion: selectedCongestion.length > 0 ? selectedCongestion : null,
      onlyWithApps,
    });
  };

  // 店舗タイプの選択を切り替え
  const toggleType = (typeId: string): void => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  // 混雑レベルの選択を切り替え
  const toggleCongestion = (levelId: number): void => {
    setSelectedCongestion((prev) =>
      prev.includes(levelId)
        ? prev.filter((id) => id !== levelId)
        : [...prev, levelId]
    );
  };

  // フィルタ適用ボタン
  const handleApply = (): void => {
    applyFilters();
    setIsOpen(false);
  };

  // フィルタリセットボタン
  const handleReset = (): void => {
    setSelectedTypes([]);
    setSelectedCongestion([]);
    setOnlyWithApps(false);
    onFilterChange({
      types: null,
      congestion: null,
      onlyWithApps: false,
    });
  };

  return (
    <div className="filter-panel relative z-10">
      {/* フィルターボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-4 right-4 z-10 bg-white p-3 rounded-full shadow-md hover:bg-gray-50"
        aria-label="フィルター"
      >
        <AdjustmentsIcon className="h-5 w-5 text-gray-600" />
      </button>

      {/* フィルターパネル */}
      {isOpen && (
        <div className="absolute top-4 right-4 w-72 bg-white rounded-lg shadow-lg p-4 mt-12">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">フィルター</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* 店舗タイプのフィルター */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              店舗タイプ
            </h4>
            <div className="space-y-2">
              {storeTypes.map((type) => (
                <label key={type.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.id)}
                    onChange={() => toggleType(type.id)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">{type.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 混雑度フィルター */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">混雑状況</h4>
            <div className="space-y-2">
              {congestionLevels.map((level) => (
                <label key={level.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCongestion.includes(level.id)}
                    onChange={() => toggleCongestion(level.id)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span
                    className={`congestion-indicator ${level.color}`}
                  ></span>
                  <span className="text-sm text-gray-700">{level.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 公式アプリがある店舗のみ表示 */}
          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={onlyWithApps}
                onChange={() => setOnlyWithApps(!onlyWithApps)}
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                公式アプリがある店舗のみ
              </span>
            </label>
          </div>

          {/* フィルター適用ボタン */}
          <div className="flex space-x-2">
            <button
              onClick={handleReset}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
            >
              リセット
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              適用する
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
