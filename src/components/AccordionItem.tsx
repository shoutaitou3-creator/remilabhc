import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  icon: React.ReactNode;
  summary: string;
  details: string[];
  isOpen?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ 
  title, 
  icon, 
  summary, 
  details, 
  isOpen = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);

  return (
    <div className="bg-white shadow-lg border border-gray-100 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50">
              {icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600">{summary}</p>
            </div>
          </div>
          <div className="flex-shrink-0 ml-4">
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-gray-400" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 bg-gradient-to-br from-gray-50 to-white">
          <div className="pt-4 space-y-3">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700 leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccordionItem;