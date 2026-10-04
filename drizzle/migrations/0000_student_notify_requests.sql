CREATE TABLE public.student_notify_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, student_id)
);
GRANT SELECT, INSERT, DELETE ON public.student_notify_requests TO authenticated;
GRANT ALL ON public.student_notify_requests TO service_role;
ALTER TABLE public.student_notify_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY notify_own ON public.student_notify_requests FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);