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
import { ToastProvider } from "./context/ToastContext";
import ErrorBoundary from "./components/ErrorBoundary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Admin from "./components/Admin";
import SocialHub from "./components/SocialHub";
import PublicList from "./components/PublicList";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 5 * 60 * 1000, retry: 2, retryDelay: (attempt) => 500 * (attempt + 1) } } });

function App() {
  return (
    <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
    <ToastProvider>
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/lists/:token" element={<PublicList />} />

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
          <Route element={<AdminRoute />}><Route path="admin" element={<Admin />} /></Route>
          <Route path="social" element={<SocialHub />} />
            <Route
              path="best-games-of-all-time"
              element={<BestGamesOfAllTime />}
            />
            <Route path="best-sellers" element={<BestSellers />} />
          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
    </ToastProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
