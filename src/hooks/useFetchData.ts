import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useFetchData<T>(
  table: string,
  options: { single?: boolean; orderBy?: string; orderDesc?: boolean } = {},
) {
  const [data, setData] = useState<T | T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        let query = supabase.from(table).select('*');

        if (options.orderBy) {
          query = query.order(options.orderBy, { ascending: !options.orderDesc });
        }

        if (options.single) {
          const { data, error } = await query.single();
          if (error) throw error;
          setData(data as T);
        } else {
          const { data, error } = await query;
          if (error) throw error;
          setData((data ?? null) as T[] | null);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [table, options.single, options.orderBy, options.orderDesc]);

  return { data, loading, error };
}
