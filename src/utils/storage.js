const NS = "Tandem";

function k(key) { return `${NS}:${key}`; }

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(k(key));
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    localStorage.setItem(k(key), JSON.stringify(value));
  },
  remove(key) { localStorage.removeItem(k(key)); }
};
