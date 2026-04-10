import Card from './card'
import { useState, useEffect } from 'react';
import './styles.css'
import { useContext } from "react";
import { CartContext } from "./cart.jsx" 


const Library = () => {
  const { cart } = useContext(CartContext);

    return (
        <div className="main-container">
            <h1 className="section-title">My Library</h1>
            <div className="game-grid">
                {cart?.map((element) => (
                    <Card key={element.id} data={element} />
                ))}
            </div>     
        </div>
    );
}

export default Library;