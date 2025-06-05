import React from 'react';
import { useTheme } from '../context/ThemeContext';

function Card({
  children,
  title,
  subtitle,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer,
  onClick,
}) {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`rounded-lg shadow-sm border overflow-hidden ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle) && (
        <div className={`px-5 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} ${headerClassName}`}>
          {title && <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h3>}
          {subtitle && <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
        </div>
      )}
      <div className={`px-5 py-4 ${bodyClassName}`}>{children}</div>
      {footer && (
        <div className={`px-5 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border-t ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default Card;