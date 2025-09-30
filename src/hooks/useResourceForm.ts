import { useState } from 'react';
import { ResourceFormData } from '../types/resourceDownload';

export const useResourceForm = (initialData?: Partial<ResourceFormData>) => {
  const [formData, setFormData] = useState<ResourceFormData>({
    title: '',
    description: '',
    category_id: null,
    uploadedFile: null,
    uploadedFileUrl: '',
    iconFile: null,
    iconUrl: '',
    is_published: true,
    ...initialData
  });

  // 入力変更ハンドラ
  const handleInputChange = (field: keyof ResourceFormData, value: string | boolean | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ファイル選択ハンドラ
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        uploadedFile: file,
        uploadedFileUrl: URL.createObjectURL(file)
      }));
    }
  };

  // ファイル削除ハンドラ
  const handleFileDelete = () => {
    setFormData(prev => ({
      ...prev,
      uploadedFile: null,
      uploadedFileUrl: ''
    }));
  };

  // アイコンファイル選択ハンドラ
  const handleIconSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ファイルサイズチェック（1MB制限）
      if (file.size > 1024 * 1024) {
        alert('アイコンファイルのサイズは1MB以下にしてください。');
        return;
      }

      // ファイル形式チェック
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('アイコンファイルはJPG、PNG、GIFのみ対応しています。');
        return;
      }

      setFormData(prev => ({
        ...prev,
        iconFile: file,
        iconUrl: URL.createObjectURL(file)
      }));
    }
  };

  // アイコン削除ハンドラ
  const handleIconDelete = () => {
    setFormData(prev => ({
      ...prev,
      iconFile: null,
      iconUrl: ''
    }));
  };
  // フォームリセット
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category_id: null,
      uploadedFile: null,
      uploadedFileUrl: '',
      iconFile: null,
      iconUrl: '',
      is_published: true
    });
  };

  // バリデーション
  const isValid = formData.title.trim() !== '' && formData.description.trim() !== '';

  return {
    formData,
    handleInputChange,
    handleFileSelect,
    handleFileDelete,
    handleIconSelect,
    handleIconDelete,
    resetForm,
    isValid
  };
};