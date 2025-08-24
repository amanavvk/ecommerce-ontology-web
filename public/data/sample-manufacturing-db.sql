-- Sample Manufacturing Database Schema and Data
-- This demonstrates the legacy database structure that will be mapped to RDF

-- ===============================
-- Database Schema Definition
-- ===============================

-- Machine table - represents manufacturing equipment
CREATE TABLE Machine (
    MachineID VARCHAR(50) PRIMARY KEY,
    Type VARCHAR(100) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    InstallDate DATE NOT NULL,
    Status VARCHAR(20) DEFAULT 'Active',
    Manufacturer VARCHAR(100),
    SerialNumber VARCHAR(100)
);

-- Production table - represents production runs
CREATE TABLE Production (
    ProductionID INT PRIMARY KEY,
    MachineID VARCHAR(50) NOT NULL,
    Timestamp DATETIME NOT NULL,
    Output_Quantity INT NOT NULL,
    Quality_Score DECIMAL(5,2),
    StartTime DATETIME,
    EndTime DATETIME,
    ProductCode VARCHAR(50),
    OperatorID VARCHAR(50),
    FOREIGN KEY (MachineID) REFERENCES Machine(MachineID)
);

-- Additional tables for extended integration
CREATE TABLE Operator (
    OperatorID VARCHAR(50) PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Shift VARCHAR(20),
    Department VARCHAR(50)
);

CREATE TABLE MaintenanceRecord (
    MaintenanceID INT PRIMARY KEY,
    MachineID VARCHAR(50) NOT NULL,
    MaintenanceDate DATETIME NOT NULL,
    MaintenanceType VARCHAR(50),
    Description TEXT,
    TechnicianID VARCHAR(50),
    Duration_Hours DECIMAL(4,2),
    Cost DECIMAL(10,2),
    FOREIGN KEY (MachineID) REFERENCES Machine(MachineID)
);

-- ===============================
-- Sample Data Insertion
-- ===============================

-- Machine data
INSERT INTO Machine (MachineID, Type, Location, InstallDate, Status, Manufacturer, SerialNumber) VALUES
('M001', 'CNC Milling Machine', 'Building A - Line 1', '2020-01-15', 'Active', 'Haas Automation', 'VM-2'),
('M002', 'Injection Molding Machine', 'Building A - Line 2', '2019-06-20', 'Active', 'Engel', 'EM-450'),
('M003', 'Laser Cutting Machine', 'Building B - Line 1', '2021-03-10', 'Active', 'Trumpf', 'TL-3030'),
('M004', 'Assembly Robot', 'Building A - Assembly', '2020-11-05', 'Active', 'ABB', 'IRB-1600'),
('M005', 'Quality Inspection Station', 'Quality Lab', '2018-08-12', 'Active', 'Zeiss', 'CMM-850'),
('M006', 'Packaging Machine', 'Building C - Packaging', '2019-12-01', 'Maintenance', 'Bosch', 'PKG-2000'),
('M007', 'Conveyor System', 'Building A-B Connector', '2020-02-28', 'Active', 'Flexco', 'CNV-500'),
('M008', 'Welding Station', 'Building B - Line 2', '2021-01-18', 'Active', 'Lincoln Electric', 'WS-400');

-- Production data (last 30 days of sample data)
INSERT INTO Production (ProductionID, MachineID, Timestamp, Output_Quantity, Quality_Score, StartTime, EndTime, ProductCode, OperatorID) VALUES
-- M001 - CNC Milling Machine
(1001, 'M001', '2025-08-20 08:00:00', 125, 94.5, '2025-08-20 08:00:00', '2025-08-20 16:00:00', 'PART-001', 'OP001'),
(1002, 'M001', '2025-08-21 08:00:00', 130, 96.2, '2025-08-21 08:00:00', '2025-08-21 16:00:00', 'PART-001', 'OP001'),
(1003, 'M001', '2025-08-22 08:00:00', 128, 95.8, '2025-08-22 08:00:00', '2025-08-22 16:00:00', 'PART-002', 'OP002'),
(1004, 'M001', '2025-08-23 08:00:00', 132, 97.1, '2025-08-23 08:00:00', '2025-08-23 16:00:00', 'PART-001', 'OP001'),

-- M002 - Injection Molding Machine
(1005, 'M002', '2025-08-20 06:00:00', 2400, 92.3, '2025-08-20 06:00:00', '2025-08-20 14:00:00', 'MOLD-100', 'OP003'),
(1006, 'M002', '2025-08-20 14:00:00', 2350, 93.7, '2025-08-20 14:00:00', '2025-08-20 22:00:00', 'MOLD-100', 'OP004'),
(1007, 'M002', '2025-08-21 06:00:00', 2500, 94.1, '2025-08-21 06:00:00', '2025-08-21 14:00:00', 'MOLD-101', 'OP003'),
(1008, 'M002', '2025-08-21 14:00:00', 2480, 93.9, '2025-08-21 14:00:00', '2025-08-21 22:00:00', 'MOLD-101', 'OP004'),

-- M003 - Laser Cutting Machine
(1009, 'M003', '2025-08-20 09:00:00', 85, 98.2, '2025-08-20 09:00:00', '2025-08-20 17:00:00', 'SHEET-001', 'OP005'),
(1010, 'M003', '2025-08-21 09:00:00', 88, 97.9, '2025-08-21 09:00:00', '2025-08-21 17:00:00', 'SHEET-001', 'OP005'),
(1011, 'M003', '2025-08-22 09:00:00', 82, 98.5, '2025-08-22 09:00:00', '2025-08-22 17:00:00', 'SHEET-002', 'OP006'),

-- M004 - Assembly Robot
(1012, 'M004', '2025-08-20 07:00:00', 200, 99.1, '2025-08-20 07:00:00', '2025-08-20 15:00:00', 'ASSY-001', 'OP007'),
(1013, 'M004', '2025-08-20 15:00:00', 195, 98.8, '2025-08-20 15:00:00', '2025-08-20 23:00:00', 'ASSY-001', 'OP008'),
(1014, 'M004', '2025-08-21 07:00:00', 205, 99.3, '2025-08-21 07:00:00', '2025-08-21 15:00:00', 'ASSY-002', 'OP007'),

-- M005 - Quality Inspection Station
(1015, 'M005', '2025-08-20 10:00:00', 150, 96.7, '2025-08-20 10:00:00', '2025-08-20 18:00:00', 'INSP-ALL', 'OP009'),
(1016, 'M005', '2025-08-21 10:00:00', 148, 97.2, '2025-08-21 10:00:00', '2025-08-21 18:00:00', 'INSP-ALL', 'OP009'),

-- M007 - Conveyor System (no quality score - transport only)
(1017, 'M007', '2025-08-20 06:00:00', 5000, NULL, '2025-08-20 06:00:00', '2025-08-20 23:59:00', 'TRANSPORT', 'OP010'),
(1018, 'M007', '2025-08-21 06:00:00', 5200, NULL, '2025-08-21 06:00:00', '2025-08-21 23:59:00', 'TRANSPORT', 'OP010'),

-- M008 - Welding Station
(1019, 'M008', '2025-08-20 08:30:00', 45, 95.4, '2025-08-20 08:30:00', '2025-08-20 16:30:00', 'WELD-001', 'OP011'),
(1020, 'M008', '2025-08-21 08:30:00', 48, 96.1, '2025-08-21 08:30:00', '2025-08-21 16:30:00', 'WELD-001', 'OP011');

-- Operator data
INSERT INTO Operator (OperatorID, FirstName, LastName, Shift, Department) VALUES
('OP001', 'John', 'Smith', 'Day', 'Machining'),
('OP002', 'Sarah', 'Johnson', 'Day', 'Machining'),
('OP003', 'Mike', 'Wilson', 'Day', 'Molding'),
('OP004', 'Lisa', 'Brown', 'Evening', 'Molding'),
('OP005', 'David', 'Miller', 'Day', 'Cutting'),
('OP006', 'Emily', 'Davis', 'Day', 'Cutting'),
('OP007', 'Robert', 'Garcia', 'Day', 'Assembly'),
('OP008', 'Jennifer', 'Martinez', 'Evening', 'Assembly'),
('OP009', 'Michael', 'Anderson', 'Day', 'Quality'),
('OP010', 'Amanda', 'Taylor', 'All', 'Logistics'),
('OP011', 'James', 'Thomas', 'Day', 'Welding');

-- Maintenance record data
INSERT INTO MaintenanceRecord (MaintenanceID, MachineID, MaintenanceDate, MaintenanceType, Description, TechnicianID, Duration_Hours, Cost) VALUES
(2001, 'M001', '2025-08-15 18:00:00', 'Preventive', 'Regular calibration and lubrication', 'TECH001', 2.5, 250.00),
(2002, 'M002', '2025-08-10 20:00:00', 'Corrective', 'Replaced heating element', 'TECH002', 4.0, 850.00),
(2003, 'M003', '2025-08-18 19:00:00', 'Preventive', 'Lens cleaning and alignment check', 'TECH001', 1.5, 150.00),
(2004, 'M004', '2025-08-12 16:00:00', 'Preventive', 'Software update and sensor calibration', 'TECH003', 3.0, 300.00),
(2005, 'M005', '2025-08-08 17:00:00', 'Corrective', 'Replaced measurement probe', 'TECH002', 2.0, 1200.00),
(2006, 'M006', '2025-08-22 08:00:00', 'Corrective', 'Motor replacement - currently in maintenance', 'TECH001', 8.0, 2500.00),
(2007, 'M007', '2025-08-14 22:00:00', 'Preventive', 'Belt tension adjustment and lubrication', 'TECH003', 1.0, 100.00),
(2008, 'M008', '2025-08-16 18:30:00', 'Preventive', 'Electrode replacement and gas system check', 'TECH002', 2.5, 300.00);

-- ===============================
-- Data Quality and Analytics Queries
-- ===============================

-- Quality metrics by machine
SELECT 
    m.MachineID,
    m.Type,
    m.Location,
    COUNT(p.ProductionID) as total_runs,
    AVG(p.Quality_Score) as avg_quality,
    SUM(p.Output_Quantity) as total_output,
    MIN(p.Quality_Score) as min_quality,
    MAX(p.Quality_Score) as max_quality
FROM Machine m
LEFT JOIN Production p ON m.MachineID = p.MachineID
WHERE p.Quality_Score IS NOT NULL
GROUP BY m.MachineID, m.Type, m.Location
ORDER BY avg_quality DESC;

-- Production efficiency by day
SELECT 
    DATE(p.Timestamp) as production_date,
    COUNT(p.ProductionID) as total_runs,
    SUM(p.Output_Quantity) as total_output,
    AVG(p.Quality_Score) as avg_quality
FROM Production p
WHERE p.Quality_Score IS NOT NULL
GROUP BY DATE(p.Timestamp)
ORDER BY production_date DESC;

-- Machine utilization (time-based)
SELECT 
    m.MachineID,
    m.Type,
    COUNT(p.ProductionID) as production_runs,
    SUM(TIMESTAMPDIFF(HOUR, p.StartTime, p.EndTime)) as total_runtime_hours,
    AVG(TIMESTAMPDIFF(HOUR, p.StartTime, p.EndTime)) as avg_runtime_per_run
FROM Machine m
LEFT JOIN Production p ON m.MachineID = p.MachineID
WHERE p.StartTime IS NOT NULL AND p.EndTime IS NOT NULL
GROUP BY m.MachineID, m.Type
ORDER BY total_runtime_hours DESC;

-- Maintenance cost analysis
SELECT 
    m.MachineID,
    m.Type,
    COUNT(mr.MaintenanceID) as maintenance_count,
    SUM(mr.Cost) as total_maintenance_cost,
    AVG(mr.Cost) as avg_maintenance_cost,
    SUM(mr.Duration_Hours) as total_maintenance_hours
FROM Machine m
LEFT JOIN MaintenanceRecord mr ON m.MachineID = mr.MachineID
GROUP BY m.MachineID, m.Type
ORDER BY total_maintenance_cost DESC;

-- Quality trends over time
SELECT 
    DATE(p.Timestamp) as date,
    m.Type as machine_type,
    AVG(p.Quality_Score) as avg_quality,
    COUNT(p.ProductionID) as run_count
FROM Production p
JOIN Machine m ON p.MachineID = m.MachineID
WHERE p.Quality_Score IS NOT NULL
GROUP BY DATE(p.Timestamp), m.Type
ORDER BY date DESC, machine_type;

-- ===============================
-- Comments for R2RML Integration
-- ===============================

/*
This sample database represents a typical manufacturing environment with:

1. MACHINE DIVERSITY: Different types of manufacturing equipment
2. PRODUCTION TRACKING: Time-series production data with quality metrics
3. HUMAN RESOURCES: Operator assignments and shift information
4. MAINTENANCE: Equipment maintenance history and costs
5. DATA QUALITY ISSUES: Some NULL values in Quality_Score (realistic scenario)

Key R2RML Mapping Considerations:
- Machine.MachineID serves as the primary identifier for machine URIs
- Production.ProductionID creates unique production run URIs
- Quality_Score can be NULL (handle gracefully in mappings)
- Timestamps require proper XSD dateTime formatting
- Foreign key relationships become object properties in RDF
- Calculated fields (efficiency, utilization) can be derived via SQL queries

This data structure supports the R2RML mappings defined in manufacturing-mappings.ttl
and demonstrates real-world complexity including missing data and multiple relationships.
*/
