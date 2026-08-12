const apiBase = import.meta.env.VITE_API_URL || "/api";

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

const fetchData = async (query, attempts = 3) => {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(`${apiBase}/games?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Game data is unavailable right now.");
      return await response.json();
    } catch (error) {
      lastError = error;
      if (attempt < attempts - 1) await wait(400 * (attempt + 1));
    }
  }
  throw lastError || new Error("We couldn't load games right now. Please try again.");
};

const normalizePlatform = (platform) => {
  if (platform === "Web Browser") return "web";
  if (platform?.includes("PC")) return "pc";
  if (platform === "Xbox") return "xbox";
  return platform?.toLowerCase() || "";
};

const getGames = async (query) => {
  const data = await fetchData(query);
  return (Array.isArray(data) ? data : []).filter((game) => game.thumbnail).map((game) => ({
    id: game.id, name: game.title, image_url: game.thumbnail, released: game.release_date,
    platforms: game.platform ? [normalizePlatform(game.platform)] : [], genre: game.genre || "Other",
    publisher: game.publisher || "", description: game.short_description || "",
  }));
};

const getGame = async (id, platforms) => {
  const data = await fetchData(`game?id=${id}`);
  if (!data || Object.keys(data).length === 0) return {};
  return {
    name: data.title || "", description: data.description || data.short_description || "", released: data.release_date || "",
    platforms: platforms || [], images: [data.thumbnail || "", data.screenshots?.[0]?.image || ""],
    developers: data.developer || "", genres: data.genre ? [data.genre] : [],
    screenshots: data.screenshots?.map((screenshot) => screenshot.image).filter(Boolean) || [],
  };
};

export { fetchData, getGames, getGame };
