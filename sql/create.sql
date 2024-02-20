-------------------------------------------------------------------------------
-- Create Database																												  	|
-------------------------------------------------------------------------------
-- main database : dataviz db -> DV
CREATE DATABASE DV ON (NAME = DV_data, FILENAME = 'C:\DB\MSSQL\DV_data.mdf', SIZE = 10, FILEGROWTH = 5
	) LOG ON (NAME = DV_log, FILENAME = 'C:\DB\MSSQL\DV_log.ldf', SIZE = 10, FILEGROWTH = 5)
GO

-- save member's raw data db -> RawDB
CREATE DATABASE RawDB ON (NAME = RawDB_data, FILENAME = 'C:\DB\MSSQL\RawDB_data.mdf', SIZE = 10, FILEGROWTH = 5
	) LOG ON (NAME = RawDB_log, FILENAME = 'C:\DB\MSSQL\RawDB_log.ldf', SIZE = 10, FILEGROWTH = 5
	)
GO

-------------------------------------------------------------------------------
-- Create Account																												    	|
-------------------------------------------------------------------------------
USE DV
GO

-- add dataviz admin login and add role db_owner
-- notice!! : add login don't need to select DB, because it's global, but add user need to select DB, it's for alter user of DB
DECLARE @uid VARCHAR(20), @pwd VARCHAR(20), @db VARCHAR(20)

SELECT @uid = 'dataviz', @pwd = '.dataviz.', @db = 'DV'

IF NOT EXISTS (
		SELECT *
		FROM master.dbo.syslogins
		WHERE name = @uid
		)
BEGIN
	EXEC sp_addlogin @uid, @pwd, @db
END
ELSE
	PRINT 'the user was already existed'

EXEC sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = 'db_owner'
GO

USE RawDB
GO

-- add role db_owner to admin
DECLARE @uid VARCHAR(20), @grpname VARCHAR(20)

SELECT @uid = 'dataviz', @grpname = 'db_owner'

EXEC sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname
GO

-------------------------------------------------------------------------------
-- Create apiw																													    	|
-------------------------------------------------------------------------------
USE DV
GO

-- add api writer login and add user to RawMD
DECLARE @uid VARCHAR(20), @pwd VARCHAR(20), @db VARCHAR(20), @grpname VARCHAR(20)

SELECT @uid = 'apiw', @pwd = '.apiw.', @db = 'DV', @grpname = 'db_owner'

IF NOT EXISTS (
		SELECT *
		FROM master.dbo.syslogins
		WHERE name = @uid
		)
BEGIN
	EXEC sp_addlogin @uid, @pwd, @db
END
ELSE
	PRINT 'the user was already existed'

EXEC sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname;
GO

USE RawDB
GO

-- add role db_owner to api writer
DECLARE @uid VARCHAR(20), @grpname VARCHAR(20)

SELECT @uid = 'apiw', @grpname = 'db_owner'

EXEC sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname
GO

-------------------------------------------------------------------------------
-- Create apir																													    	|
-------------------------------------------------------------------------------
USE DV
GO

-- add api reader login and add user to RawMD
DECLARE @uid VARCHAR(20), @pwd VARCHAR(20), @db VARCHAR(20), @grpname VARCHAR(20)

SELECT @uid = 'apir', @pwd = '.apir.', @db = 'DV', @grpname = 'db_datareader'

IF NOT EXISTS (
		SELECT *
		FROM master.dbo.syslogins
		WHERE name = @uid
		)
BEGIN
	EXEC sp_addlogin @uid, @pwd, @db
END
ELSE
	PRINT 'the user was already existed'

EXEC sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname;
GO

USE RawDB
GO

-- add role db_datareader to api reader
DECLARE @uid VARCHAR(20), @grpname VARCHAR(20)

SELECT @uid = 'apir', @grpname = 'db_datareader'

EXEC sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname
GO

-------------------------------------------------------------------------------
-- Alter rule											      																    	|
-------------------------------------------------------------------------------
ALTER ROLE db_owner ADD member dataviz

-------------------------------------------------------------------------------
-- Connect user to login													                    				|
-------------------------------------------------------------------------------
USE DV
GO

ALTER user apir
	WITH LOGIN = apir;

ALTER user apiw
	WITH LOGIN = apiw;

ALTER user dataviz
	WITH LOGIN = dataviz;
GO

USE RawDB
GO

ALTER user apir
	WITH LOGIN = apir;

ALTER user apiw
	WITH LOGIN = apiw;
