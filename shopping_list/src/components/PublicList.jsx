import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { useParams, Link } from "react-router-dom";

const PublicList = () => { const { token } = useParams(); const { data, isLoading, isError } = useQuery({ queryKey: ["public-list", token], queryFn: async () => (await api.get(`/social/lists/${token}`)).data }); if (isLoading) return <main className="main-container"><p>Loading list…</p></main>; if (isError) return <main className="main-container"><p>List not found.</p></main>; return <main className="main-container"><div className="section-heading"><p className="eyebrow">PUBLIC LIST</p><h1 className="section-title">{data.title}</h1></div><p className="social-intro">By {data.owner} {data.description && `· ${data.description}`}</p><div className="public-game-list">{data.gameIds.map((gameId, index) => <div key={gameId}><span>{index + 1}</span> Game #{gameId}</div>)}</div><Link className="nav-link" to="/">Discover more games</Link></main>; };
export default PublicList;
