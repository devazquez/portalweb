-- Initialize Omeka-S database with mysql_native_password auth method
-- This script ensures the omeka user is properly created with native password auth

-- Drop any existing omeka users first to ensure clean state
DROP USER IF EXISTS 'omeka'@'localhost';
DROP USER IF EXISTS 'omeka'@'172.20.0.%';
DROP USER IF EXISTS 'omeka'@'172.17.0.%';
DROP USER IF EXISTS 'omeka'@'%';

-- Create omeka user for multiple host patterns with explicit mysql_native_password
-- Password matches Omeka's database.ini config: password = "omeka"
CREATE USER 'omeka'@'localhost' IDENTIFIED WITH mysql_native_password BY 'omeka';
CREATE USER 'omeka'@'172.20.0.%' IDENTIFIED WITH mysql_native_password BY 'omeka';
CREATE USER 'omeka'@'172.17.0.%' IDENTIFIED WITH mysql_native_password BY 'omeka';
CREATE USER 'omeka'@'%' IDENTIFIED WITH mysql_native_password BY 'omeka';

-- Grant all privileges to omeka user for all hosts
GRANT ALL PRIVILEGES ON omeka.* TO 'omeka'@'localhost';
GRANT ALL PRIVILEGES ON omeka.* TO 'omeka'@'172.20.0.%';
GRANT ALL PRIVILEGES ON omeka.* TO 'omeka'@'172.17.0.%';
GRANT ALL PRIVILEGES ON omeka.* TO 'omeka'@'%';
FLUSH PRIVILEGES;

-- Verify user creation
SELECT user, host, plugin FROM mysql.user WHERE user='omeka' ORDER BY host;
