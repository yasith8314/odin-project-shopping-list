import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Comments = ({ gameId }) => {
  const { user } = useAuth(); const { showToast } = useToast(); const client = useQueryClient(); const [body, setBody] = useState("");
  const { data = [], isLoading } = useQuery({ queryKey: ["comments", gameId], queryFn: async () => (await api.get(`/social/comments?gameId=${gameId}`)).data });
  const submit = async (event) => { event.preventDefault(); try { await api.post("/social/comments", { gameId, body }); setBody(""); client.invalidateQueries({ queryKey: ["comments", gameId] }); } catch (error) { showToast(error.response?.data?.error || "Sign in to comment.", "error"); } };
  return <section className="comments"><h3>Discussion</h3>{isLoading ? <p>Loading comments…</p> : data.map((comment) => <article className="comment" key={comment.id}><strong>{comment.author}</strong><p>{comment.body}</p></article>)}{user ? <form onSubmit={submit}><textarea value={body} maxLength="2000" required onChange={(event) => setBody(event.target.value)} placeholder="Join the discussion…" /><button type="submit">Comment</button></form> : <p>Sign in to join the discussion.</p>}</section>;
};
export default Comments;
