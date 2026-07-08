
CREATE TABLE IF NOT EXISTS public.insurance_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  quote_type TEXT NOT NULL CHECK (quote_type IN ('kasko','trafik')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  plate TEXT,
  brand TEXT,
  model TEXT,
  year INTEGER,
  fuel_type TEXT,
  usage_type TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.insurance_quotes TO authenticated;
GRANT INSERT ON public.insurance_quotes TO anon;
GRANT ALL ON public.insurance_quotes TO service_role;

ALTER TABLE public.insurance_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a quote"
  ON public.insurance_quotes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own quotes"
  ON public.insurance_quotes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all quotes"
  ON public.insurance_quotes FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update quotes"
  ON public.insurance_quotes FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_insurance_quotes_updated_at
  BEFORE UPDATE ON public.insurance_quotes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
