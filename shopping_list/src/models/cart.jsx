// src/models/cart.jsx
import { createContext, useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("game-cart")) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem("game-cart", JSON.stringify(cart)); }, [cart]);

  const toggleCartItem = (game) => {
    setCart((items) => items.some((item) => item.id === game.id)
      ? items.filter((item) => item.id !== game.id)
      : [...items, game]);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, toggleCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
