-- Sample Manufacturing Database Schema and Data
-- This file contains the SQL schema and sample data for the R2RML mapping demonstration

-- Create Machine table
CREATE TABLE Machine (
    MachineID VARCHAR(50) PRIMARY KEY,
    Type VARCHAR(100) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    InstallDate DATETIME NOT NULL
);

-- Create Production table
CREATE TABLE Production (
    ProductionID VARCHAR(50) PRIMARY KEY,
    MachineID VARCHAR(50) NOT NULL,
    Timestamp DATETIME NOT NULL,
    Output_Quantity INTEGER NOT NULL,
    Quality_Score DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (MachineID) REFERENCES Machine(MachineID)
);

-- Insert sample Machine data
INSERT INTO Machine (MachineID, Type, Location, InstallDate) VALUES
('M001', 'CNC Milling Machine', 'Factory Floor A', '2020-01-15 09:00:00'),
('M002', 'Assembly Line Station', 'Factory Floor B', '2019-06-20 10:30:00'),
('M003', 'Quality Control Scanner', 'Quality Lab', '2021-03-10 14:15:00'),
('M004', 'Robotic Welder', 'Factory Floor A', '2020-08-05 11:45:00'),
('M005', 'Packaging Machine', 'Shipping Dock', '2019-12-12 16:20:00'),
('M006', 'CNC Lathe', 'Factory Floor C', '2021-07-22 08:30:00'),
('M007', 'Paint Booth', 'Finishing Area', '2020-04-18 13:00:00'),
('M008', 'Testing Station', 'Quality Lab', '2021-01-30 09:45:00');

-- Insert sample Production data
INSERT INTO Production (ProductionID, MachineID, Timestamp, Output_Quantity, Quality_Score) VALUES
('P001', 'M001', '2024-01-15 08:30:00', 150, 95.5),
('P002', 'M001', '2024-01-15 16:45:00', 142, 92.3),
('P003', 'M002', '2024-01-15 09:15:00', 200, 88.7),
('P004', 'M003', '2024-01-15 10:00:00', 180, 96.2),
('P005', 'M004', '2024-01-15 11:30:00', 75, 89.1),
('P006', 'M005', '2024-01-15 13:45:00', 300, 91.8),
('P007', 'M006', '2024-01-15 14:20:00', 120, 94.6),
('P008', 'M007', '2024-01-15 15:10:00', 85, 87.4),
('P009', 'M008', '2024-01-15 16:30:00', 160, 93.9),
('P010', 'M001', '2024-01-16 08:45:00', 148, 90.2),
('P011', 'M002', '2024-01-16 09:30:00', 195, 85.6),
('P012', 'M003', '2024-01-16 10:15:00', 175, 97.1),
('P013', 'M004', '2024-01-16 11:45:00', 78, 86.3),
('P014', 'M005', '2024-01-16 13:20:00', 310, 89.7),
('P015', 'M006', '2024-01-16 14:40:00', 125, 92.8),
('P016', 'M007', '2024-01-16 15:25:00', 88, 84.2),
('P017', 'M008', '2024-01-16 16:50:00', 165, 95.4),
('P018', 'M001', '2024-01-17 08:20:00', 145, 88.9),
('P019', 'M002', '2024-01-17 09:45:00', 205, 91.5),
('P020', 'M003', '2024-01-17 10:30:00', 170, 94.3),
-- Low quality samples for testing
('P021', 'M004', '2024-01-17 11:15:00', 65, 68.5),
('P022', 'M005', '2024-01-17 13:10:00', 280, 72.3),
('P023', 'M006', '2024-01-17 14:55:00', 115, 65.8),
('P024', 'M007', '2024-01-17 15:40:00', 82, 69.7),
-- High quality samples
('P025', 'M008', '2024-01-17 16:25:00', 175, 98.2),
('P026', 'M001', '2024-01-18 08:35:00', 155, 97.6),
('P027', 'M002', '2024-01-18 09:50:00', 210, 96.8),
('P028', 'M003', '2024-01-18 10:45:00', 185, 99.1);

-- Queries to validate data
-- SELECT COUNT(*) FROM Machine; -- Should return 8
-- SELECT COUNT(*) FROM Production; -- Should return 28
-- SELECT AVG(Quality_Score) FROM Production; -- Should show average quality
-- SELECT Machine.Type, COUNT(Production.ProductionID) as ProductionCount 
-- FROM Machine LEFT JOIN Production ON Machine.MachineID = Production.MachineID 
-- GROUP BY Machine.Type;

-- Additional indexes for performance (optional)
CREATE INDEX idx_production_machine ON Production(MachineID);
CREATE INDEX idx_production_timestamp ON Production(Timestamp);
CREATE INDEX idx_production_quality ON Production(Quality_Score);
CREATE INDEX idx_machine_type ON Machine(Type);
CREATE INDEX idx_machine_location ON Machine(Location);
