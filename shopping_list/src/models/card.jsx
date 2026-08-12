// src/components/Card.jsx
import "./styles.css";
import { useState, useContext, useEffect, useRef } from "react";
import { PlatformIconGroup } from "./platforms";
import GameCard from "./game_card";
import { CartContext } from "./cart.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api";
import { useToast } from "../context/ToastContext";
import { useQuery } from "@tanstack/react-query";

const Card = ({ data }) => {
  // ---------- CART logic ----------
  const { cart, toggleCartItem } = useContext(CartContext);
  const { showToast } = useToast();
  const modalRef = useRef(null);
  const triggerRef = useRef(null);
  const isAdded = cart.some((item) => item.id === data.id);
  const { data: ratingData } = useQuery({ queryKey: ["review-summary", data.id], queryFn: async () => (await api.get(`/reviews/summaries?gameIds=${data.id}`)).data[data.id], staleTime: 5 * 60 * 1000 });

  const handleCartClick = (e) => {
    e.stopPropagation();
    toggleCartItem(data);
    showToast(isAdded ? "Removed from wishlist." : "Added to wishlist.");
  };

  // ---------- FAVORITE logic ----------
  const { user, refreshPreferences } = useAuth();

  const isFavorited = Array.isArray(user?.preferences?.favorites) && user.preferences.favorites.includes(data.id);
  const [favLoading, setFavLoading] = useState(false);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();
    if (!user) {
      showToast("Please log in to save favorites.", "error");
      return;
    }
    setFavLoading(true);
    try {
      await api.post("/preferences/favorites/toggle", { gameId: data.id });
      await refreshPreferences();
      showToast(isFavorited ? "Removed from favorites." : "Added to favorites.");
    } catch (err) {
      console.error("Error toggling favorite:", err);
      showToast("Couldn't update favorites. Please try again.", "error");
    } finally {
      setFavLoading(false);
    }
  };

  // ---------- Modal logic ----------
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    let current = [];
    try {
      const storedGames = JSON.parse(localStorage.getItem("recent-games") || "[]");
      current = Array.isArray(storedGames) ? storedGames : [];
    } catch {
      current = [];
    }
    localStorage.setItem("recent-games", JSON.stringify([data, ...current.filter((game) => game.id !== data.id)].slice(0, 5)));
    window.dispatchEvent(new Event("recent-games-updated"));
    setIsOpen(true);
  };
  const closeModal = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return undefined;
    modalRef.current?.focus();
    const closeOnEscape = (event) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <div className="card" style={{ display: "block" }} onClick={openModal} role="button" tabIndex="0" onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openModal(); } }} ref={triggerRef}>
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
          {ratingData?.reviewCount ? <p className="card-rating" aria-label={`${ratingData.averageRating} out of 5 stars`}>★ {ratingData.averageRating.toFixed(1)} ({ratingData.reviewCount})</p> : null}
          <p>{data.released}</p>
        </div>
      </div>

      {isOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`${data.name} details`} tabIndex="-1" ref={modalRef}>
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
