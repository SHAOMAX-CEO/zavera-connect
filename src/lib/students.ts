import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Student = {
  id: string;
  name: string;
  country: string;
  country_flag: string;
  languages: string[];
  topic: string;
  bio: string | null;
  avatar_url: string | null;
  availability: string;
  rate_tzs: number;
  is_online: boolean;
};

export const studentsQueryOptions = queryOptions({
  queryKey: ["students"],
  queryFn: async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from("students")
      .select(
        "id, name, country, country_flag, languages, topic, bio, avatar_url, availability, rate_tzs, is_online",
      )
      .order("is_online", { ascending: false })
      .order("name");
    if (error) throw error;
    return (data ?? []) as Student[];
  },
});

export const onlineCountQueryOptions = queryOptions({
  queryKey: ["students", "online-count"],
  queryFn: async (): Promise<number> => {
    const { count, error } = await supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("is_online", true);
    if (error) throw error;
    return count ?? 0;
  },
});

export function studentQueryOptions(id: string) {
  return queryOptions({
    queryKey: ["students", id],
    queryFn: async (): Promise<Student | null> => {
      const { data, error } = await supabase
        .from("students")
        .select(
          "id, name, country, country_flag, languages, topic, bio, avatar_url, availability, rate_tzs, is_online",
        )
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Student | null;
    },
  });
}
