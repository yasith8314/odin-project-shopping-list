import api from "./api";

export const trackEvent = (eventType, { gameId, metadata } = {}) =>
  api.post("/analytics/events", { eventType, ...(gameId ? { gameId } : {}), ...(metadata ? { metadata } : {}) }).catch(() => undefined);
