import "./styles.css"
import { useState } from "react";
import { PlatformIconGroup } from "./platforms"
import GameCard from "./game_card"

const Card = ({ data }) => {
    const [isAdded, setAdded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    //const [mounted, setMounted] = useState(false);

    const handelClick = (e) => {
        e.stopPropagation();
        setAdded(!isAdded);
    }

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = (e) => {
        e.stopPropagation();
        setIsOpen(false);
    };


    return (
        <>
        <div className="card" style={{ display: 'block' }} onClick={openModal}>
            <button 
                className={isAdded ? 'added' : ''} 
                onClick={handelClick}
            >
                {isAdded ? '✓' : '+'}
            </button>

            <img 
                src={data['image_url']} 
                alt={data['image_url']} 
            />

            <div className="details">
                <PlatformIconGroup platforms={data['platforms']} />
                <h2>{data['name']}</h2>
                <p>{data['released']}</p>
            </div>
        </div> 

        {isOpen &&
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} >
                        <button className="modal-close" onClick={closeModal}>✕</button>

                        <GameCard 
                            id={data.id} 
                            platforms={data.platforms} 
                            key = {"game-card-" + data.id}
                        />
                    </div>
                </div>
        }
        </>
    );
};

export default Card;