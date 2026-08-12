// import { useQuery } from '@tanstack/react-query';

// No API key required for FreeToGame
const base_url = "https://www.freetogame.com/api";

/**
 * Generic fetch function.
 * Removes API key and page parameter (FreeToGame doesn't support pagination).
 */
const fetchData = async (query, page = 1) => {
  // query is like "games" or "games?category=shooter"
  const response = await fetch(`${base_url}/${query}`);
  const data = await response.json();
  return data;
};

/**
 * Returns a list of games with mapped fields.
 * FreeToGame returns an array directly (not inside "results").
 */
const getGames = async (query, page = 1) => {
  const data = await fetchData(query, page);

  // FreeToGame API returns an array of games
  const gameData = Array.isArray(data) ? data : [];

  const games = [];
  for (let i = 0; i < gameData.length; i++) {
    const game = gameData[i];
    // Skip if no thumbnail (similar to background_image check)
    if (!game.thumbnail) continue;

    // Map fields to match the old structure
    const item = {
      id: game.id,
      name: game.title,
      image_url: game.thumbnail,
      released: game.release_date,
      // FreeToGame 'platform' is a string like "PC (Windows)"
      // Convert to array for consistency (could split if comma-separated)
      platforms: game.platform ? [game.platform] : [],
    };

    if (item.platforms[0] === "Web Browser") {
      item.platforms[0] = "web";
    } else if (item.platforms[0] === "PC (Windows)") {
      item.platforms[0] = "pc";
    } else if (item.platforms[0] === "Xbox") {
      item.platforms[0] = "xbox";
    }

    games.push(item);
  }

  return games;
};

/**
 * No longer uses a separate screenshots endpoint;
 * screenshots are taken from the game details response.
 */
const getGame = async (id, platforms) => {
  // Fetch game details from /game?id=...
  const response = await fetch(`${base_url}/game?id=${id}`);
  const data = await response.json();

  if (!data || Object.keys(data).length === 0) {
    return {};
  }

  // Build the game object with the same property names as before
  const gameData = {
    name: data.title || "",
    description: data.description || data.short_description || "",
    released: data.release_date || "",
    // Use the platforms passed from getGames (which we already mapped)
    platforms: platforms || [],
    // Images: use thumbnail as first, and maybe the first screenshot as second
    images: [
      data.thumbnail || "",
      data.screenshots && data.screenshots.length > 0
        ? data.screenshots[0].image
        : "",
    ],
    developers: data.developer || "",
    // Genres: convert single string to array
    genres: data.genre ? [data.genre] : [],
    // Screenshots: extract from the game details
    screenshots: data.screenshots
      ? data.screenshots.map((s) => s.image).filter(Boolean)
      : [],
  };

  for (const key in gameData["platforms"]) {
    if (gameData["platforms"][key].includes("Web Browser")) {
      gameData["platforms"][key] = "web";
    } else if (gameData["platforms"][key].includes("PC")) {
      gameData["platforms"][key] = "pc";
    } else if (gameData["platforms"][key].includes("Xbox")) {
      gameData["platforms"][key] = "xbox";
    }
  }

  return gameData;
};

export { fetchData, getGames, getGame };
