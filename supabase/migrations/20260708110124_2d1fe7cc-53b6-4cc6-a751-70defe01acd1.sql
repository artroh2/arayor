
-- reviews: remove broad public SELECT on base table; keep view for public reads
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Users can view own review rows"
  ON public.reviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Make sure reviews_public view remains accessible
GRANT SELECT ON public.reviews_public TO anon, authenticated;

-- community_members: hide user_email column entirely from authenticated selects
REVOKE SELECT ON public.community_members FROM authenticated;
GRANT SELECT (id, community_id, user_id, user_name, user_avatar, role, joined_at)
  ON public.community_members TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_members TO authenticated;

-- review_likes: restrict SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can view likes" ON public.review_likes;
CREATE POLICY "Authenticated users can view likes"
  ON public.review_likes FOR SELECT
  TO authenticated
  USING (true);
REVOKE SELECT ON public.review_likes FROM anon;

-- insurance_quotes: require authentication to submit
DROP POLICY IF EXISTS "Anon can submit quote without user_id" ON public.insurance_quotes;
REVOKE INSERT ON public.insurance_quotes FROM anon;

-- Storage: drop broad public SELECT policies (public URLs still work for public buckets)
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view review images" ON storage.objects;
