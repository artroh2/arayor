
-- 1. community_members: remove anon read of public communities members (which exposed emails)
DROP POLICY IF EXISTS "Anyone can view members of public communities" ON public.community_members;
CREATE POLICY "Authenticated users can view members of public communities"
  ON public.community_members FOR SELECT
  TO authenticated
  USING (is_community_public(community_id));

REVOKE SELECT ON public.community_members FROM anon;

-- 2. reviews: prevent anon from reading user_email column while keeping public review browsing
REVOKE SELECT ON public.reviews FROM anon;
GRANT SELECT (id, vehicle_id, user_id, user_name, user_avatar, rating, title, content, pros, cons, parent_id, created_at, updated_at, link_url)
  ON public.reviews TO anon;

-- Also hide user_email from generic authenticated selects (admin uses service role scoped queries)
REVOKE SELECT ON public.reviews FROM authenticated;
GRANT SELECT (id, vehicle_id, user_id, user_name, user_avatar, rating, title, content, pros, cons, parent_id, created_at, updated_at, link_url)
  ON public.reviews TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;

-- 3. community_messages: hide user_email column from other members
REVOKE SELECT ON public.community_messages FROM authenticated;
GRANT SELECT (id, community_id, user_id, user_name, user_avatar, content, image_url, created_at)
  ON public.community_messages TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.community_messages TO authenticated;

-- 4. insurance_quotes: enforce that anon inserts have null user_id and authenticated inserts match auth.uid()
DROP POLICY IF EXISTS "Anyone can submit a quote" ON public.insurance_quotes;
CREATE POLICY "Anon can submit quote without user_id"
  ON public.insurance_quotes FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);
CREATE POLICY "Authenticated can submit quote for self"
  ON public.insurance_quotes FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 5. Restrict EXECUTE on SECURITY DEFINER helper functions to only what needs it
REVOKE EXECUTE ON FUNCTION public.is_premium_user(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_user_premium(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_user_tier(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_community_owner(uuid, uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_community_member(uuid, uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_community_public(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_community_member_count() FROM anon, authenticated, public;
