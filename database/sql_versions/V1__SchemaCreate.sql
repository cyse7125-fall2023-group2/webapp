DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'app') THEN
    CREATE SCHEMA app;
  END IF;
END $$;