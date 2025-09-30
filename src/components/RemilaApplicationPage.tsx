import React, { useState } from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  Phone, 
  Mail, 
  Building, 
  User, 
  MapPin,
  Zap,
  Star,
  Award,
  Users,
  TrendingUp,
  Shield,
  Clock
} from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const RemilaApplicationPage = () => {
  const { settings } = useSiteSettings();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    inquiryType: 'trial',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UIのみなので実際の送信処理は行わない
    alert('お申し込みありがとうございます。担当者よりご連絡いたします。（UIのみ）');
  };

  const features = [
    {
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      title: '業務効率化',
      description: '予約管理から顧客管理まで一元化'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      title: '売上向上',
      description: '顧客満足度向上で売上アップ'
    },
    {
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      title: '安心サポート',
      description: '導入から運用まで手厚いサポート'
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      title: '顧客管理',
      description: '詳細な顧客データ管理機能'
    }
  ];

  const plans = [
    {
      name: 'スタンダード',
      price: '月額 9,800円',
      features: ['基本機能', '顧客管理', 'メール配信', 'サポート'],
      recommended: false
    },
    {
      name: 'プロフェッショナル',
      price: '月額 19,800円',
      features: ['全機能', '高度な分析', 'API連携', '優先サポート'],
      recommended: true
    },
    {
      name: 'エンタープライズ',
      price: 'お問い合わせ',
      features: ['カスタム機能', '専用サポート', 'オンサイト研修', 'SLA保証'],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex flex-col">
      {/* メインコンテンツ */}
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ヘッダーセクション */}
          <div className="text-center mb-8 md:mb-12">
            <div className="mb-4 md:mb-6">
              <img 
                src="/remila_logo.png" 
                alt="REMILA" 
                className="h-10 md:h-14 w-auto mx-auto"
              />
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              REMILAレミラ 新規導入申し込み
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 px-2">
              有名トップスタイリストが多数導入している<br className="md:hidden" />
              美容室管理システム「レミラ」の導入をご検討ください。
            </p>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Star className="w-4 h-4" />
              <span>導入実績多数・満足度98%</span>
            </div>
          </div>

          {/* 特徴セクション */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 md:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* 料金プラン */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 md:mb-8">
              料金プラン
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white p-4 md:p-6 rounded-xl shadow-sm border-2 relative ${
                    plan.recommended 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200'
                  }`}
                >
                  {plan.recommended && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        おすすめ
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-4 md:mb-6">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="text-xl md:text-2xl font-bold text-blue-600">
                      {plan.price}
                    </div>
                  </div>
                  <ul className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm md:text-base text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 申し込みフォーム */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                お申し込み・お問い合わせ
              </h2>
              <p className="text-sm md:text-base text-gray-600">
                まずは無料トライアルからお試しください
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    会社名・サロン名 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="株式会社○○ / ○○サロン"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ご担当者名 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange('contactName', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="山田 太郎"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="example@salon.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      placeholder="03-0000-0000"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  住所
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    rows={2}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none"
                    placeholder="〒000-0000 都道府県市区町村..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  お問い合わせ種別 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  required
                >
                  <option value="trial">無料トライアル申し込み</option>
                  <option value="demo">デモンストレーション希望</option>
                  <option value="consultation">導入相談</option>
                  <option value="pricing">料金プランについて</option>
                  <option value="other">その他のお問い合わせ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ご質問・ご要望
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none"
                  placeholder="ご質問やご要望がございましたらお聞かせください"
                />
              </div>

              <div className="text-center pt-4 md:pt-6">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-4 px-6 md:px-12 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-base md:text-lg"
                >
                  お申し込み・お問い合わせ
                </button>
                <p className="text-xs md:text-sm text-gray-500 mt-3 md:mt-4">
                  送信後、担当者より2営業日以内にご連絡いたします
                </p>
              </div>
            </form>
          </div>

          {/* 導入実績 */}
          <div className="mt-8 md:mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 md:p-8 rounded-xl border border-blue-200">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                導入実績
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1">1,200+</div>
                  <div className="text-xs md:text-sm text-gray-600">導入サロン数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1">98%</div>
                  <div className="text-xs md:text-sm text-gray-600">顧客満足度</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1">24時間</div>
                  <div className="text-xs md:text-sm text-gray-600">サポート対応</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1">5年</div>
                  <div className="text-xs md:text-sm text-gray-600">運用実績</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-3 md:mb-4">
              <h3 className="text-base md:text-lg font-bold mb-2">REMILAレミラ</h3>
              <p className="text-xs md:text-sm text-gray-400 px-2">
                有名トップスタイリストが多数導入。
              </p>
            </div>
            
            <div className="space-y-1 md:space-y-2 text-gray-400 text-xs md:text-sm">
              <div>
                <a 
                  href={settings?.company_url || "https://resusty.co.jp/"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors break-words"
                >
                  {settings?.company_name || '株式会社リサスティー'}
                </a>
              </div>
              <div>
                <a 
                  href={`mailto:${settings?.contact_email || 'info@remilabhc.com'}`}
                  className="text-blue-400 hover:text-blue-300 transition-colors break-words"
                >
                  お問い合わせ: {settings?.contact_email || 'info@remilabhc.com'}
                </a>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-3 md:pt-4 mt-3 md:mt-4">
              <p className="text-gray-500 text-xs md:text-sm">
                © 2026 {settings?.company_name || 'レミラ'}. All rights reserved.
              </p>
              <div className="mt-2 md:mt-3">
                <a
                  href="/download"
                  className="text-blue-400 hover:text-blue-300 transition-colors text-xs md:text-sm underline"
                >
                  資料ダウンロードページに戻る
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RemilaApplicationPage;