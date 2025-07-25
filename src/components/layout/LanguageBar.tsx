import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages } from '@/lib/languages';

export const LanguageBar: React.FC = () => {
  const { currentLanguage, setCurrentLanguage, t } = useLanguage();

  return (
    <div className="language-bar z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-2 lg:py-3 w-full relative overflow-hidden">
      {/* Background Pattern - matching Footer */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      <div className="relative px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-2">
          <span className="font-semibold text-white flex-shrink-0 text-xs sm:text-sm tracking-tight mb-1 sm:mb-0">{t('language.select')}:</span>
          <div className="flex items-center flex-wrap gap-1 sm:gap-2 justify-center">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => setCurrentLanguage(language.code)}
                className={`group relative flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all duration-300 font-medium text-xs sm:text-sm ${
                  currentLanguage === language.code
                    ? 'bg-red-600 text-white font-semibold shadow-lg'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-red-600/80 hover:text-white border border-slate-600/50 hover:border-red-500/50'
                }`}
              >
                <img src={language.flagUrl} alt={language.country} className="w-4 h-3 object-cover rounded-sm" />
                <span className="text-xs sm:text-sm font-medium">{language.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};