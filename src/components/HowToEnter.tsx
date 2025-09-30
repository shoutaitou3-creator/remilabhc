import React from 'react';
import { Instagram, Camera, Hash, Users, CheckCircle, AlertCircle } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import { useSiteSettings } from '../hooks/useSiteSettings';

const HowToEnter = () => {
  const { settings } = useSiteSettings();

  const steps = [
    {
      number: "01",
      icon: <Instagram className="w-8 h-8 text-pink-600" />,
      title: "Instagramでフォロー",
      description: "@remila_bhcをフォローしてください",
      detail: "公式アカウントをフォローすることで、最新情報やコンテストの進行状況をリアルタイムで確認できます。"
    },
    {
      number: "02",
      icon: <Camera className="w-8 h-8 text-blue-600" />,
      title: "作品を撮影",
      description: "バックスタイルの美しさを最大限に表現",
      detail: "クリエイティブ部門は1枚、リアリティー部門はビフォー1枚＋アフター2枚を撮影してください。"
    },
    {
      number: "03",
      icon: <Hash className="w-8 h-8 text-purple-600" />,
      title: "タグ付け・ハッシュタグ投稿",
      description: "指定ハッシュタグで応募完了",
      detail: "クリエイティブ部門は#レミラバックスタイルC、リアリティー部門は#レミラバックスタイルRを使用"
    }
  ];

  const departments = [
    {
      title: "A クリエイティブ部門",
      subtitle: "創造力とデザイン性を競う",
      hashtag: "#レミラバックスタイルC",
      requirements: [
        "@remila_bhcをタグ付け＋バックスタイル作品（1枚）を投稿",
        "カット・カラー・パーマ・セット・アレンジ・ウィッグ・ヘアアクセサリー等すべて使用可能",
        "自由な発想でバックスタイルの美しさを表現"
      ],
      bgColor: "from-blue-50 to-purple-50",
      borderColor: "border-blue-200"
    },
    {
      title: "B リアリティー部門",
      subtitle: "レミラ導入店限定",
      hashtag: "#レミラバックスタイルR",
      requirements: [
        "@remila_bhcをタグ付け＋ビフォー（1枚）＆アフター（2枚）を投稿",
        "お客様の悩み・要望に寄り添った技術力を表現",
        "背景ストーリーのキャプションも重要な審査要素"
      ],
      bgColor: "from-rose-50 to-pink-50",
      borderColor: "border-rose-200"
    }
  ];

  return (
    <section id="how-to-enter" className="py-12 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="fadeIn" className="text-center mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">応募方法</h2>
            <p className="text-lg text-gray-600">簡単3ステップでエントリー完了！</p>
          </div>
        </AnimatedSection>

        {/* 応募ステップ */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <AnimatedSection key={index} animationType="scaleUp" delay={index * 200}>
              <div className="text-center p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-none transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-[#87B9CE] to-[#87B9CE]/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white font-bold text-lg">{step.number}</span>
                </div>
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4 font-medium">{step.description}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{step.detail}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* 部門詳細 */}
        <AnimatedSection animationType="slideUp" className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">応募部門</h3>
            <p className="text-lg text-gray-600">2つの部門からお選びください（両方への応募も可能）</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {departments.map((dept, index) => (
              <AnimatedSection key={index} animationType="slideUp" delay={index * 200}>
                <div className={`bg-gradient-to-br ${dept.bgColor} p-8 h-full shadow-2xl`}>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">{dept.title}</h4>
                  <p className="text-gray-600 mb-4">{dept.subtitle}</p>
                  <div className="bg-white p-3 mb-6 border border-gray-200">
                    <p className="font-mono text-lg font-bold text-center" style={{ color: '#87B9CE' }}>{dept.hashtag}</p>
                  </div>
                  <ul className="space-y-3">
                    {dept.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </AnimatedSection>

        {/* 重要な注意事項 */}
        <AnimatedSection animationType="fadeIn">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-8">
            <div className="flex items-start space-x-4">
              <AlertCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold text-red-800 mb-4">重要な注意事項</h4>
                <ul className="space-y-2 text-red-700">
                  <li>• モデル・お客様の顔出しは禁止です（バックスタイルのみで構成してください）</li>
                  <li>• 生成AIの使用は禁止です</li>
                  <li>• リアリティー部門に限り、レタッチ（画像加工）を禁止します</li>
                  <li>• 両部門への応募も可能です</li>
                </ul>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection animationType="scaleUp" className="mt-16 text-center">
          <div className="bg-gradient-to-r from-[#87B9CE]/50 via-[#87B9CE] to-[#87B9CE]/50 text-white p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 drop-shadow-lg">準備はできましたか？</h3>
            <p className="text-lg mb-6 text-shadow-strong">
              あなたの技術で「後ろ姿美」を表現し、<br />
              業界初のコンテストで歴史を作りましょう！
            </p>
            <a 
              href={settings?.instagram_url || "https://www.instagram.com/remila_bhc/"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full sm:inline-block sm:w-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-4 px-4 sm:px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg text-center relative z-10"
            >
              @remila_bhcをフォローしてエントリー
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default HowToEnter;