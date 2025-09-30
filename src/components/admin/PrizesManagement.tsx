import React, { useState, useEffect } from 'react';
import PrizesHeader from './prizes/PrizesHeader';
import PrizesStats from './prizes/PrizesStats';
import PrizeSearchAndFilter from './prizes/PrizeSearchAndFilter';
import MainPrizesSection from './prizes/MainPrizesSection';
import AdditionalPrizesSection from './prizes/AdditionalPrizesSection';
import EmptyPrizesState from './prizes/EmptyPrizesState';
import { usePrizesData } from '../../hooks/usePrizesData';
import { usePrizesActions } from '../../hooks/usePrizesActions';
import { usePrizesEdit } from '../../hooks/usePrizesEdit';

const PrizesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // データ管理フック
  const {
    mainPrizes,
    setMainPrizes,
    additionalPrizes,
    setAdditionalPrizes,
    loading,
    setLoading,
    error,
    setError,
    fetchPrizes,
    calculateTotalAmount
  } = usePrizesData();

  // アクション管理フック
  const {
    selectedFile,
    previewUrl,
    isUploading,
    setIsUploading,
    uploadError,
    setUploadError,
    handleAddMainPrize,
    handleAddAdditionalPrize,
    handleMoveMainPrize,
    handleMoveAdditionalPrize,
    handleFileSelect,
    handleUploadToSupabase,
    handleDeleteImage
  } = usePrizesActions(
    mainPrizes,
    setMainPrizes,
    additionalPrizes,
    setAdditionalPrizes,
    setLoading,
    setError,
    fetchPrizes
  );

  // 編集管理フック
  const {
    editingMainId,
    editingAdditionalId,
    editMainForm,
    editAdditionalForm,
    handleEditMain,
    handleSaveMain,
    handleCancelMain,
    handleMainInputChange,
    handleEditAdditional,
    handleSaveAdditional,
    handleCancelAdditional,
    handleAdditionalInputChange,
    handleDeleteAdditional
  } = usePrizesEdit(
    mainPrizes,
    setMainPrizes,
    additionalPrizes,
    setAdditionalPrizes,
    fetchPrizes,
    setUploadError,
    setIsUploading
  );

  // 総額計算
  const totalAmount = calculateTotalAmount();

  // 検索・フィルタリング機能
  const allPrizes = [
    ...mainPrizes.map(p => ({ ...p, type: 'main' as const })),
    ...additionalPrizes.map(p => ({ ...p, type: 'additional' as const }))
  ];

  const filteredPrizes = allPrizes.filter(prize => {
    const matchesSearch = 
      ('title' in prize ? prize.title : prize.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      prize.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || prize.department === filterDepartment;
    const matchesType = filterType === 'all' || prize.type === filterType;
    
    return matchesSearch && matchesDepartment && matchesType;
  });

  // 検索・フィルターのリセット
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterDepartment('all');
    setFilterType('all');
  };

  // 新規追加時の編集開始
  const handleAddMainPrizeAndEdit = async () => {
    const newPrize = await handleAddMainPrize();
    if (newPrize) {
      handleEditMain(newPrize);
    }
  };

  const handleAddAdditionalPrizeAndEdit = async () => {
    const newPrize = await handleAddAdditionalPrize();
    if (newPrize) {
      handleEditAdditional(newPrize);
    }
  };

  // 追加賞金の保存処理（画像アップロード対応）
  const handleSaveAdditionalWithImage = async () => {
    if (!editAdditionalForm) return;

    let imageUrl = editAdditionalForm.image;
    
    // 新しい画像がある場合はアップロード
    if (selectedFile) {
      const uploadedUrl = await handleUploadToSupabase(editAdditionalForm);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        return; // アップロードに失敗した場合は保存を中止
      }
    }

    await handleSaveAdditional(imageUrl);
  };

  // 画像削除処理
  const handleDeleteImageWithForm = async () => {
    if (editAdditionalForm) {
      await handleDeleteImage(editAdditionalForm);
      setEditAdditionalForm({ ...editAdditionalForm, image: '' });
    }
  };

  return (
    <div>
      <PrizesHeader
        onAddMainPrize={handleAddMainPrizeAndEdit}
        onAddAdditionalPrize={handleAddAdditionalPrizeAndEdit}
      />

      <PrizeSearchAndFilter
        searchTerm={searchTerm}
        filterDepartment={filterDepartment}
        filterType={filterType}
        showFilters={showFilters}
        totalPrizes={allPrizes.length}
        filteredCount={filteredPrizes.length}
        onSearchChange={setSearchTerm}
        onFilterDepartmentChange={setFilterDepartment}
        onFilterTypeChange={setFilterType}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onResetFilters={handleResetFilters}
      />

      {/* エラー表示 */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => setError('')}
            type="button"
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            閉じる
          </button>
        </div>
      )}

      {/* ローディング表示 */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      )}

      {!loading && (
        <>
          <PrizesStats
            mainPrizes={mainPrizes}
            additionalPrizes={additionalPrizes}
            totalAmount={totalAmount}
          />

          {/* 賞金・賞品リスト */}
          {filteredPrizes.length > 0 ? (
            <div className="space-y-6">
              <MainPrizesSection
                mainPrizes={mainPrizes}
                filteredPrizes={filteredPrizes}
                editingMainId={editingMainId}
                editMainForm={editMainForm}
                isUploading={isUploading}
                uploadError={uploadError}
                onEdit={handleEditMain}
                onSave={handleSaveMain}
                onCancel={handleCancelMain}
                onInputChange={handleMainInputChange}
                onMoveUp={handleMoveMainPrize}
                onMoveDown={handleMoveMainPrize}
              />

              <AdditionalPrizesSection
                additionalPrizes={additionalPrizes}
                filteredPrizes={filteredPrizes}
                editingAdditionalId={editingAdditionalId}
                editAdditionalForm={editAdditionalForm}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                isUploading={isUploading}
                uploadError={uploadError}
                onEdit={handleEditAdditional}
                onSave={handleSaveAdditionalWithImage}
                onCancel={handleCancelAdditional}
                onDelete={handleDeleteAdditional}
                onInputChange={handleAdditionalInputChange}
                onFileSelect={handleFileSelect}
                onUploadToSupabase={() => handleUploadToSupabase(editAdditionalForm!)}
                onDeleteImage={handleDeleteImageWithForm}
                onMoveUp={handleMoveAdditionalPrize}
                onMoveDown={handleMoveAdditionalPrize}
              />
            </div>
          ) : (
            <EmptyPrizesState
              hasPrizes={allPrizes.length > 0}
              hasSearchResults={filteredPrizes.length > 0}
              onAddMainPrize={handleAddMainPrizeAndEdit}
              onAddAdditionalPrize={handleAddAdditionalPrizeAndEdit}
              onResetSearch={handleResetFilters}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PrizesManagement;