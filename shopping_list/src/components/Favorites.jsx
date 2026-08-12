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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (
        !user ||
        !user.preferences ||
        user.preferences.favorites.length === 0
      ) {
        setFavoriteGames([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const allGames = await getGames("games", 1);
        const filtered = allGames.filter((game) =>
          user.preferences.favorites.includes(game.id),
        );
        setFavoriteGames(filtered);
      } catch (err) {
        console.error(err);
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
        <p style={{ textAlign: "center", padding: "2rem" }}>
          You haven't added any favorites yet. ❤️
        </p>
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
