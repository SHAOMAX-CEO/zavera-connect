
-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  country TEXT,
  languages TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  is_registered BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- students (public directory)
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  country_flag TEXT NOT NULL DEFAULT '',
  languages TEXT[] NOT NULL DEFAULT '{}',
  topic TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  availability TEXT NOT NULL DEFAULT 'offline',
  rate_tzs INTEGER NOT NULL DEFAULT 0,
  is_online BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.students TO anon;
GRANT SELECT ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_public_read" ON public.students FOR SELECT TO anon, authenticated USING (true);

-- conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "conversations_own" ON public.conversations FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  sender TEXT NOT NULL DEFAULT 'user',
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_own" ON public.messages FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX messages_conversation_idx ON public.messages (conversation_id, created_at);

-- voice_sessions
CREATE TABLE public.voice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'requested',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.voice_sessions TO authenticated;
GRANT ALL ON public.voice_sessions TO service_role;
ALTER TABLE public.voice_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "voice_sessions_own" ON public.voice_sessions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- opportunities
CREATE TABLE public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  rate_min_tzs INTEGER,
  rate_max_tzs INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunities TO anon;
GRANT SELECT ON public.opportunities TO authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "opportunities_public_read" ON public.opportunities FOR SELECT TO anon, authenticated USING (is_active);

-- payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  amount_usd NUMERIC(10,2),
  amount_tzs INTEGER,
  purpose TEXT NOT NULL DEFAULT 'registration',
  status TEXT NOT NULL DEFAULT 'pending',
  external_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments_select_own" ON public.payments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "payments_insert_own" ON public.payments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- support_messages
CREATE TABLE public.support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.support_messages TO anon;
GRANT INSERT, SELECT ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "support_insert_anyone" ON public.support_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "support_select_own" ON public.support_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;

-- seed students
INSERT INTO public.students (name, country, country_flag, languages, topic, bio, availability, rate_tzs, is_online) VALUES
('Emma Larsen','Norway','🇳🇴','{English,Norwegian}','Historia ya Afrika','Anasoma historia ya ufalme wa Zanzibar na biashara ya Bahari ya Hindi.','online',60000,true),
('Kenji Tanaka','Japan','🇯🇵','{English,Japanese}','Vyakula vya Asili','Anataka kujifunza upishi wa ugali, mchuzi wa nazi na viungo vya Pwani.','online',55000,true),
('Sofia Rossi','Italy','🇮🇹','{English,Italian}','Muziki na Ngoma','Anasoma taarab, bongo flava na ngoma za jadi.','busy',70000,false),
('Liam Murphy','Ireland','🇮🇪','{English}','Falme za Kale','Anachunguza Great Zimbabwe, Aksum na Mali.','online',65000,true),
('Chloé Dubois','France','🇫🇷','{French,English}','Lugha ya Kiswahili','Anajifunza Kiswahili cha kila siku kwa mazungumzo.','online',50000,true),
('Noah Becker','Germany','🇩🇪','{German,English}','Mila na Desturi','Anasoma sherehe za jando, harusi na mavazi ya jadi.','offline',60000,false),
('Ana Silva','Brazil','🇧🇷','{Portuguese,English}','Muziki na Ngoma','Anaunganisha samba na midundo ya Afrika Mashariki.','online',58000,true),
('Mei Lin','China','🇨🇳','{Mandarin,English}','Biashara na Utamaduni','Anataka kuelewa masoko ya jadi na desturi za biashara.','busy',75000,false),
('Daniel Kim','South Korea','🇰🇷','{Korean,English}','Historia ya Afrika','Anasoma harakati za uhuru wa Afrika Mashariki.','online',62000,true),
('Isabella Cruz','Mexico','🇲🇽','{Spanish,English}','Vyakula vya Asili','Analinganisha vyakula vya asili vya Mexico na Tanzania.','offline',54000,false),
('Oliver Smith','United Kingdom','🇬🇧','{English}','Lugha ya Kiswahili','Anajifunza Kiswahili kwa safari ya kazi ya kujitolea.','online',80000,true),
('Aisha Rahman','Malaysia','🇲🇾','{Malay,English}','Mila na Desturi','Anasoma uhusiano wa Waswahili na Bahari ya Hindi.','online',57000,true);

INSERT INTO public.opportunities (title, description, topic, rate_min_tzs, rate_max_tzs) VALUES
('Mazungumzo ya Historia ya Afrika','Wanafunzi wanahitaji washirika wa mazungumzo kuhusu falme za kale na historia ya Pwani.','Historia ya Afrika',50000,150000),
('Mafunzo ya Kiswahili cha Mazungumzo','Saidia wanafunzi kufanya mazoezi ya Kiswahili cha kila siku.','Lugha ya Kiswahili',50000,120000),
('Utamaduni wa Vyakula','Eleza mapishi ya asili na viungo vya Afrika Mashariki.','Vyakula vya Asili',50000,100000);
