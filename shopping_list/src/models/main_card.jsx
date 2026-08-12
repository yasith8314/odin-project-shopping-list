import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Card from "./card";
import { getGames } from "./fetch";
import { SkeletonCard } from "./skeletonCard";
import "./styles.css";

const INITIAL_LOAD = 20;
const LOAD_INCREMENT = 20;

const MainCard = ({ query, title }) => {
  const [fullData, setFullData] = useState([]);
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("all");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("name");
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function loadGames() {
      setLoading(true);
      setError("");
      setDisplayCount(INITIAL_LOAD);
      try {
        const games = await getGames(query);
        if (active) setFullData(games);
      } catch (loadError) {
        if (active) {
          setFullData([]);
          setError(loadError.message);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadGames();
    return () => { active = false; };
  }, [query]);

  const genres = useMemo(
    () => [...new Set(fullData.map((game) => game.genre).filter(Boolean))].sort(),
    [fullData],
  );

  const filteredData = useMemo(() => {
    const term = search.trim().toLowerCase();
    return fullData
      .filter((game) => !term || game.name.toLowerCase().includes(term))
      .filter((game) => platform === "all" || game.platforms.includes(platform))
      .filter((game) => genre === "all" || game.genre === genre)
      .sort((a, b) => {
        if (sort === "newest") return new Date(b.released) - new Date(a.released);
        if (sort === "oldest") return new Date(a.released) - new Date(b.released);
        return a.name.localeCompare(b.name);
      });
  }, [fullData, genre, platform, search, sort]);

  useEffect(() => setDisplayCount(INITIAL_LOAD), [search, platform, genre, sort]);

  const hasMore = displayCount < filteredData.length;
  const handleObserver = useCallback((entries) => {
    if (entries[0].isIntersecting) {
      setDisplayCount((count) => Math.min(count + LOAD_INCREMENT, filteredData.length));
    }
  }, [filteredData.length]);

  useEffect(() => {
    if (loading || !hasMore || !sentinelRef.current) return undefined;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(handleObserver, { rootMargin: "200px" });
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current?.disconnect();
  }, [handleObserver, hasMore, loading]);

  const visibleData = filteredData.slice(0, displayCount);

  return (
    <section className="main-container">
      <div className="section-heading">
        <p className="eyebrow">DISCOVER YOUR NEXT FAVORITE</p>
        <h1 className="section-title">{title}</h1>
      </div>
      <div className="discovery-controls" aria-label="Game filters">
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search games…" aria-label="Search games" />
        <select value={platform} onChange={(event) => setPlatform(event.target.value)} aria-label="Platform"><option value="all">All platforms</option><option value="pc">PC</option><option value="web">Browser</option></select>
        <select value={genre} onChange={(event) => setGenre(event.target.value)} aria-label="Genre"><option value="all">All genres</option>{genres.map((item) => <option key={item} value={item}>{item}</option>)}</select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort games"><option value="name">Name: A–Z</option><option value="newest">Newest releases</option><option value="oldest">Oldest releases</option></select>
      </div>
      {loading && !fullData.length ? <div className="game-grid">{Array.from({ length: 12 }, (_, index) => <SkeletonCard key={index} />)}</div> : null}
      {error ? <p className="state-message error-message">{error}</p> : null}
      {!loading && !error && !visibleData.length ? <p className="state-message">No games match these filters.</p> : null}
      <div className="game-grid">{visibleData.map((game) => <Card key={game.id} data={game} />)}</div>
      {hasMore ? <div ref={sentinelRef} className="scroll-sentinel" /> : null}
      {!loading && !error && filteredData.length > 0 && !hasMore ? <p className="end-message">You've seen all {filteredData.length} games.</p> : null}
    </section>
  );
};

export default MainCard;
