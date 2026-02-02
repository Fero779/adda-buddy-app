-- Create studio_sessions table for Studio App QR login
CREATE TABLE public.studio_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT NOT NULL,
  panel_id UUID NOT NULL DEFAULT gen_random_uuid(),
  class_id TEXT NOT NULL,
  teacher_id UUID NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  activated_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.studio_sessions ENABLE ROW LEVEL SECURITY;

-- Service role full access (for edge functions)
CREATE POLICY "Service role full access on studio_sessions"
  ON public.studio_sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Teachers can view their active studio sessions
CREATE POLICY "Teachers can view their active studio sessions"
  ON public.studio_sessions
  FOR SELECT
  USING (teacher_id = auth.uid() AND status = 'active');