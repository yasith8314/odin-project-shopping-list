// src/components/Card.jsx
import "./styles.css";
import { useState, useContext } from "react";
import { PlatformIconGroup } from "./platforms";
import GameCard from "./game_card";
import { CartContext } from "./cart.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api";

const Card = ({ data }) => {
  // ---------- CART logic ----------
  const { cart, toggleCartItem } = useContext(CartContext);
  const isAdded = cart.some((item) => item.id === data.id);

  const handleCartClick = (e) => {
    e.stopPropagation();
    toggleCartItem(data);
  };

  // ---------- FAVORITE logic ----------
  const { user, refreshPreferences } = useAuth();

  const isFavorited = Array.isArray(user?.preferences?.favorites) && user.preferences.favorites.includes(data.id);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please log in to save favorites!");
      return;
    }
    setFavLoading(true);
    try {
      await api.post("/preferences/favorites/toggle", { gameId: data.id });
      await refreshPreferences();
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setFavLoading(false);
    }
  };

  // ---------- Modal logic ----------
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <>
      <div className="card" style={{ display: "block" }} onClick={openModal}>
        {/* Cart button */}
        <button className={`cart-card-button ${isAdded ? "added" : ""}`} onClick={handleCartClick} aria-label={isAdded ? "Remove from wishlist" : "Add to wishlist"}>
          {isAdded ? "✓" : "+"}
        </button>

        {/* Favorite star */}
        <button
          className="favorite-btn"
          onClick={handleFavoriteToggle}
          disabled={favLoading}
          aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorited ? "⭐" : "☆"}
        </button>

        <img src={data.image_url} alt={data.name} />

        <div className="details">
          <PlatformIconGroup platforms={data.platforms} />
          <h2>{data.name}</h2>
          <p>{data.released}</p>
        </div>
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>
            <GameCard
              key={`gameid-${data.id}`}
              id={data.id}
              platforms={data.platforms}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
