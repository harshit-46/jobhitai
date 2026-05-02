import { useEffect, useRef, useState, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;
const SSE_URL = `${API}/dashboard/stream`;

const MAX_ACTIVITY_ITEMS = 6;
const backoff = (attempt) => Math.min(1000 * 2 ** attempt, 30_000);

export function useSSE() {
    const [stats,     setStats]     = useState(null);
    const [activity,  setActivity]  = useState(null);   // null = loading
    const [score,     setScore]     = useState(undefined);
    const [aiTip,     setAiTip]     = useState(undefined);
    const [connected, setConnected] = useState(false);
    const [error,     setError]     = useState(null);

    const esRef      = useRef(null);
    const attemptRef = useRef(0);
    const unmounted  = useRef(false);
    const timeoutRef = useRef(null);

    const connect = useCallback(() => {
        if (unmounted.current) return;

        if (esRef.current) {
            esRef.current.close();
        }

        const es = new EventSource(SSE_URL, { withCredentials: true });
        esRef.current = es;

        es.onopen = () => {
            setConnected(true);
            setError(null);
            attemptRef.current = 0;
        };

        // ── Full snapshot on connect ───────────────────────────────────────
        es.addEventListener("init", (e) => {
            try {
                const d = JSON.parse(e.data);
                console.log("[SSE] init received:", d);

                if (d.stats) setStats(d.stats);

                // Always set activity — Array.isArray check handles empty []
                // DO NOT use `if (d.activity)` — [] is falsy and would skip setting
                setActivity(Array.isArray(d.activity) ? d.activity : []);

                setScore(d.score   ?? null);
                setAiTip(d.ai_tip  ?? null);
            } catch (err) {
                console.error("[SSE] Failed to parse init event:", err);
            }
        });

        // ── Stats update ───────────────────────────────────────────────────
        es.addEventListener("stats_update", (e) => {
            try {
                setStats(JSON.parse(e.data));
            } catch (err) {
                console.error("[SSE] stats_update parse error:", err);
            }
        });

        // ── Activity update — prepend to list ──────────────────────────────
        es.addEventListener("activity_update", (e) => {
            try {
                const item = JSON.parse(e.data);
                setActivity((prev) => {
                    const list = Array.isArray(prev) ? prev : [];
                    return [item, ...list].slice(0, MAX_ACTIVITY_ITEMS);
                });
            } catch (err) {
                console.error("[SSE] activity_update parse error:", err);
            }
        });

        // ── Score update ───────────────────────────────────────────────────
        es.addEventListener("score_update", (e) => {
            try {
                setScore(JSON.parse(e.data));
            } catch (err) {
                console.error("[SSE] score_update parse error:", err);
            }
        });

        // ── AI tip update ──────────────────────────────────────────────────
        es.addEventListener("tip_update", (e) => {
            try {
                setAiTip(JSON.parse(e.data));
            } catch (err) {
                console.error("[SSE] tip_update parse error:", err);
            }
        });

        // ── Heartbeat ──────────────────────────────────────────────────────
        es.addEventListener("ping", () => {});

        // ── Error → reconnect with backoff ─────────────────────────────────
        es.onerror = () => {
            setConnected(false);
            es.close();

            if (unmounted.current) return;

            const delay = backoff(attemptRef.current++);
            setError(`Connection lost. Reconnecting in ${Math.round(delay / 1000)}s…`);
            timeoutRef.current = setTimeout(connect, delay);
        };
    }, []);

    useEffect(() => {
        unmounted.current = false;
        connect();

        return () => {
            unmounted.current = true;
            clearTimeout(timeoutRef.current);
            esRef.current?.close();
        };
    }, [connect]);

    return { stats, activity, score, aiTip, connected, error };
}