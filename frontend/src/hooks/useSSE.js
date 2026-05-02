import { useEffect, useRef, useState, useCallback } from "react";

const API = import.meta.env.VITE_API_URL;
const SSE_URL = `${API}/dashboard/stream`;

const MAX_ACTIVITY_ITEMS = 6;

const backoff = (attempt) => Math.min(1000 * 2 ** attempt, 30_000);

export function useSSE() {
    const [stats, setStats] = useState(null);
    const [activity, setActivity] = useState([]);
    const [score, setScore] = useState(undefined);
    const [aiTip, setAiTip] = useState(undefined);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);

    const esRef = useRef(null);
    const attemptRef = useRef(0);
    const unmounted = useRef(false);
    const timeoutRef = useRef(null);

    const connect = useCallback(() => {
        if (unmounted.current) return;

        if (esRef.current) {
            esRef.current.close();
        }

        const es = new EventSource(SSE_URL, { withCredentials: true });
        esRef.current = es;

        // ── Connection opened ──────────────────────────────────────────────────
        es.onopen = () => {
            setConnected(true);
            setError(null);
            attemptRef.current = 0;
        };

        // ── Full snapshot on connect ───────────────────────────────────────────
        es.addEventListener("init", (e) => {
            try {
                const d = JSON.parse(e.data);
                console.log("Data is:", d);
                if (d.stats)    setStats(d.stats);
                setActivity(Array.isArray(d.activity) ? d.activity : []);  // ← always set
                setScore(d.score   ?? null);
                setAiTip(d.ai_tip  ?? null);
            } catch (err) {
                console.error("[SSE] Failed to parse init event:", err);
            }
        });

        // ── Surgical stat card update ──────────────────────────────────────────
        es.addEventListener("stats_update", (e) => {
            try {
                setStats(JSON.parse(e.data));
            } catch (err) {
                console.error("[SSE] stats_update parse error:", err);
            }
        });

        // ── Prepend new activity item ──────────────────────────────────────────
        es.addEventListener("activity_update", (e) => {
            try {
                const item = JSON.parse(e.data);
                setActivity((prev) => {
                    const list = prev ?? [];
                    return [item, ...list].slice(0, MAX_ACTIVITY_ITEMS);
                });
            } catch (err) {
                console.error("[SSE] activity_update parse error:", err);
            }
        });

        // ── Score breakdown update ─────────────────────────────────────────────
        es.addEventListener("score_update", (e) => {
            try {
                setScore(JSON.parse(e.data));
            } catch (err) {
                console.error("[SSE] score_update parse error:", err);
            }
        });

        // ── AI tip update ──────────────────────────────────────────────────────
        es.addEventListener("tip_update", (e) => {
            try {
                const tip = JSON.parse(e.data);
                setAiTip(tip);   // null is valid (means: no tip)
            } catch (err) {
                console.error("[SSE] tip_update parse error:", err);
            }
        });

        // ── Heartbeat — just ignore ────────────────────────────────────────────
        es.addEventListener("ping", () => { });

        // ── Connection error → reconnect with backoff ──────────────────────────
        es.onerror = () => {
            setConnected(false);
            es.close();
        
            if (unmounted.current) return;
        
            const delay = backoff(attemptRef.current++);
            setError(`Connection lost. Reconnecting in ${Math.round(delay / 1000)}s…`);
        
            timeoutRef.current = setTimeout(connect, delay);
        };
    }, [SSE_URL]);


    useEffect(() => {
        unmounted.current = false;
        connect();

        return () => {
            unmounted.current = true;
            esRef.current?.close();
        };
    }, [connect]);

    return { stats, activity, score, aiTip, connected, error };
}