import { useEffect, useState } from "react";
import Card from "../models/card";

const getRecentGames = () => {
  try { return JSON.parse(localStorage.getItem("recent-games")) || []; } catch { return []; }
};

const RecentlyViewed = () => {
  const [games, setGames] = useState(getRecentGames);
  useEffect(() => {
    const refresh = () => setGames(getRecentGames());
    window.addEventListener("recent-games-updated", refresh);
    return () => window.removeEventListener("recent-games-updated", refresh);
  }, []);
  if (!games.length) return null;
  return <section className="recently-viewed"><h2>Recently viewed</h2><div className="game-grid">{games.map((game) => <Card key={game.id} data={game} />)}</div></section>;
};

export default RecentlyViewed;
