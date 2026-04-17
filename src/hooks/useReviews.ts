import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchReviews, Review } from "@/lib/reviews";
import { toast } from "sonner";

interface UseReviewsOptions {
  notify?: boolean; // If true, triggers a toast notification on new reviews
}

export function useReviews(options: UseReviewsOptions = {}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Initial Load
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchReviews();
      setReviews(data);
      setIsLoading(false);
    };

    loadData();

    // 2. Realtime Subscription Setup
    const channel = supabase
      .channel("public:reviews")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        (payload) => {
          const newReview = payload.new as Review;
          
          if (options.notify) {
            toast.success("🔥 Live Intake", {
              description: `A new review was just logged for "${newReview.product_name || 'a product'}"!`,
            });
          }

          // Instantly prepend the new row to the state
          setReviews((prev) => [newReview, ...prev]);
        }
      )
      .subscribe();

    // 3. Cleanup connection safely on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [options.notify]);

  return { reviews, isLoading };
}
