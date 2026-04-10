import "./styles.css"
import { useState } from "react";
import { PlatformIconGroup } from "./platforms"
import GameCard from "./game_card"
import { useContext } from "react";
import { CartContext } from "./cart.jsx";
import { useEffect } from "react";


const Card = ({ data }) => {
    const [isAdded, setAdded] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { cart, setCart } = useContext(CartContext);

    const handelClick = (e) => {
        e.stopPropagation();
        setAdded(!isAdded);
      
        if (!isAdded) {
            setCart([...cart, data]);
        } else {
            setCart(cart.filter((item) => item.id !== data.id));
        }   
    }
  
    useEffect(() => {
        for (let item of cart) {
            if (item.id === data.id) {
                setAdded(true);
                break;
            }
        }
    }, [cart]);

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
                <div className="modal-overlay" onClick={closeModal} >
                    <div className="modal-card" onClick={(e) => e.stopPropagation()} >
                        <button className="modal-close" onClick={closeModal}>✕</button>

                        <GameCard 
                            key = {`gameid-${data.id}`}
                            id={data.id} 
                            platforms={data.platforms}
                        />
                    </div>
                </div>
        }
        </>
    );
};

export default Card;