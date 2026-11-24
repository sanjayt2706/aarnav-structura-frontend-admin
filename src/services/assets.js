import { API_BASE } from "./api";

/** Public website address, used for previews and for images that ship with the site (/images/..., /brand/...). */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname)
    ? "http://localhost:5173"
    : "https://aarnavstructura.in")
).replace(/\/$/, "");

/** Turns a stored value (upload id, URL or site path) into something an <img> can show. */
export function previewUrl(v) {
  if (!v || typeof v !== "string") return "";
  if (/^(https?:|data:|blob:)/.test(v)) return v;
  if (/^[0-9a-fA-F]{24}$/.test(v)) return `${API_BASE}/api/files/${v}`;
  if (v.startsWith("/api/") || v.startsWith("/uploads/")) return `${API_BASE}${v}`;
  if (v.startsWith("/")) return `${SITE_URL}${v}`;
  return `${API_BASE}/api/files/${v}`;
}

export const formatBytes = (n = 0) =>
  n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
