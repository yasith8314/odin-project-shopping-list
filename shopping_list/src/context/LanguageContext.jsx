import { createContext, useContext, useMemo, useState } from "react";

const translations = { en: { home: "Home", library: "Library", favorites: "Favorites", admin: "Admin", share: "Share list", language: "Español" }, es: { home: "Inicio", library: "Biblioteca", favorites: "Favoritos", admin: "Admin", share: "Compartir lista", language: "English" } };
const LanguageContext = createContext(null);
export const LanguageProvider = ({ children }) => { const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en"); const toggleLanguage = () => setLanguage((current) => { const next = current === "en" ? "es" : "en"; localStorage.setItem("language", next); return next; }); const value = useMemo(() => ({ language, toggleLanguage, t: (key) => translations[language][key] || key }), [language]); return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>; };
// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
