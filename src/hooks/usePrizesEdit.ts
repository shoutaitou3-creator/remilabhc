import { useState } from 'react';
import { supabaseAdmin } from '../lib/supabase';

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

export const usePrizesEdit = (
  mainPrizes: MainPrize[],
  setMainPrizes: React.Dispatch<React.SetStateAction<MainPrize[]>>,
  additionalPrizes: AdditionalPrize[],
  setAdditionalPrizes: React.Dispatch<React.SetStateAction<AdditionalPrize[]>>,
  fetchPrizes: () => Promise<void>,
  setUploadError: React.Dispatch<React.SetStateAction<string>>,
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const [editingMainId, setEditingMainId] = useState<string | null>(null);
  const [editingAdditionalId, setEditingAdditionalId] = useState<string | null>(null);
  const [editMainForm, setEditMainForm] = useState<MainPrize | null>(null);
  const [editAdditionalForm, setEditAdditionalForm] = useState<AdditionalPrize | null>(null);

  // メイン賞金編集
  const handleEditMain = (prize: MainPrize) => {
    setEditingMainId(prize.id);
    setEditMainForm({ ...prize });
    setUploadError('');
  };

  const handleSaveMain = async () => {
    if (editMainForm) {
      try {
        setIsUploading(true);
        setUploadError('');

        if (!supabaseAdmin) {
          setUploadError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        const { error } = await supabaseAdmin
          .from('main_prizes')
          .update({
            rank: editMainForm.rank,
            title: editMainForm.title,
            amount: editMainForm.amount,
            description: editMainForm.description,
            icon: editMainForm.icon,
            highlight: editMainForm.highlight,
            amount_value: editMainForm.amount_value,
            department: editMainForm.department,
            updated_at: new Date().toISOString()
          })
          .eq('id', editMainForm.id);

        if (error) {
          setUploadError(`保存に失敗しました: ${error.message}`);
          return;
        }

        setMainPrizes(mainPrizes.map(prize => 
          prize.id === editMainForm.id ? editMainForm : prize
        ));
        
        setEditingMainId(null);
        setEditMainForm(null);
        setUploadError('');
        
        await fetchPrizes();
        alert('メイン賞金情報を保存しました');
      } catch (err) {
        setUploadError(`保存に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCancelMain = () => {
    setEditingMainId(null);
    setEditMainForm(null);
    setUploadError('');
  };

  const handleMainInputChange = (field: keyof MainPrize, value: string | boolean | number) => {
    if (editMainForm) {
      if (field === 'amount_value') {
        const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^\d]/g, '')) || 0 : value;
        setEditMainForm({ ...editMainForm, [field]: numericValue });
      } else {
        setEditMainForm({ ...editMainForm, [field]: value });
      }
    }
  };

  // 追加賞金編集
  const handleEditAdditional = (prize: AdditionalPrize) => {
    setEditingAdditionalId(prize.id);
    setEditAdditionalForm({ ...prize });
    setUploadError('');
  };

  const handleSaveAdditional = async (imageUrl?: string) => {
    if (editAdditionalForm) {
      try {
        setIsUploading(true);
        setUploadError('');

        if (!supabaseAdmin) {
          setUploadError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        const updateData = {
          name: editAdditionalForm.name,
          description: editAdditionalForm.description,
          value: editAdditionalForm.value,
          amount: editAdditionalForm.amount,
          image: imageUrl || editAdditionalForm.image || '',
          department: editAdditionalForm.department,
          updated_at: new Date().toISOString()
        };

        const { error } = await supabaseAdmin
          .from('additional_prizes')
          .update(updateData)
          .eq('id', editAdditionalForm.id);

        if (error) {
          setUploadError(`保存に失敗しました: ${error.message}`);
          return;
        }

        const updatedForm = { ...editAdditionalForm, image: imageUrl || editAdditionalForm.image };
        setAdditionalPrizes(additionalPrizes.map(prize => 
          prize.id === editAdditionalForm.id ? updatedForm : prize
        ));
        
        setEditingAdditionalId(null);
        setEditAdditionalForm(null);
        setUploadError('');
        
        await fetchPrizes();
        alert('追加賞金情報を保存しました');
      } catch (err) {
        setUploadError(`保存に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCancelAdditional = () => {
    setEditingAdditionalId(null);
    setEditAdditionalForm(null);
    setUploadError('');
  };

  const handleAdditionalInputChange = (field: keyof AdditionalPrize, value: string | number) => {
    if (editAdditionalForm) {
      if (field === 'amount') {
        const numericValue = typeof value === 'string' ? parseInt(value.replace(/[^\d]/g, '')) || 0 : value;
        setEditAdditionalForm({ ...editAdditionalForm, [field]: numericValue });
      } else {
        setEditAdditionalForm({ ...editAdditionalForm, [field]: value });
      }
    }
  };

  // 追加賞金削除
  const handleDeleteAdditional = async (id: string) => {
    if (confirm('この賞を削除しますか？')) {
      try {
        setIsUploading(true);
        setUploadError('');

        if (!supabaseAdmin) {
          setUploadError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
          return;
        }

        // 画像も削除
        const prize = additionalPrizes.find(p => p.id === id);
        if (prize?.image) {
          const imagePath = extractPathFromUrl(prize.image, 'prizes-images');
          if (imagePath) {
            await deleteImage('prizes-images', imagePath);
          }
        }

        const { error } = await supabaseAdmin
          .from('additional_prizes')
          .delete()
          .eq('id', id);

        if (error) {
          setUploadError(`賞の削除に失敗しました: ${error.message}`);
          return;
        }

        setAdditionalPrizes(additionalPrizes.filter(prize => prize.id !== id));
        alert('賞が削除されました。');
      } catch (err) {
        setUploadError(`賞の削除に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return {
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
  };
};