import React from 'react';

const ContactLink: React.FC = () => {
  return (
    <div className="mt-8 text-center">
      <p className="text-base md:text-lg text-gray-700">
        レミラのお問い合わせは
        <a
          href="https://remila.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium mx-1"
        >
          こちら
        </a>
        から
      </p>
    </div>
  );
};

export default ContactLink;