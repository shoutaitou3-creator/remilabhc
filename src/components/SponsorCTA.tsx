import React from 'react';
import AnimatedSection from './AnimatedSection';
import { useSiteSettings } from '../hooks/useSiteSettings';

const SponsorCTA = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animationType="slideUp" className="text-center">
          <div className="bg-gradient-to-r from-[#87B9CE]/50 via-[#87B9CE] to-[#87B9CE]/50 text-white p-8 max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 drop-shadow-lg">豪華賞品を目指してエントリーしよう</h3>
            <p className="text-xl mb-8 leading-relaxed text-shadow-strong">
              協賛企業様からの豪華賞品が多数用意されています。<br />
              あなたの技術力で、これらの賞品を獲得しませんか？
            </p>
            <a 
              href="#entry"
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

export default SponsorCTA;