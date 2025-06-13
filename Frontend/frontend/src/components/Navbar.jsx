import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Optional: For Urdu, set RTL direction
    // if (lng === 'ur') {
    //   document.documentElement.dir = 'rtl';
    // } else {
    //   document.documentElement.dir = 'ltr';
    // }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <a className="navbar-brand" href="/">{t('welcome')}</a>

      <div className="ms-auto d-flex align-items-center">
        {/* Language Switcher */}
        <select
          className="form-select form-select-sm"
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value)}
          style={{ width: '100px' }}
          aria-label="Select Language"
        >
          <option value="en">English</option>
          <option value="ur">اردو</option>
        </select>
      </div>
    </nav>
  );
}
