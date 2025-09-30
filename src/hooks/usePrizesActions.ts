import { useState } from 'react';
import { supabaseAdmin, uploadImage, deleteImage, extractPathFromUrl } from '../lib/supabase';

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

export const usePrizesActions = (
  mainPrizes: MainPrize[],
  setMainPrizes: React.Dispatch<React.SetStateAction<MainPrize[]>>,
  additionalPrizes: AdditionalPrize[],
  setAdditionalPrizes: React.Dispatch<React.SetStateAction<AdditionalPrize[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
  fetchPrizes: () => Promise<void>
) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  // 新規メイン賞金追加
  const handleAddMainPrize = async () => {
    try {
      setLoading(true);
      setError('');

      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const maxOrder = mainPrizes.length > 0 ? Math.max(...mainPrizes.map(p => p.display_order || 0)) : 0;

      const { data, error } = await supabaseAdmin
        .from('main_prizes')
        .insert({
          rank: "新しい順位",
          title: "新しい賞",
          amount: "金額",
          description: "賞の説明を入力してください",
          icon: 'award',
          highlight: false,
          amount_value: 0,
          department: 'both',
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (error) {
        setError(`メイン賞金の追加に失敗しました: ${error.message}`);
        return;
      }

      const newPrize = data as MainPrize;
      setMainPrizes([...mainPrizes, newPrize]);
      return newPrize;
    } catch (err) {
      setError(`メイン賞金の追加に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 新規追加賞金追加
  const handleAddAdditionalPrize = async () => {
    try {
      setLoading(true);
      setError('');

      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const maxOrder = additionalPrizes.length > 0 ? Math.max(...additionalPrizes.map(p => p.display_order || 0)) : 0;

      const { data, error } = await supabaseAdmin
        .from('additional_prizes')
        .insert({
          name: "新しい賞",
          description: "賞の説明を入力してください",
          value: "金額・内容",
          amount: 0,
          image: "",
          department: 'both',
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (error) {
        setError(`追加賞金の追加に失敗しました: ${error.message}`);
        return;
      }

      const newPrize = data as AdditionalPrize;
      setAdditionalPrizes([...additionalPrizes, newPrize]);
      return newPrize;
    } catch (err) {
      setError(`追加賞金の追加に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // メイン賞金順序移動
  const handleMoveMainPrize = async (prizeId: string, direction: 'up' | 'down') => {
    try {
      setError('');
      
      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const currentIndex = mainPrizes.findIndex(p => p.id === prizeId);
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= mainPrizes.length) return;
      
      const updatedPrizes = [...mainPrizes];
      const [movedPrize] = updatedPrizes.splice(currentIndex, 1);
      updatedPrizes.splice(newIndex, 0, movedPrize);
      
      const prizesWithNewOrder = updatedPrizes.map((prize, index) => ({
        ...prize,
        display_order: index + 1
      }));
      
      setMainPrizes(prizesWithNewOrder);
      
      for (const prize of prizesWithNewOrder) {
        const { error } = await supabaseAdmin
          .from('main_prizes')
          .update({ display_order: prize.display_order })
          .eq('id', prize.id);

        if (error) {
          setError(`表示順序の更新に失敗しました: ${error.message}`);
          return;
        }
      }
    } catch (err) {
      setError(`表示順序の更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // 追加賞金順序移動
  const handleMoveAdditionalPrize = async (prizeId: string, direction: 'up' | 'down') => {
    try {
      setError('');
      
      if (!supabaseAdmin) {
        setError('管理者権限が必要です。VITE_SUPABASE_SERVICE_ROLE_KEY環境変数を設定してください。');
        return;
      }

      const currentIndex = additionalPrizes.findIndex(p => p.id === prizeId);
      if (currentIndex === -1) return;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= additionalPrizes.length) return;
      
      const updatedPrizes = [...additionalPrizes];
      const [movedPrize] = updatedPrizes.splice(currentIndex, 1);
      updatedPrizes.splice(newIndex, 0, movedPrize);
      
      const prizesWithNewOrder = updatedPrizes.map((prize, index) => ({
        ...prize,
        display_order: index + 1
      }));
      
      setAdditionalPrizes(prizesWithNewOrder);
      
      for (const prize of prizesWithNewOrder) {
        const { error } = await supabaseAdmin
          .from('additional_prizes')
          .update({ display_order: prize.display_order })
          .eq('id', prize.id);

        if (error) {
          setError(`表示順序の更新に失敗しました: ${error.message}`);
          return;
        }
      }
    } catch (err) {
      setError(`表示順序の更新に失敗しました: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // ファイル選択ハンドラ
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Supabaseアップロードハンドラ
  const handleUploadToSupabase = async (editAdditionalForm: AdditionalPrize) => {
    if (selectedFile && editAdditionalForm) {
      setIsUploading(true);
      setUploadError('');
      
      try {
        // 古い画像がある場合は削除
        if (editAdditionalForm.image) {
          const oldPath = extractPathFromUrl(editAdditionalForm.image, 'prizes-images');
          if (oldPath) {
            await deleteImage('prizes-images', oldPath);
          }
        }

        // ユニークなファイル名を生成
        const fileExtension = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
        const filePath = `prizes/${fileName}`;

        // Supabaseにアップロード
        const { url, error } = await uploadImage(selectedFile, 'prizes-images', filePath);
        
        if (error) {
          setUploadError(`アップロードに失敗しました: ${error}`);
          return null;
        }

        if (!url) {
          setUploadError('アップロードに失敗しました: URLが取得できませんでした');
          return null;
        }

        setSelectedFile(null);
        setPreviewUrl('');
        
        // ファイル入力をリセット
        const fileInput = document.getElementById('additional-prize-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        
        setUploadError('');
        return url;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setUploadError(`アップロードに失敗しました: ${errorMessage}`);
        return null;
      } finally {
        setIsUploading(false);
      }
    }
    return null;
  };

  // 画像削除ハンドラ
  const handleDeleteImage = async (editAdditionalForm: AdditionalPrize) => {
    if (editAdditionalForm?.image) {
      const imagePath = extractPathFromUrl(editAdditionalForm.image, 'prizes-images');
      if (imagePath) {
        await deleteImage('prizes-images', imagePath);
      }
    }

    setSelectedFile(null);
    setPreviewUrl('');
    
    const fileInput = document.getElementById('additional-prize-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return {
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
  };
};