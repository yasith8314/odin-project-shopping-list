// src/components/Favorites.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { getGames } from "../models/fetch.js"; // your existing fetch
import Card from "../models/card";
import { SkeletonCard } from "../models/skeletonCard";

const Favorites = () => {
  const { user } = useAuth();
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      const favorites = Array.isArray(user?.preferences?.favorites) ? user.preferences.favorites : [];
      if (!user || favorites.length === 0) {
        setFavoriteGames([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      try {
        const allGames = await getGames("games");
        const filtered = allGames.filter((game) =>
          favorites.includes(game.id),
        );
        setFavoriteGames(filtered);
      } catch (err) {
        console.error(err);
        setError("We couldn't load your favorites right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  if (loading) {
    return (
      <div className="main-container">
        <h1>⭐ Your Favorites</h1>
        <div className="game-grid">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (favoriteGames.length === 0) {
    return (
      <div className="main-container">
        <h1>⭐ Your Favorites</h1>
        {error ? <div className="state-message error-message"><p>{error}</p></div> : <p className="empty-state">You haven't added any favorites yet. ❤️</p>}
      </div>
    );
  }

  return (
    <div className="main-container">
      <h1>⭐ Your Favorites</h1>
      <div className="game-grid">
        {favoriteGames.map((game) => (
          <Card key={game.id} data={game} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
