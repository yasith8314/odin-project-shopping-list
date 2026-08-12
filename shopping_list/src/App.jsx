import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedLayout from "./components/ProtectedLayout";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Favorites from "./components/Favorites";
import {
  BestSellers,
  BestGamesOfAllTime,
  BestGamesOfTheYear,
} from "./models/all_main_cards";
import { CartProvider } from "./models/cart";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes with layout */}
          <Route path="/" element={<ProtectedLayout />}>
            <Route index element={<BestSellers />} />
            <Route
              path="library"
              element={
                <>
                  <BestGamesOfAllTime />
                  <BestGamesOfTheYear />
                </>
              }
            />
            <Route path="favorites" element={<Favorites />} />
            <Route
              path="best-games-of-all-time"
              element={<BestGamesOfAllTime />}
            />
            <Route path="best-sellers" element={<BestSellers />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
