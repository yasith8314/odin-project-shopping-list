import { useContext, useState } from "react";
import { CartContext } from "../models/cart";

const CartPanel = () => {
  const { cart, toggleCartItem } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  return <div className="cart-menu">
    <button className="cart-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open}>Wishlist <span>{cart.length}</span></button>
    {open && <div className="cart-panel"><div className="cart-panel-header"><strong>Your wishlist</strong><button onClick={() => setOpen(false)} aria-label="Close wishlist">×</button></div>{!cart.length ? <p>Your wishlist is empty.</p> : <ul>{cart.map((game) => <li key={game.id}><img src={game.image_url} alt="" /><span>{game.name}</span><button onClick={() => toggleCartItem(game)} aria-label={`Remove ${game.name}`}>×</button></li>)}</ul>}</div>}
  </div>;
};
export default CartPanel;
