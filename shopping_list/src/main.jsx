import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { useState } from "react";
import { useEffect } from "react";

import "./index.css";
import App from "./App.jsx";
import {
  BestGamesOfTheYear,
  BestGamesOfAllTime,
  BestSellers,
} from "./models/all_main_cards";
import Library from "./models/library";
import { CartContext } from "./models/cart.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is the global layout wrapper
    children: [
      {
        index: true, // This tells React Router: "Load this component by default when the user is at exactly '/'"
        element: <BestGamesOfTheYear />,
      },
      { path: "/best-games-of-all-time", element: <BestGamesOfAllTime /> },
      { path: "/best-sellers", element: <BestSellers /> },
      { path: "/library", element: <Library /> },
    ],
  },
]);

function Root() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      <RouterProvider router={router} />
    </CartContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
