import React from 'react';
import { Search, Filter } from 'lucide-react';
import { NewsCategory } from '../../../hooks/useNewsCategoriesData';

interface NewsSearchAndFilterProps {
  searchTerm: string;
  selectedCategory: string;
  showFilters: boolean;
  filteredCount: number;
  totalCount: number;
  categories: Array<{ value: string; label: string }>;
  availableCategories: NewsCategory[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onToggleFilters: () => void;
  onResetFilters: () => void;
}

const NewsSearchAndFilter: React.FC<NewsSearchAndFilterProps> = ({
  searchTerm,
  selectedCategory,
  showFilters,
  filteredCount,
  totalCount,
  categories,
  availableCategories,
  onSearchChange,
  onCategoryChange,
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
            placeholder="タイトルまたは内容で検索..."
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
          </button>
          <div className="text-sm text-gray-500">
            {filteredCount}件 / {totalCount}件
          </div>
        </div>

        {/* フィルターオプション */}
        {showFilters && (
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-4">
              {/* 新しいカテゴリシステム */}
              {availableCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリで絞り込み</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onCategoryChange('all')}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                        selectedCategory === 'all'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      すべて
                    </button>
                    
                    {/* 有効なカテゴリ */}
                    {availableCategories.filter(cat => cat.is_active).map((category) => (
                      <button
                        key={`active-${category.id}`}
                        onClick={() => onCategoryChange(category.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                          selectedCategory === category.id
                            ? 'text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === category.id ? category.color : '#f3f4f6'
                        }}
                      >
                        {category.name}
                      </button>
                    ))}
                    
                    {/* 無効なカテゴリ */}
                    {availableCategories.filter(cat => !cat.is_active).map((category) => (
                      <button
                        key={`inactive-${category.id}`}
                        onClick={() => onCategoryChange(category.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] opacity-60 ${
                          selectedCategory === category.id
                            ? 'text-white'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === category.id ? category.color : '#f3f4f6'
                        }}
                      >
                        {category.name} （無効）
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 従来のカテゴリ（後方互換性のため） */}
              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">従来カテゴリ（後方互換性）</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => onCategoryChange(category.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                    selectedCategory === category.value
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
                  </div>
                </div>
              )}
            </div>
            
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={onResetFilters}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
              >
                検索条件をリセット
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSearchAndFilter;