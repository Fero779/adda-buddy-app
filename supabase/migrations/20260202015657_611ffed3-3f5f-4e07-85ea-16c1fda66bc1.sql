-- Drop the permissive policy
DROP POLICY IF EXISTS "Allow all for service role" ON public.phone_otps;

-- Create more restrictive policy - OTPs should only be managed by service role (edge functions)
-- Users should never directly access this table, only through edge functions
CREATE POLICY "No direct access to phone_otps"
ON public.phone_otps FOR ALL
USING (false);