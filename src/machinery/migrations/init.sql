CREATE TABLE IF NOT EXISTS machinery (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active','maintenance','retired')),
  hours_used INT NOT NULL DEFAULT 0,
  purchase_date DATE NOT NULL
);

INSERT INTO machinery (name,brand,model,status,hours_used,purchase_date) VALUES
('Tractor 4x4','John Deere','6M', 'active',  2450, '2021-03-12'),
('Cosechadora','Case IH','Axial-Flow', 'maintenance', 3810, '2019-11-02'),
('Sembradora','Agrometal','TX Mega', 'retired', 12000, '2012-08-15');
