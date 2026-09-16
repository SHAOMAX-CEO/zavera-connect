DO $$
DECLARE
  firsts text[] := ARRAY['Lucas','Mia','Ethan','Zoe','Hugo','Lea','Mateo','Nina','Felix','Clara','Adam','Sara','Jonas','Ella','Ryan','Maya','Omar','Yara','Tomas','Ines','Erik','Freya','Diego','Lucia','Kai','Hana','Ivan','Petra','Milan','Ana',
    'Samuel','Alice','Victor','Julia','Marc','Elin','Pablo','Rosa','Nils','Amelie','Jack','Chiara','Bruno','Sanne','Arthur','Marta','Levi','Nora','Theo','Selin','Ali','Aylin','Rafael','Bianca','Simon','Katja','Anton','Lina','Jonah','Elsa',
    'Caleb','Ruby','Oscar','Iris','Henry','Naomi','Tobias','Anouk','Leon','Emily','Miguel','Paula','Andres','Camila','Takumi','Yuki','Minho','Jisoo','Wei','Lan','Arjun','Priya','Rahul','Aditi','Hassan','Layla','Youssef','Amina','Karim','Salma',
    'Peter','Grace','David','Hannah','Marco','Elena','Nikolai','Olga','Stefan','Ivana','Gabriel','Sophie','Jonatan','Linnea'];
  lasts text[] := ARRAY['Martin','Silva','Novak','Kowalski','Fischer','Rossi','Andersen','Dubois','Larsen','Costa','Weber','Moreau','Nielsen','Petrov','Garcia','Bakker','Lindberg','Horvat','Reyes','Suzuki'];
  countries text[] := ARRAY['Germany','France','Italy','Spain','Netherlands','Sweden','Norway','Denmark','Poland','Portugal','Brazil','Mexico','Argentina','Canada','United States','United Kingdom','Ireland','Japan','South Korea','China','India','Turkey','Greece','Czechia','Croatia','Finland','Belgium','Switzerland','Australia','New Zealand'];
  flags text[] := ARRAY['🇩🇪','🇫🇷','🇮🇹','🇪🇸','🇳🇱','🇸🇪','🇳🇴','🇩🇰','🇵🇱','🇵🇹','🇧🇷','🇲🇽','🇦🇷','🇨🇦','🇺🇸','🇬🇧','🇮🇪','🇯🇵','🇰🇷','🇨🇳','🇮🇳','🇹🇷','🇬🇷','🇨🇿','🇭🇷','🇫🇮','🇧🇪','🇨🇭','🇦🇺','🇳🇿'];
  langs text[] := ARRAY['English,German','English,French','English,Italian','English,Spanish','English,Dutch','English,Swedish','English,Portuguese','English,Japanese','English,Korean','English,Mandarin','English,Hindi','English,Turkish'];
  topics text[] := ARRAY['African History','Traditional Food','Ancient Kingdoms','Languages','Music & Dance','Clothing & Fashion','Customs & Traditions','Nature & Wildlife','Daily Life','Communities & Beliefs'];
  i int;
  gender text;
BEGIN
  FOR i IN 0..99 LOOP
    gender := CASE WHEN i % 2 = 0 THEN 'women' ELSE 'men' END;
    INSERT INTO public.students (name, country, country_flag, languages, topic, bio, avatar_url, availability, rate_tzs, is_online)
    VALUES (
      firsts[1 + (i % array_length(firsts,1))] || ' ' || lasts[1 + (i % array_length(lasts,1))],
      countries[1 + (i % 30)],
      flags[1 + (i % 30)],
      string_to_array(langs[1 + (i % 12)], ','),
      topics[1 + (i % 10)],
      'I want to learn about ' || topics[1 + (i % 10)] || ' directly from people who live it in Africa.',
      'https://randomuser.me/api/portraits/' || gender || '/' || ((i * 7) % 90) || '.jpg',
      CASE WHEN i % 3 = 0 THEN 'online' WHEN i % 3 = 1 THEN 'busy' ELSE 'offline' END,
      20000 + ((i % 8) * 5000),
      (i % 3 = 0)
    );
  END LOOP;
END $$;