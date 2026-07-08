
UPDATE public.reviews SET link_url = NULL
  WHERE link_url IS NOT NULL AND link_url !~* '^https?://';

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_link_url_scheme_chk
    CHECK (link_url IS NULL OR link_url ~* '^https?://');

ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_pros_cons_cardinality_chk
    CHECK (
      (pros IS NULL OR cardinality(pros) <= 10)
      AND (cons IS NULL OR cardinality(cons) <= 10)
    );

ALTER TABLE public.newsletter_subscribers
  ADD CONSTRAINT newsletter_email_format_chk
    CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

CREATE OR REPLACE FUNCTION public.is_user_premium(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _user_id IS NULL THEN RETURN false; END IF;
  IF auth.uid() IS NULL OR auth.uid() <> _user_id THEN RETURN false; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.user_subscriptions
    WHERE user_id = _user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$;
