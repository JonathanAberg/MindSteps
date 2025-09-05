import {useEffect, useState} from "react";
import apiClient from "@/api/client"

export type Question = {_id: string; id: number; category: string; text: string};

export function useGetQuestionByCategory(category: string) {
    const [data, setData] = useState<Question[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);


 useEffect(() => {
    if (!category) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    apiClient
    .get<Question[]>(`/questions/category/${encodeURIComponent(category)}`)
    .then((res) => mounted && setData(res.data))
    .catch((err) => {
        if (mounted) setError(err);
      })
    .finally(() => mounted && setLoading(false));

    return () => {mounted = false};
 }, [category]);

return {data, loading, error};
}
