-------------------------------------------------------------------------------
-- Create Database																												  	|
-------------------------------------------------------------------------------
-- main database : dataviz db -> DV
create database DV on (NAME = DV_data, FILENAME = 'C:\DB\MSSQL\DV_data.mdf', SIZE = 10, FILEGROWTH = 5) LOG on (NAME = DV_log, FILENAME = 'C:\DB\MSSQL\DV_log.ldf', SIZE = 10, FILEGROWTH = 5
  )
go

-- save member's raw data db -> RawDB
create database RawDB on (NAME = RawDB_data, FILENAME = 'C:\DB\MSSQL\RawDB_data.mdf', SIZE = 10, FILEGROWTH = 5) LOG on (NAME = RawDB_log, FILENAME = 'C:\DB\MSSQL\RawDB_log.ldf', SIZE = 10, FILEGROWTH = 5
  )
go

-------------------------------------------------------------------------------
-- Create Account																												    	|
-------------------------------------------------------------------------------
use DV
go

-- add dataviz admin login and add role db_owner
-- notice!! : add login don't need to select DB, because it's global, but add user need to select DB, it's for alter user of DB
declare @uid varchar(20), @pwd varchar(20), @db varchar(20)

select @uid = 'dataviz', @pwd = '.dataviz.', @db = 'DV'

if not exists (
    select *
    from master.dbo.syslogins
    where name = @uid
    )
begin
  exec sp_addlogin @uid, @pwd, @db
end
else
  print 'the user was already existed'

exec sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = 'db_owner'
go

use RawDB
go

-- add role db_owner to admin
declare @uid varchar(20), @grpname varchar(20)

select @uid = 'dataviz', @grpname = 'db_owner'

exec sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname
go

-------------------------------------------------------------------------------
-- Create apiw																													    	|
-------------------------------------------------------------------------------
use DV
go

-- add api writer login and add user to RawMD
declare @uid varchar(20), @pwd varchar(20), @db varchar(20), @grpname varchar(20)

select @uid = 'apiw', @pwd = '.apiw.', @db = 'DV', @grpname = 'db_owner'

if not exists (
    select *
    from master.dbo.syslogins
    where name = @uid
    )
begin
  exec sp_addlogin @uid, @pwd, @db
end
else
  print 'the user was already existed'

exec sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname;
go

use RawDB
go

-- add role db_owner to api writer
declare @uid varchar(20), @grpname varchar(20)

select @uid = 'apiw', @grpname = 'db_owner'

exec sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname
go

-------------------------------------------------------------------------------
-- Create apir																													    	|
-------------------------------------------------------------------------------
use DV
go

-- add api reader login and add user to RawMD
declare @uid varchar(20), @pwd varchar(20), @db varchar(20), @grpname varchar(20)

select @uid = 'apir', @pwd = '.apir.', @db = 'DV', @grpname = 'db_datareader'

if not exists (
    select *
    from master.dbo.syslogins
    where name = @uid
    )
begin
  exec sp_addlogin @uid, @pwd, @db
end
else
  print 'the user was already existed'

exec sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname;
go

use RawDB
go

-- add role db_datareader to api reader
declare @uid varchar(20), @grpname varchar(20)

select @uid = 'apir', @grpname = 'db_datareader'

exec sp_adduser @loginame = @uid, @name_in_db = @uid, @grpname = @grpname
go

-------------------------------------------------------------------------------
-- Alter rule											      																    	|
-------------------------------------------------------------------------------
alter role db_owner add member dataviz

-------------------------------------------------------------------------------
-- Connect user to login													                    				|
-------------------------------------------------------------------------------
use DV
go

alter user apir
  with login = apir;

alter user apiw
  with login = apiw;

alter user dataviz
  with login = dataviz;
go

use RawDB
go

alter user apir
  with login = apir;

alter user apiw
  with login = apiw;
