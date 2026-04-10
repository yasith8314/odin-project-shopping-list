import "./styles.css"
import { useState, useEffect } from "react";
import { PlatformIconGroup } from "./platforms"
import { getGame } from "./fetch"
import Slideshow from "./slideshow"

const GameCard = ({ id, platforms }) => {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async (id, platforms) => {
            const newData = await getGame(id, platforms);
            setGameData(newData);
            setLoading(false);
        } 
        getData(id, platforms);
    }, [id, platforms]);


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
          <p>{gameData.released}</p>
          <p>{gameData.developers}</p>
          <p>{gameData.description}</p>
          <ul>{gameData['genres']?.map(element => <li key={element}>{element}</li>)}</ul>
        </div>
      </>
    );
};

export default GameCard;