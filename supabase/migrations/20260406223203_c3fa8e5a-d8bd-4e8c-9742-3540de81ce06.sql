-- Remove the permissive INSERT policy since all inserts go through the edge function with service_role_key
DROP POLICY IF EXISTS "Anyone can submit a contact form" ON public.contact_submissions;