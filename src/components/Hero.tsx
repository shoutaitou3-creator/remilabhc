import React from 'react';
import AnimatedSection from './AnimatedSection';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-gray-100 py-12 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/remila_photo.jpg')] bg-cover bg-center opacity-30"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="text-center mb-12">
            <AnimatedSection animationType="slideRight" delay={400}>
              <div>
                <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                  <span className="text-4xl text-rose-600">業界初！</span><br />
                  REMILA<br />
                  <span className="text-4xl">Back Style Hair Contest 2026</span><br />
                  <span className="text-lg text-gray-600 font-normal">レミラバックスタイルヘアコンテスト2026</span>
                </h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              あなたの技術で「後ろ姿美」を表現してみませんか？
            </h2>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animationType="fadeIn" delay={1000}>
            <div className="max-w-4xl mx-auto space-y-4 text-gray-700">
              <p className="text-lg">
                <span className="font-bold text-purple-700">総額1000万円超の賞金・賞品</span>を誇る業界初のバックスタイル特化コンテスト
              </p>
              <p className="text-lg">
                全国の美容師・理容師が技術を競う大規模コンテストで、<span className="font-bold text-rose-700">あなたの技術力を証明</span>しませんか？
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animationType="scaleUp" delay={1200}>
            <div className="mt-8">
              <a 
                href="#entry" 
                className="block w-full sm:inline-block sm:w-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-4 px-4 sm:px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-lg mb-4 sm:mb-0 sm:mr-4 text-center relative z-10"
              >
                @remila_bhcをフォローしてエントリー
              </a>
              <a href="#contest-details" className="inline-block w-auto bg-white text-purple-600 border-2 border-blue-400 font-bold py-4 px-6 sm:px-12 transition-all duration-300 hover:bg-purple-50 text-lg text-center">詳細を見る</a>
            </div>
          </AnimatedSection>
        </div>
      </div>
      </div>
      
    </section>
  );
};

export default Hero;