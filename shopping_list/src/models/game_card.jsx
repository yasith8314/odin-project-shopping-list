import "./styles.css"
import { useState, useEffect, useRef } from "react";
import { PlatformIconGroup } from "./platforms"
import { getGame } from "./fetch"
import Slideshow from "./slideshow"
import { useToast } from "../context/ToastContext";
import Reviews from "../components/Reviews";
import Comments from "../components/Comments";
import { trackEvent } from "../analytics";

const GameCard = ({ id, platforms }) => {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const hasTrackedView = useRef(false);

    const shareGame = async () => {
      const shareData = { title: gameData?.name || "GameScout", text: `Check out ${gameData?.name || "this game"} on GameScout.`, url: window.location.href };
      try {
        if (navigator.share) await navigator.share(shareData);
        else { await navigator.clipboard.writeText(window.location.href); showToast("Link copied to clipboard."); }
      } catch (error) { if (error.name !== "AbortError") showToast("Couldn't share this game.", "error"); }
    };

    useEffect(() => {
        const getData = async (id, platforms) => {
            const newData = await getGame(id, platforms);
            setGameData(newData);
            setLoading(false);
        } 
        getData(id, platforms);
    }, [id, platforms]);

    useEffect(() => {
      if (hasTrackedView.current) return;
      hasTrackedView.current = true;
      trackEvent("game_view", { gameId: id });
    }, [id]);


    if (loading || !gameData) {
        return (     
            <div className="modal-content">
                <div className="skeleton skeleton-image"></div>
                <div className="skeleton skeleton-text title"></div>
                <div className="skeleton skeleton-text subtitle"></div>
            </div>
        );
    }

    return (
      <>
        {gameData.screenshots?.length ==  0 && <img
          className="modal-image"
          src={gameData.images?.[0]}
          alt="game"
        />}

        {gameData.screenshots?.length > 0 && 
          <Slideshow screenshots={[gameData.images?.[0], ...gameData.screenshots]} />
        }
        
        <div className="modal-content">
          <PlatformIconGroup platforms={gameData['platforms']} />
          <h2>{gameData.name}</h2>
          <button className="share-button" onClick={shareGame}>Share</button>
          <p>{gameData.released}</p>
          <p>{gameData.developers}</p>
          <p>{gameData.description}</p>
          <ul>{gameData['genres']?.map(element => <li key={element}>{element}</li>)}</ul>
          <Reviews gameId={id} />
          <Comments gameId={id} />
        </div>
      </>
    );
};

export default GameCard;
