
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    seniority INTEGER NOT NULL,
    availableHours INTEGER NOT NULL,
    overtimeHours INTEGER NOT NULL,
    salary REAL NOT NULL,
    performanceScore INTEGER NOT NULL,
    assignedTasks TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_employees_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_employees_updated_at_column();


CREATE TABLE IF NOT EXISTS plots (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    cadastralNumber TEXT NOT NULL,
    area REAL NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('free', 'planted', 'harvested')),
    tasks JSONB DEFAULT '[]',
    rainfall JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_plots_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_plots_updated_at ON plots;

CREATE TRIGGER update_plots_updated_at
    BEFORE UPDATE ON plots
    FOR EACH ROW
    EXECUTE FUNCTION update_plots_updated_at_column();
