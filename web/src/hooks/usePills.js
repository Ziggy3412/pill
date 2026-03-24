import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';

// Keyed per user so re-login restores their specific pills instantly
const cacheKey = (userId) => `pillpal_pills_${userId}`;

export function usePills() {
    const { user, loading: authLoading } = useAuth();
    const [pills, setPills] = useState([]);

    const fetchPills = useCallback(async (userId) => {
        try {
            const data = await api.get('/api/pills');
            setPills(data);
            localStorage.setItem(cacheKey(userId), JSON.stringify(data));
        } catch (err) {
            console.error('[pills] fetch failed:', err);
        }
    }, []);

    useEffect(() => {
        if (authLoading) return;

        if (!user?.id) {
            setPills([]);
            return;
        }

        // 1. Show cached pills for this user immediately (no flicker)
        try {
            const cached = localStorage.getItem(cacheKey(user.id));
            if (cached) {
                setPills(JSON.parse(cached));
            }
        } catch {}

        // 2. Fetch fresh copy from backend
        fetchPills(user.id);
    }, [user?.id, authLoading]);

    function addPill(pill) {
        setPills(prev => {
            const next = [...prev, pill];
            if (user?.id) localStorage.setItem(cacheKey(user.id), JSON.stringify(next));
            return next;
        });
    }

    async function deletePill(id) {
        await api.delete(`/api/pills/${id}`);
        setPills(prev => {
            const next = prev.filter(p => p.id !== id);
            if (user?.id) localStorage.setItem(cacheKey(user.id), JSON.stringify(next));
            return next;
        });
    }

    const refresh = useCallback(() => {
        if (user?.id) fetchPills(user.id);
    }, [user?.id, fetchPills]);

    return { pills, addPill, deletePill, refresh };
}
