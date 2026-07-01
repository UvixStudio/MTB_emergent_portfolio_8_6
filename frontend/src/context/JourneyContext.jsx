import { createContext, useContext, useState, useCallback } from "react";

/* Shared journey state — which power-ups the rider has collected so far.
   StationClip reports collection; the persistent HUD reads it. */

const JourneyContext = createContext(null);

export function JourneyProvider({ children }) {
    const [collected, setCollected] = useState({});

    const collect = useCallback((id) => {
        setCollected((prev) => (prev[id] ? prev : { ...prev, [id]: true }));
    }, []);

    return (
        <JourneyContext.Provider value={{ collected, collect }}>
            {children}
        </JourneyContext.Provider>
    );
}

export function useJourney() {
    return useContext(JourneyContext) ?? { collected: {}, collect: () => {} };
}
