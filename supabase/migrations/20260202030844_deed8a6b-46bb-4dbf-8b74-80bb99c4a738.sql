-- Create admin_sessions table for QR-based PC login
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pc_id UUID NOT NULL DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'used')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  activated_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for edge functions)
CREATE POLICY "Service role full access"
ON public.admin_sessions
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy: Authenticated users can read their own active sessions
CREATE POLICY "Users can view their active sessions"
ON public.admin_sessions
FOR SELECT
TO authenticated
USING (user_id = auth.uid() AND status = 'active');

-- Create index for faster lookups
CREATE INDEX idx_admin_sessions_token ON public.admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_status ON public.admin_sessions(status);
CREATE INDEX idx_admin_sessions_expires ON public.admin_sessions(expires_at);