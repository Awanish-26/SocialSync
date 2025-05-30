import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

export default function useApi(endpoint, method = "get", options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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