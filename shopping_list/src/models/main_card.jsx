import Card from "./card";
import { getGames } from "./fetch";
import { useState, useEffect, useRef, useCallback } from "react";
import "./styles.css";
import { SkeletonCard } from "./skeletonCard";

const INITIAL_LOAD = 20; // Number of games to show initially
const LOAD_INCREMENT = 20; // Number of games to add each time user scrolls to bottom

const MainCard = ({ query, title }) => {
  const [fullData, setFullData] = useState([]); // All games from API
  const [displayCount, setDisplayCount] = useState(INITIAL_LOAD);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // Ref for the sentinel element (the "trigger" at the bottom)
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  // Fetch all data once when query changes
  useEffect(() => {
    const fetchAllGames = async () => {
      setLoading(true);
      setDisplayCount(INITIAL_LOAD); // Reset display count on new query
      const data = await getGames(query, 1); // page param ignored by FreeToGame
      setFullData(data);
      setHasMore(data.length > INITIAL_LOAD);
      setLoading(false);
    };

    fetchAllGames();
  }, [query]);

  // Intersection Observer callback – loads more when sentinel is visible
  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !loading) {
        setDisplayCount((prev) => {
          const newCount = prev + LOAD_INCREMENT;
          if (newCount >= fullData.length) {
            setHasMore(false);
            return fullData.length;
          }
          return newCount;
        });
      }
    },
    [hasMore, loading, fullData.length],
  );

  // Set up / clean up the observer
  useEffect(() => {
    if (loading) return;

    // Disconnect old observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px 0px 100px 0px", // Trigger 100px before the bottom
      threshold: 0.1,
    });

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, handleObserver]);

  // Visible slice of data
  const visibleData = fullData.slice(0, displayCount);

  // Initial loading skeleton
  if (loading && fullData.length === 0) {
    return (
      <div className="main-container">
        <h1 className="section-title">{title}</h1>
        <div className="game-grid">
          {[...Array(20)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <h1 className="section-title">{title}</h1>

      <div className="game-grid">
        {visibleData.map((element) => (
          <Card key={element.id} data={element} />
        ))}
      </div>

      {/* Sentinel element – invisible trigger for infinite scroll */}
      {!loading && (
        <div ref={sentinelRef} style={{ height: "10px", margin: "10px 0" }} />
      )}

      {/* Optional loading indicator while initial fetch is in progress */}
      {loading && fullData.length > 0 && (
        <div className="game-grid">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Show "no more" message if all games are displayed */}
      {!hasMore && fullData.length > 0 && (
        <p style={{ textAlign: "center", padding: "20px", color: "#888" }}>
          🎮 You've seen all {fullData.length} games!
        </p>
      )}
    </div>
  );
};

export default MainCard;
