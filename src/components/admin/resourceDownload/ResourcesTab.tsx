import React from 'react';
import { Plus } from 'lucide-react';
import { Resource, ResourceFormData } from '../../../types/resourceDownload';
import ResourceCard from './ResourceCard';
import ResourceEditForm from './ResourceEditForm';
import AddResourceModal from './AddResourceModal';

interface ResourcesTabProps {
  resources: Resource[];
  editingResourceId: string | null;
  showAddForm: boolean;
  editForm: ResourceFormData;
  addForm: ResourceFormData;
  onEdit: (resource: Resource) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (resourceId: string) => void;
  onAdd: () => void;
  onAddSave: () => void;
  onAddCancel: () => void;
  onInputChange: (field: keyof ResourceFormData, value: string | boolean | File | null) => void;
  onAddInputChange: (field: keyof ResourceFormData, value: string | boolean | File | null) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onIconSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddIconSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDelete: () => void;
  onAddFileDelete: () => void;
  onIconDelete: () => void;
  onAddIconDelete: () => void;
  onEditIconUpload: () => void;
  onAddIconUpload: () => void;
  isIconUploading: boolean;
  iconUploadError: string;
  formatFileSize: (bytes: number) => string;
}

const ResourcesTab: React.FC<ResourcesTabProps> = ({
  resources,
  editingResourceId,
  showAddForm,
  editForm,
  addForm,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onAdd,
  onAddSave,
  onAddCancel,
  onInputChange,
  onAddInputChange,
  onFileSelect,
  onAddFileSelect,
  onIconSelect,
  onAddIconSelect,
  onFileDelete,
  onAddFileDelete,
  onIconDelete,
  onAddIconDelete,
  onEditIconUpload,
  onAddIconUpload,
  isIconUploading,
  iconUploadError,
  formatFileSize
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-900">資料設定</h3>
        <button 
          onClick={onAdd}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新しい資料を追加</span>
        </button>
      </div>

      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            {editingResourceId === resource.id ? (
              <ResourceEditForm
                formData={editForm}
                onSave={onSave}
                onCancel={onCancel}
                onDelete={() => onDelete(resource.id)}
                onInputChange={onInputChange}
                onFileSelect={onFileSelect}
                onIconSelect={onIconSelect}
                onFileDelete={onFileDelete}
                onIconDelete={onIconDelete}
                onIconUpload={onEditIconUpload}
                isIconUploading={isIconUploading}
                iconUploadError={iconUploadError}
                formatFileSize={formatFileSize}
              />
            ) : (
              <ResourceCard
                resource={resource}
                onEdit={onEdit}
              />
            )}
          </div>
        ))}
      </div>

      {/* 新規追加フォーム（モーダル） */}
      <AddResourceModal
        isOpen={showAddForm}
        formData={addForm}
        onClose={onAddCancel}
        onSave={onAddSave}
        onInputChange={onAddInputChange}
        onFileSelect={onAddFileSelect}
        onIconSelect={onAddIconSelect}
        onFileDelete={onAddFileDelete}
        onIconDelete={onAddIconDelete}
        onIconUpload={onAddIconUpload}
        isIconUploading={isIconUploading}
        iconUploadError={iconUploadError}
        formatFileSize={formatFileSize}
      />
    </div>
  );
};

export default ResourcesTab;