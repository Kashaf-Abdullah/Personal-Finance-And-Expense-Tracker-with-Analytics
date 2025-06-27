import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getProfile, updateProfile } from '../api/profile';
import { useAuth } from '../utils/useAuth';

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


    const { token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ username: '', email: '' });
  
    useEffect(() => {
      getProfile(token).then(res => {
        setProfile(res);
        setForm({ username: res.username, email: res.email });
      });
    }, [token]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await updateProfile(token, form);
      alert('Profile updated!');
    };
  
    if (!profile) return <div className="alert alert-info">Loading...</div>;
  

  return (
    <nav className="navbar navbar-expand-lg navbar-dark  px-4 mb-3"
    style={{backgroundColor:'var(--color-primary)'}}>
      <a className="navbar-brand"
       style={{
    marginLeft: window.innerWidth < 768 ? '6%' : '0%',
    transition: 'margin 0.3s ease' // Smooth transition when resizing
  }}
      href="/">{t('welcome')} {form.username}</a>

      <div className="ms-auto d-flex align-items-center">
        {/* Language Switcher */}
        <select
  className="form-select form-select-sm"
  value={i18n.language}
  onChange={(e) => changeLanguage(e.target.value)}
  style={{
    width: '120px',
    backgroundColor: '#e7e9fb',
    border: '1px solid #5a5f7a',
    borderRadius: '4px',
    padding: '6px 12px',
    color: '#1d243c',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 2px rgba(29, 36, 60, 0.1)',
    ':hover': {
      borderColor: '#2a314e',
      boxShadow: '0 2px 4px rgba(29, 36, 60, 0.15)'
    },
    ':focus': {
      borderColor: '#1d243c',
      boxShadow: '0 0 0 2px rgba(29, 36, 60, 0.25)'
    }
  }}
  aria-label="Select Language"
>
  <option 
    value="en" 
    style={{
      backgroundColor: '#e7e9fb',
      color: '#1d243c'
    }}
  >
    Eng
  </option>
  <option 
    value="ur" 
    style={{
      backgroundColor: '#e7e9fb',
      color: '#1d243c'
    }}
  >
    اردو
  </option>
</select>
      </div>
    </nav>
  );
}