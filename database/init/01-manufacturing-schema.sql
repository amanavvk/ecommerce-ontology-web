-- Manufacturing Database Schema and Sample Data
-- This file will be automatically executed when MySQL container starts

-- Create the manufacturing database if it doesn't exist
CREATE DATABASE IF NOT EXISTS manufacturing;
USE manufacturing;

-- =====================================================
-- TABLE: Machine
-- Stores information about manufacturing machines
-- =====================================================
CREATE TABLE IF NOT EXISTS Machine (
    MachineID VARCHAR(50) PRIMARY KEY,
    Type VARCHAR(100) NOT NULL,
    Location VARCHAR(100) NOT NULL,
    InstallDate DATE NOT NULL,
    Status ENUM('Active', 'Maintenance', 'Inactive') DEFAULT 'Active',
    Manufacturer VARCHAR(100),
    Model VARCHAR(100),
    SerialNumber VARCHAR(100),
    LastMaintenanceDate DATE,
    NextMaintenanceDate DATE
);

-- =====================================================
-- TABLE: Production
-- Stores production run information
-- =====================================================
CREATE TABLE IF NOT EXISTS Production (
    ProductionID INT PRIMARY KEY AUTO_INCREMENT,
    MachineID VARCHAR(50) NOT NULL,
    Timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Output_Quantity INT NOT NULL,
    Quality_Score DECIMAL(5,2) NOT NULL CHECK (Quality_Score >= 0 AND Quality_Score <= 100),
    ProductType VARCHAR(100),
    BatchNumber VARCHAR(50),
    OperatorID VARCHAR(50),
    ShiftNumber INT,
    Temperature DECIMAL(5,2),
    Humidity DECIMAL(5,2),
    ProcessingTime INT, -- in minutes
    EnergyConsumption DECIMAL(10,2), -- in kWh
    FOREIGN KEY (MachineID) REFERENCES Machine(MachineID)
);

-- =====================================================
-- TABLE: QualityControl (Additional table for enhanced R2RML)
-- =====================================================
CREATE TABLE IF NOT EXISTS QualityControl (
    QualityID INT PRIMARY KEY AUTO_INCREMENT,
    ProductionID INT NOT NULL,
    InspectorID VARCHAR(50),
    InspectionDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    DefectCount INT DEFAULT 0,
    DefectType VARCHAR(200),
    InspectionResult ENUM('Pass', 'Fail', 'Conditional') NOT NULL,
    Notes TEXT,
    FOREIGN KEY (ProductionID) REFERENCES Production(ProductionID)
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert Machine Data
INSERT INTO Machine (MachineID, Type, Location, InstallDate, Status, Manufacturer, Model, SerialNumber, LastMaintenanceDate, NextMaintenanceDate) VALUES
('M001', 'CNC Mill', 'Production Floor A', '2020-01-15', 'Active', 'Haas Automation', 'VF-2', 'SN001234', '2024-07-01', '2024-10-01'),
('M002', 'Assembly Line', 'Production Floor B', '2019-06-20', 'Active', 'Bosch Rexroth', 'TS2plus', 'SN002345', '2024-06-15', '2024-09-15'),
('M003', 'Quality Control Station', 'QC Department', '2021-03-10', 'Active', 'Keyence', 'CV-X100F', 'SN003456', '2024-08-01', '2024-11-01'),
('M004', 'CNC Lathe', 'Production Floor A', '2020-09-05', 'Active', 'Mazak', 'QUICK TURN NEXUS 100-II', 'SN004567', '2024-07-20', '2024-10-20'),
('M005', 'Assembly Line', 'Production Floor C', '2018-11-12', 'Maintenance', 'ABB', 'FlexPicker IRB 360', 'SN005678', '2024-08-10', '2024-08-25'),
('M006', 'Injection Molding', 'Production Floor B', '2022-02-28', 'Active', 'Engel', 'e-motion 310/120', 'SN006789', '2024-07-30', '2024-10-30'),
('M007', 'Welding Robot', 'Production Floor A', '2021-08-15', 'Active', 'KUKA', 'KR 16 R2010', 'SN007890', '2024-08-05', '2024-11-05'),
('M008', 'Packaging Line', 'Packaging Department', '2020-12-01', 'Active', 'Bosch Packaging', 'SVE 2520 D', 'SN008901', '2024-07-25', '2024-10-25');

-- Insert Production Data (Last 30 days)
INSERT INTO Production (MachineID, Timestamp, Output_Quantity, Quality_Score, ProductType, BatchNumber, OperatorID, ShiftNumber, Temperature, Humidity, ProcessingTime, EnergyConsumption) VALUES
-- Day 1
('M001', '2024-08-01 08:00:00', 150, 96.5, 'Component A', 'BATCH-001', 'OP001', 1, 22.5, 45.2, 480, 25.3),
('M002', '2024-08-01 09:30:00', 200, 94.2, 'Assembly Unit', 'BATCH-002', 'OP002', 1, 23.1, 47.8, 420, 35.7),
('M003', '2024-08-01 11:00:00', 75, 98.7, 'QC Sample', 'BATCH-003', 'OP003', 1, 21.8, 43.5, 180, 8.2),
('M004', '2024-08-01 14:00:00', 180, 97.1, 'Shaft Component', 'BATCH-004', 'OP004', 2, 24.2, 46.1, 360, 28.9),
('M006', '2024-08-01 16:30:00', 320, 95.8, 'Plastic Housing', 'BATCH-005', 'OP005', 2, 25.0, 48.3, 300, 42.1),

-- Day 2
('M002', '2024-08-02 08:15:00', 220, 93.4, 'Assembly Unit', 'BATCH-006', 'OP002', 1, 22.8, 44.9, 450, 38.2),
('M007', '2024-08-02 10:45:00', 95, 96.9, 'Welded Frame', 'BATCH-007', 'OP006', 1, 26.3, 42.1, 240, 31.5),
('M003', '2024-08-02 13:20:00', 85, 99.2, 'QC Sample', 'BATCH-008', 'OP003', 2, 21.5, 41.8, 160, 7.8),
('M004', '2024-08-02 15:50:00', 165, 97.6, 'Shaft Component', 'BATCH-009', 'OP007', 2, 23.7, 45.6, 380, 26.4),
('M008', '2024-08-02 17:30:00', 450, 92.3, 'Packaged Product', 'BATCH-010', 'OP008', 2, 24.1, 50.2, 120, 18.7),

-- Continue with more realistic production data...
('M001', '2024-08-03 07:45:00', 175, 95.3, 'Component A', 'BATCH-011', 'OP001', 1, 22.2, 46.3, 490, 27.1),
('M006', '2024-08-03 09:20:00', 340, 96.7, 'Plastic Housing', 'BATCH-012', 'OP005', 1, 24.8, 47.9, 310, 44.3),
('M007', '2024-08-03 11:35:00', 88, 98.1, 'Welded Frame', 'BATCH-013', 'OP006', 1, 25.9, 43.7, 250, 29.8),
('M002', '2024-08-03 14:10:00', 210, 94.8, 'Assembly Unit', 'BATCH-014', 'OP009', 2, 23.4, 46.8, 430, 36.9),
('M004', '2024-08-03 16:25:00', 190, 96.2, 'Shaft Component', 'BATCH-015', 'OP004', 2, 24.0, 44.5, 370, 30.2),

-- Add more recent data (last week)
('M001', '2024-08-20 08:30:00', 160, 97.8, 'Component A', 'BATCH-086', 'OP001', 1, 21.9, 45.1, 470, 26.8),
('M003', '2024-08-20 10:15:00', 82, 99.5, 'QC Sample', 'BATCH-087', 'OP003', 1, 21.2, 42.3, 170, 8.1),
('M006', '2024-08-20 12:40:00', 365, 95.1, 'Plastic Housing', 'BATCH-088', 'OP010', 1, 25.2, 49.1, 295, 46.2),
('M007', '2024-08-20 15:05:00', 92, 97.3, 'Welded Frame', 'BATCH-089', 'OP006', 2, 26.1, 41.9, 245, 32.1),
('M008', '2024-08-20 17:20:00', 470, 93.7, 'Packaged Product', 'BATCH-090', 'OP008', 2, 23.8, 51.2, 115, 19.3);

-- Insert Quality Control Data
INSERT INTO QualityControl (ProductionID, InspectorID, InspectionDate, DefectCount, DefectType, InspectionResult, Notes) VALUES
(1, 'INS001', '2024-08-01 09:00:00', 0, NULL, 'Pass', 'Excellent quality, no issues detected'),
(2, 'INS002', '2024-08-01 10:30:00', 2, 'Minor surface scratches', 'Pass', 'Within acceptable tolerance'),
(3, 'INS001', '2024-08-01 12:00:00', 0, NULL, 'Pass', 'Perfect quality control sample'),
(4, 'INS003', '2024-08-01 15:00:00', 1, 'Dimensional variance', 'Pass', 'Slight variance but within specs'),
(5, 'INS002', '2024-08-01 17:30:00', 3, 'Color inconsistency', 'Conditional', 'Requires secondary inspection'),
(6, 'INS002', '2024-08-02 09:15:00', 4, 'Assembly alignment', 'Fail', 'Requires rework'),
(7, 'INS003', '2024-08-02 11:45:00', 0, NULL, 'Pass', 'Welding quality excellent'),
(8, 'INS001', '2024-08-02 14:20:00', 0, NULL, 'Pass', 'QC standards met'),
(9, 'INS003', '2024-08-02 16:50:00', 1, 'Tool marks', 'Pass', 'Minor tool marks, acceptable'),
(10, 'INS002', '2024-08-02 18:30:00', 8, 'Packaging defects', 'Fail', 'Multiple packaging issues detected');

-- Create indexes for better performance
CREATE INDEX idx_production_machine ON Production(MachineID);
CREATE INDEX idx_production_timestamp ON Production(Timestamp);
CREATE INDEX idx_production_quality ON Production(Quality_Score);
CREATE INDEX idx_qc_production ON QualityControl(ProductionID);

-- Create a view for easy reporting
CREATE VIEW ProductionSummary AS
SELECT 
    p.ProductionID,
    p.MachineID,
    m.Type as MachineType,
    m.Location,
    p.Timestamp,
    p.Output_Quantity,
    p.Quality_Score,
    p.ProductType,
    p.OperatorID,
    qc.InspectionResult,
    qc.DefectCount
FROM Production p
JOIN Machine m ON p.MachineID = m.MachineID
LEFT JOIN QualityControl qc ON p.ProductionID = qc.ProductionID;

-- Grant permissions to R2RML user
GRANT SELECT ON manufacturing.* TO 'r2rml_user'@'%';
FLUSH PRIVILEGES;

-- Display setup completion message
SELECT 'Manufacturing database setup completed successfully!' as Status;
