



import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaHome, FaExchangeAlt,FaBell, FaWallet, FaUser, FaRobot, FaCalculator, FaStickyNote, FaSignOutAlt, FaBars, FaTimes, FaFacebookMessenger } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo2.gif'
const navItems = [
  { to: "/dashboard", labelKey: "dashboard", icon: <FaHome /> },
  { to: "/transactions", labelKey: "transactions", icon: <FaExchangeAlt /> },
  { to: "/budgets", labelKey: "budgets", icon: <FaWallet /> },
  { to: "/profile", labelKey: "profile", icon: <FaUser /> },
  { to: "/ask-gemini", labelKey: "askGemini", icon: <FaRobot /> },
  { to: "/calculator", labelKey: "calculator", icon: <FaCalculator /> },
  { to: "/notepad", labelKey: "notepad", icon: <FaStickyNote /> },
{ to: "/bill-reminders", labelKey: "Reminders", icon: <FaBell /> },
  { to: "/send", labelKey: "send", icon: <FaFacebookMessenger /> },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [minimized, setMinimized] = useState(false); // desktop minimize
  const [mobileOpen, setMobileOpen] = useState(false); // mobile open
const { t } = useTranslation();

  const isActive = (path) => location.pathname.startsWith(path);

  // Sidebar width
  const sidebarWidth = minimized ? 60 : 220;

  // Sidebar classes
  const sidebarClass = `sidebar text-white p-3 ${mobileOpen ? 'open' : ''} ${minimized ? 'minimized' : ''}`;

  return (
    <>
      {/* Hamburger for mobile (always at top left) */}
      <button
        className="sidebar-toggle btn btn-dark d-md-none"
        onClick={() => setMobileOpen(true)}
        style={{ position: 'fixed', top: 10, left: 10, zIndex: 1051 }}
        aria-label="Open sidebar"
      >
        <FaBars />
      </button>

      {/* Sidebar */}
      <nav
        className={sidebarClass}
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          backgroundColor:'var(--color-primary)',
          transition: 'width 0.3s',
          position: 'fixed',
          height: '100vh',
          zIndex: 1052,
          left: mobileOpen ? 0 : undefined,
          top: 0,
        }}
      >
        {/* Mobile Close Button */}
        <div className="d-flex align-items-center justify-content-between " style={{ height: 50 ,marginBottom:'10px'}}>
          {/* Logo only if not minimized and not mobile */}
          {!minimized &&
        <img
  src={logo}
  alt="Logo"
  style={{
    width: 114,
    height: 98,
    borderRadius: 14,
    objectFit: 'contain',
    position:'relative',
    top:'7px',
    left:'7px',
    imageRendering: 'high-quality'  // Better rendering for animations
  }}
  loading="lazy"  // Optional: for performance
/>}
          {/* Desktop Minimize Button */}
          <button
            className="btn btn-sm btn-outline-light ms-auto d-none d-md-inline"
            onClick={() => setMinimized(!minimized)}
            style={{ marginLeft: minimized ? 0 : "auto" }}
            title={minimized ? "Expand" : "Minimize"}
            aria-label={minimized ? "Expand sidebar" : "Minimize sidebar"}
          >
            <FaBars />
          </button>
          {/* Mobile Close Button (X) */}
          {mobileOpen && (
            <button
              className="btn btn-sm btn-outline-light d-inline d-md-none"
              onClick={() => setMobileOpen(false)}
              style={{ marginLeft: 'auto' }}
              title="Close sidebar"
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
          )}
        </div>
        <ul className="nav flex-column">
          {navItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <Link
                className={`nav-link d-flex align-items-center ${isActive(item.to) ? 'active' : 'text-white'}`}
                to={item.to}
                style={{
                  gap: 12,
                  fontWeight: isActive(item.to) ? 'bold' : 'normal',
                  background: isActive(item.to) ? '#0d6efd' : 'transparent',
                  color: isActive(item.to) ? '#fff' : '',
                  borderRadius: 6,
                  marginBottom: 4,
                  padding: '8px 12px',
                  justifyContent: minimized ? 'center' : 'flex-start'
                }}
                title={item.label}
              >
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {/* {!minimized && <span>{item.label}</span>} */}
                {!minimized && <span>{t(item.labelKey)}</span>}

              </Link>
            </li>
          ))}
        </ul>
        {/* Logout at bottom */}
        <div className="sidebar-logout mt-auto text-center" style={{ position: 'absolute', bottom: 20, width: minimized ? 40 : '80%' }}>
          <button
          style={{backgroundColor:'var(--color-background)',color:'var(--color-primary)'}}
            className="btn  w-100 d-flex align-items-center justify-content-center"
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
            title="Logout"
          >
            <FaSignOutAlt className="me-2" />
            {/* {!minimized && "Logout"} */}
            {!minimized && t('logout')}
          </button>
        </div>
      </nav>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1050,
          }}
        />
      )}
      {/* Spacer div to push content right */}
      <div style={{ width: sidebarWidth, minWidth: '208px' }} className="d-none d-md-block" />
    </>
  );
}
