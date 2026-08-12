import { useState } from "react";
import { useContext } from "react";
import { CartContext } from "../models/cart";
import api from "../api";
import { useToast } from "../context/ToastContext";

const SocialHub = () => {
  const { cart } = useContext(CartContext); const { showToast } = useToast(); const [title, setTitle] = useState("My Game List"); const [description, setDescription] = useState(""); const [shareUrl, setShareUrl] = useState("");
  const createList = async (event) => { event.preventDefault(); try { const { data } = await api.post("/social/lists", { title, description, gameIds: cart.map((game) => game.id) }); const url = `${window.location.origin}/lists/${data.shareToken}`; setShareUrl(url); await navigator.clipboard?.writeText(url); showToast("Public list created and link copied."); } catch (error) { showToast(error.response?.data?.error || "Add games to your wishlist first.", "error"); } };
  return <main className="main-container social-page"><div className="section-heading"><p className="eyebrow">COMMUNITY</p><h1 className="section-title">Share your games</h1></div><p className="social-intro">Create a public list from your wishlist and share it with friends.</p><form className="review-form social-form" onSubmit={createList}><label>List title<input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength="120" /></label><label>Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} maxLength="500" /></label><button type="submit">Create public list ({cart.length} games)</button></form>{shareUrl && <p className="share-url">Share link: <a href={shareUrl}>{shareUrl}</a></p>}</main>;
};
export default SocialHub;
