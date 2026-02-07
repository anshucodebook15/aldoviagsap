// LoaderContext.tsx
import { createContext, useContext, useState } from "react";

const LoaderContext = createContext<any>(null);

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }: any) => {
    const [ready, setReady] = useState(false);
    const [assets, setAssets] = useState<any>({});

    return (
        <LoaderContext.Provider value={{ ready, setReady, assets, setAssets }}>
            {children}
        </LoaderContext.Provider>
    );
};
