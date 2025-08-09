-- Active: 1754608308420@@localhost@5432@plots@public
CREATE TABLE IF NOT EXISTS plots (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  cadastralNumber TEXT NOT NULL,
  area REAL NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('free', 'planted', 'harvested')),
  tasks JSONB DEFAULT '[]',
  rainfall JSONB DEFAULT '[]'
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_plots_updated_at
    BEFORE UPDATE ON plots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
