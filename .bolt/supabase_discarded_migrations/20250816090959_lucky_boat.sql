```sql
-- user_profiles テーブルの作成 (もし存在しない場合)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    role text NOT NULL DEFAULT 'editor',
    permissions jsonb NOT NULL DEFAULT '{"faq": false, "kpi": false, "news": false, "judges": false, "prizes": false, "settings": false, "sponsors": false, "dashboard": true, "workExamples": false}'::jsonb,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_login_at timestamp with time zone
);

-- ロール制約の追加 (もし存在しない場合)
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_role_check CHECK ((role = ANY (ARRAY['admin'::text, 'editor'::text])));

-- RLS (Row Level Security) の有効化
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除 (重複エラーを避けるため)
DROP POLICY IF EXISTS "Users can read own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own last_login" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all user profiles" ON public.user_profiles;

-- ポリシーの再作成
CREATE POLICY "Users can read own profile" ON public.user_profiles FOR SELECT TO authenticated USING (uid() = id);
CREATE POLICY "Users can update own last_login" ON public.user_profiles FOR UPDATE TO authenticated USING (uid() = id) WITH CHECK (uid() = id);

-- 管理者用のポリシー (adminロールのユーザーがすべてのプロフィールを管理できるようにする)
CREATE POLICY "Admins can manage all user profiles" ON public.user_profiles
    FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = uid() AND role = 'admin'));

-- user_profiles テーブルの updated_at を自動更新するトリガー関数 (もし存在しない場合)
CREATE OR REPLACE FUNCTION public.update_user_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- user_profiles テーブルにトリガーを設定 (もし存在しない場合)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at') THEN
        CREATE TRIGGER update_user_profiles_updated_at
        BEFORE UPDATE ON public.user_profiles
        FOR EACH ROW
        EXECUTE FUNCTION public.update_user_profile_updated_at();
    END IF;
END $$;

-- ユーザーが作成されたときに user_profiles にエントリを作成する関数 (auth.users のトリガー用)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- auth.users テーブルにトリガーを設定 (ユーザーが作成されたときに user_profiles に自動でエントリを作成)
-- このトリガーは、Supabase Auth のユーザー作成時に自動で user_profiles に連携するために重要です。
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```