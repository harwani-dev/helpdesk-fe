import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "../src/pages/PageLoader"
export function RouteLoader({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 2000);

        return () => clearTimeout(timeout);
    }, [location.pathname]);

    return (
        <>
            {loading ? <Loader /> : children}

        </>
    );
}
