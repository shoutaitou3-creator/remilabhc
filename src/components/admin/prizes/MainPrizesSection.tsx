import React from 'react';
import MainPrizeCard from './MainPrizeCard';
import MainPrizeEditForm from './MainPrizeEditForm';

interface MainPrize {
  id: string;
  rank: string;
  title: string;
  amount: string;
  description: string;
  icon: string;
  highlight: boolean;
  amount_value: number;
  department: 'both' | 'creative' | 'reality' | 'either';
  display_order: number;
}

interface MainPrizesSectionProps {
  mainPrizes: MainPrize[];
  filteredPrizes: any[];
  editingMainId: string | null;
  editMainForm: MainPrize | null;
  isUploading: boolean;
  uploadError: string;
  onEdit: (prize: MainPrize) => void;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (field: keyof MainPrize, value: string | boolean | number) => void;
  onMoveUp: (prizeId: string) => void;
  onMoveDown: (prizeId: string) => void;
}

const MainPrizesSection: React.FC<MainPrizesSectionProps> = ({
  mainPrizes,
  filteredPrizes,
  editingMainId,
  editMainForm,
  isUploading,
  uploadError,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onMoveUp,
  onMoveDown
}) => {
  const mainPrizesFiltered = filteredPrizes.filter(p => p.type === 'main');

  if (mainPrizesFiltered.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">メイン賞金</h3>
      <div className="space-y-4">
        {mainPrizesFiltered.map((prize, index) => (
          <div key={prize.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {editingMainId === prize.id && editMainForm ? (
              <MainPrizeEditForm
                editForm={editMainForm}
                isUploading={isUploading}
                uploadError={uploadError}
                onSave={onSave}
                onCancel={onCancel}
                onInputChange={onInputChange}
              />
            ) : (
              <MainPrizeCard
                prize={prize as MainPrize}
                index={index}
                totalPrizes={mainPrizesFiltered.length}
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

export default MainPrizesSection;