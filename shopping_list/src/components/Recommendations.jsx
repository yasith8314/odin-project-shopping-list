import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGames } from "../models/fetch";
import Card from "../models/card";

const Recommendations = () => {
  const { data: games = [] } = useQuery({ queryKey: ["recommendation-games"], queryFn: () => getGames("games?sort-by=popularity") });
  const sourceGame = useMemo(() => { try { return JSON.parse(localStorage.getItem("recent-games") || "[]")[0]; } catch { return null; } }, []);
  const recommendations = useMemo(() => { if (!sourceGame?.genre) return games.slice(0, 4); return games.filter((game) => game.id !== sourceGame.id && game.genre === sourceGame.genre).slice(0, 4); }, [games, sourceGame]);
  if (!recommendations.length) return null;
  return <section className="recommendations"><h2>Recommended for you</h2><div className="game-grid">{recommendations.map((game) => <Card key={game.id} data={game} />)}</div></section>;
};
export default Recommendations;
