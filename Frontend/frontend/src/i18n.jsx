// npm install react-i18next i18next i18next-browser-languagedetector


import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'ur'],
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: {
          welcome: "Welcome",
          Income:'Income',
          dashboard: "Dashboard",
  transactions: "Transactions",
  budgets: "Budgets",
  profile: "Profile",
  askGemini: "Ask Gemini",
  calculator: "Calculator",
  notepad: "Notepad",
  send: "Send",
  logout: "Logout",
  expense:'Expense',
  balance:"Balance",
  TopExpenseCategories:'Top Expense Categories',
  IncomevsExpenseThisYear:'Income vs Expense (This Year)',
  IncomevsExpenseLast6Months:'Income vs Expense(Last 6 Months)'

          // Add other keys as needed
        },
      },
      ur: {
        translation: {
          welcome: "خوش آمدید",
        
           Income:'آمدنی',
          // Add other keys as needed
          dashboard: "ڈیش بورڈ",
  transactions: "ٹرانزیکشنز",
  budgets: "بجٹ",
  profile: "پروفائل",
  askGemini: "Ask Gemini",
  calculator: "کیلکولیٹر",
  notepad: "نوٹ پیڈ",
  send: "بھیجیں",
  logout: "لاگ آوٹ",
  expense:'خرچ',
  balance:'بیلنس',
  TopExpenseCategories:'اہم خرچ کی اقسام',
  IncomevsExpenseThisYear:'آمدنی بمقابلہ خرچ (اس سال)',
  IncomevsExpenseLast6Months:'آمدنی بمقابلہ خرچ (گزشتہ 6 ماہ)'
        },
      },
    },
  });

export default i18n;
