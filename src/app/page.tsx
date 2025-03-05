"use client";

import React from "react";
import { useState } from "react";
import MapView from "../components/MapView";
import FilterPanel from "../components/FilterPanel";
import type { FilterOptions } from "../components/FilterPanel";

export default function Home(): React.ReactElement {
  const [filters, setFilters] = useState<FilterOptions>({
    types: null,
    congestion: null,
    onlyWithApps: false,
  });

  // フィルターの変更を処理
  const handleFilterChange = (newFilters: FilterOptions): void => {
    setFilters(newFilters);
  };

  return (
    <div className="relative h-full">
      <MapView filters={filters} />
      <FilterPanel onFilterChange={handleFilterChange} />

      {/* レジェンド（凡例） */}
      <div className="absolute bottom-4 left-4 p-3 bg-white rounded-lg shadow-md z-10">
        <h3 className="text-sm font-medium text-gray-700 mb-2">混雑度の凡例</h3>
        <div className="space-y-1">
          <div className="flex items-center">
            <span className="congestion-indicator congestion-empty"></span>
            <span className="text-xs text-gray-600">空いている</span>
          </div>
          <div className="flex items-center">
            <span className="congestion-indicator congestion-light"></span>
            <span className="text-xs text-gray-600">やや混雑</span>
          </div>
          <div className="flex items-center">
            <span className="congestion-indicator congestion-medium"></span>
            <span className="text-xs text-gray-600">混雑中</span>
          </div>
          <div className="flex items-center">
            <span className="congestion-indicator congestion-high"></span>
            <span className="text-xs text-gray-600">かなり混雑</span>
          </div>
          <div className="flex items-center">
            <span className="congestion-indicator congestion-extreme"></span>
            <span className="text-xs text-gray-600">非常に混雑</span>
          </div>
          <div className="flex items-center">
            <span className="congestion-indicator congestion-unknown"></span>
            <span className="text-xs text-gray-600">データなし</span>
          </div>
        </div>
      </div>
    </div>
  );
}
