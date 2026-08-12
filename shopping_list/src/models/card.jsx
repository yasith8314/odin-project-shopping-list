// src/components/Card.jsx
import "./styles.css";
import { useState, useContext, useEffect } from "react";
import { PlatformIconGroup } from "./platforms";
import GameCard from "./game_card";
import { CartContext } from "./cart.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api";

const Card = ({ data }) => {
  // ---------- CART logic ----------
  const [isAdded, setAdded] = useState(false);
  const { cart, setCart } = useContext(CartContext);

  const handleCartClick = (e) => {
    e.stopPropagation();
    setAdded(!isAdded);
    if (!isAdded) {
      setCart([...cart, data]);
    } else {
      setCart(cart.filter((item) => item.id !== data.id));
    }
  };

  useEffect(() => {
    for (let item of cart) {
      if (item.id === data.id) {
        setAdded(true);
        break;
      }
    }
  }, [cart]);

  // ---------- FAVORITE logic ----------
  const { user, refreshPreferences } = useAuth();

  // Helper: safely check if game is favorited
  const isGameFavorited = () => {
    const favs = user?.preferences?.favorites;
    return Array.isArray(favs) && favs.includes(data.id);
  };

  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Keep isFavorited in sync when user or data changes
  useEffect(() => {
    setIsFavorited(isGameFavorited());
  }, [user, data.id]);

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
      // Toggle optimistically, but we also rely on refresh to update the state
      setIsFavorited((prev) => !prev);
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
        <button className={isAdded ? "added" : ""} onClick={handleCartClick}>
          {isAdded ? "✓" : "+"}
        </button>

        {/* Favorite star */}
        <button
          className="favorite-btn"
          onClick={handleFavoriteToggle}
          disabled={favLoading}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: isFavorited ? "gold" : "gray",
          }}
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
