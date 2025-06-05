import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

export default function useApi(endpoint, method = "get", options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!!endpoint);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!endpoint) {
            setLoading(false);
            setData(null);
            setError(null);
            return;
        }
        let isMounted = true;
        setLoading(true);
        setError(null);

        apiClient[method](endpoint, options)
            .then(res => {
                if (isMounted) setData(res.data);
            })
            .catch(err => {
                if (isMounted) setError(err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => { isMounted = false; };
    }, [endpoint, method, JSON.stringify(options)]);

    return { data, loading, error };
}
// Now skips API call if endpoint is falsy (null/undefined)