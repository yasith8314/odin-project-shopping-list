import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { useToast } from "../context/ToastContext";

const Admin = () => {
  const { showToast } = useToast();
  const statsQuery = useQuery({ queryKey: ["admin-stats"], queryFn: async () => (await api.get("/admin/stats")).data });
  const reviewsQuery = useQuery({ queryKey: ["admin-reviews"], queryFn: async () => (await api.get("/admin/reviews")).data });
  const commentsQuery = useQuery({ queryKey: ["admin-comments"], queryFn: async () => (await api.get("/admin/comments")).data });
  const reload = () => { statsQuery.refetch(); reviewsQuery.refetch(); commentsQuery.refetch(); };
  const refreshCache = async () => { try { await api.post("/admin/cache/refresh"); showToast("Game cache refreshed."); } catch (error) { showToast(error.response?.data?.error || "Cache refresh failed.", "error"); } };
  const remove = async (kind, itemId) => { try { await api.delete(`/admin/${kind}/${itemId}`); showToast(`${kind === "reviews" ? "Review" : "Comment"} removed.`); reload(); } catch (error) { showToast(error.response?.data?.error || "Moderation action failed.", "error"); } };
  if (statsQuery.isError || reviewsQuery.isError || commentsQuery.isError) return <main className="main-container"><div className="state-message error-message"><p>Administrator data could not be loaded.</p><button className="retry-button" onClick={reload}>Try again</button></div></main>;
  const stats = statsQuery.data || {};
  const statLabels = { users: "Users", reviews: "Reviews", comments: "Comments", events: "Analytics events", dailyActiveUsers: "Active today" };
  return <main className="main-container admin-page"><div className="section-heading"><p className="eyebrow">CONTROL CENTER</p><h1 className="section-title">Admin dashboard</h1></div><div className="admin-stats">{Object.entries(statLabels).map(([key, label]) => <div className="admin-stat" key={key}><strong>{stats[key] ?? "—"}</strong><span>{label}</span></div>)}</div><div className="admin-actions"><button onClick={refreshCache}>Refresh game cache</button><button onClick={reload}>Reload dashboard</button></div><section className="admin-reviews"><h2>Review moderation</h2>{reviewsQuery.isLoading ? <p>Loading reviews…</p> : reviewsQuery.data?.length ? reviewsQuery.data.map((review) => <article key={review.id}><div><strong>{review.email}</strong> · Game {review.gameId} · {review.rating}/5</div><p>{review.comment}</p><button onClick={() => remove("reviews", review.id)}>Remove</button></article>) : <p>No reviews to moderate.</p>}</section><section className="admin-reviews"><h2>Comment moderation</h2>{commentsQuery.isLoading ? <p>Loading comments…</p> : commentsQuery.data?.length ? commentsQuery.data.map((comment) => <article key={comment.id}><div><strong>{comment.email}</strong> · Game {comment.gameId}</div><p>{comment.body}</p><button onClick={() => remove("comments", comment.id)}>Remove</button></article>) : <p>No comments to moderate.</p>}</section></main>;
};
export default Admin;
