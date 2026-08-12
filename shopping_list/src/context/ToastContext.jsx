import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const showToast = (message, type = "success") => {
    const id = crypto.randomUUID();
    setToasts((items) => [...items, { id, message, type }]);
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3500);
  };
  const value = useMemo(() => ({ showToast }), []);
  return <ToastContext.Provider value={value}>{children}<div className="toast-region" aria-live="polite">{toasts.map((toast) => <div className={`toast toast-${toast.type}`} key={toast.id}>{toast.message}</div>)}</div></ToastContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
