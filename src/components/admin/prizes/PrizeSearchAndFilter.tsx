import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface PrizeSearchAndFilterProps {
  searchTerm: string;
  filterDepartment: string;
  filterType: string;
  showFilters: boolean;
  totalPrizes: number;
  filteredCount: number;
  onSearchChange: (value: string) => void;
  onFilterDepartmentChange: (value: string) => void;
  onFilterTypeChange: (value: string) => void;
  onToggleFilters: () => void;
  onResetFilters: () => void;
}

const PrizeSearchAndFilter: React.FC<PrizeSearchAndFilterProps> = ({
  searchTerm,
  filterDepartment,
  filterType,
  showFilters,
  totalPrizes,
  filteredCount,
  onSearchChange,
  onFilterDepartmentChange,
  onFilterTypeChange,
  onToggleFilters,
  onResetFilters
}) => {
  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="space-y-4">
        {/* 検索バー */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="賞名または説明で検索..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
          />
        </div>

        {/* フィルターボタン */}
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleFilters}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px]"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">フィルター</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          <div className="text-sm text-gray-500">
            {filteredCount}件 / {totalPrizes}件
          </div>
        </div>

        {/* フィルターオプション */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">対象部門</label>
                <select
                  value={filterDepartment}
                  onChange={(e) => onFilterDepartmentChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                >
                  <option value="all">すべて</option>
                  <option value="both">両部門それぞれ</option>
                  <option value="creative">クリエイティブ部門</option>
                  <option value="reality">リアリティー部門</option>
                  <option value="either">どちらか</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">賞の種類</label>
                <select
                  value={filterType}
                  onChange={(e) => onFilterTypeChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-base"
                >
                  <option value="all">すべて</option>
                  <option value="main">メイン賞金</option>
                  <option value="additional">追加賞金・副賞</option>
                </select>
              </div>
            </div>
            
            {(searchTerm || filterDepartment !== 'all' || filterType !== 'all') && (
              <div className="mt-4">
                <button
                  onClick={onResetFilters}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  検索条件をリセット
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrizeSearchAndFilter;