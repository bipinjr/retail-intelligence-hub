import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  product_id: string | null;
  product_name: string | null;
  reviewer_name: string | null;
  review_text: string | null;
  rating: number | null;
  sentiment: string | null;
  label_tags: string[] | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  source: string | null;
  platform: string | null;
  created_at: string;
}

export type InsertReviewDTO = Omit<Review, "id" | "created_at">;

/**
 * Fetches all reviews from the Supabase "reviews" table.
 * Sorted by created_at in descending order.
 */
export async function fetchReviews(): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }

    return data as Review[];
  } catch (err) {
    console.error("Unexpected error fetching reviews:", err);
    return [];
  }
}

/**
 * Inserts a new review into the Supabase "reviews" table.
 * @param reviewData The review data to insert (omits id and created_at).
 * @returns The inserted review data or null if it fails.
 */
export async function insertReview(reviewData: InsertReviewDTO): Promise<{ data: Review | null, error: any }> {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .insert([reviewData])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error details:", error);
      return { data: null, error: error.message || error.details || "Database rejection" };
    }

    return { data: data as Review, error: null };
  } catch (err: any) {
    console.error("Unexpected crash inserting review:", err);
    return { data: null, error: err.message || "Fatal error during transmission" };
  }
}

/*
 ==============================================================================
 SQL SCHEMA FOR SUPABASE
 ==============================================================================
 Run this in your Supabase SQL Editor if the table doesn't exist yet:

 CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id text,
    product_name text,
    reviewer_name text,
    review_text text,
    rating numeric,
    sentiment text,
    label_tags text[],
    city text,
    latitude numeric,
    longitude numeric,
    source text,
    platform text,
    created_at timestamp with time zone DEFAULT now()
 );
 
 -- Enable RLS (Row Level Security) safely for testing:
 ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
 
 -- Simple policies (allow everyone to read & insert during development):
 CREATE POLICY "Enable read access for all users" ON public.reviews FOR SELECT USING (true);
 CREATE POLICY "Enable insert access for all users" ON public.reviews FOR INSERT WITH CHECK (true);
 ==============================================================================
*/
