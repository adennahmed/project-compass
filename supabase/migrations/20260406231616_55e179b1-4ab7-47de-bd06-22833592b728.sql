-- Fix 1: Add RLS policy for contact_submissions (service role only insert)
CREATE POLICY "Service role can insert contact submissions"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role'::text);

CREATE POLICY "Service role can read contact submissions"
ON public.contact_submissions
FOR SELECT
TO public
USING (auth.role() = 'service_role'::text);

-- Fix 2: Set search_path on all public functions to prevent search_path injection
ALTER FUNCTION public.enqueue_email SET search_path = public;
ALTER FUNCTION public.read_email_batch SET search_path = public;
ALTER FUNCTION public.delete_email SET search_path = public;
ALTER FUNCTION public.move_to_dlq SET search_path = public;