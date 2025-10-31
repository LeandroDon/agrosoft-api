CREATE TABLE IF NOT EXISTS plots (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  cadastralNumber TEXT NOT NULL,
  area REAL NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('free', 'planted', 'harvested')),
  tasks JSONB DEFAULT '[]',
  rainfall JSONB DEFAULT '[]',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE IF NOT EXISTS machinery (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','maintenance','retired')),
  hours_used INTEGER NOT NULL DEFAULT 0,
  purchase_date DATE NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_machinery_updated_at
    BEFORE UPDATE ON machinery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
