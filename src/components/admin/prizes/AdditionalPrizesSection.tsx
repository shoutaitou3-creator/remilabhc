import React from 'react';
import AdditionalPrizeCard from './AdditionalPrizeCard';
import AdditionalPrizeEditForm from './AdditionalPrizeEditForm';

interface AdditionalPrize {
  id: string;
  name: string;
  description: string;
  value: string;
  amount: number;
  image?: string;
  department: 'both' | 'creative' | 'reality' | 'either';
  display_order: number;
}

interface AdditionalPrizesSectionProps {
  additionalPrizes: AdditionalPrize[];
  filteredPrizes: any[];
  editingAdditionalId: string | null;
  editAdditionalForm: AdditionalPrize | null;
  selectedFile: File | null;
  previewUrl: string;
  isUploading: boolean;
  uploadError: string;
  onEdit: (prize: AdditionalPrize) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onInputChange: (field: keyof AdditionalPrize, value: string | number) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadToSupabase: () => void;
  onDeleteImage: () => void;
  onMoveUp: (prizeId: string) => void;
  onMoveDown: (prizeId: string) => void;
}

const AdditionalPrizesSection: React.FC<AdditionalPrizesSectionProps> = ({
  additionalPrizes,
  filteredPrizes,
  editingAdditionalId,
  editAdditionalForm,
  selectedFile,
  previewUrl,
  isUploading,
  uploadError,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onInputChange,
  onFileSelect,
  onUploadToSupabase,
  onDeleteImage,
  onMoveUp,
  onMoveDown
}) => {
  const additionalPrizesFiltered = filteredPrizes.filter(p => p.type === 'additional');

  if (additionalPrizesFiltered.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">追加賞金・副賞</h3>
      <div className="space-y-4">
        {additionalPrizesFiltered.map((prize, index) => (
          <div key={prize.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {editingAdditionalId === prize.id && editAdditionalForm ? (
              <AdditionalPrizeEditForm
                editForm={editAdditionalForm}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                isUploading={isUploading}
                uploadError={uploadError}
                onSave={onSave}
                onCancel={onCancel}
                onDelete={onDelete}
                onInputChange={onInputChange}
                onFileSelect={onFileSelect}
                onUploadToSupabase={onUploadToSupabase}
                onDeleteImage={onDeleteImage}
              />
            ) : (
              <AdditionalPrizeCard
                prize={prize as AdditionalPrize}
                index={index}
                totalPrizes={additionalPrizesFiltered.length}
                onEdit={onEdit}
                onMoveUp={() => onMoveUp(prize.id)}
                onMoveDown={() => onMoveDown(prize.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalPrizesSection;