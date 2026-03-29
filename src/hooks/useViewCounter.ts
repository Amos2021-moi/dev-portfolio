import { useEffect } from "react";

export function useViewCounter(type: "project" | "blog", id: string | undefined) {
  useEffect(() => {
    if (!id) return;

    const key = "viewed_" + type + "_" + id;
    const alreadyViewed = sessionStorage.getItem(key);
    if (alreadyViewed) return;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    }).then(() => {
      sessionStorage.setItem(key, "1");
    }).catch(() => {});
  }, [type, id]);
}