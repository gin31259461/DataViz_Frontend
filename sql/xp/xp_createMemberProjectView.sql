-- This procedure is used to create a view for the specified member's project class.
use [DV]
go

create or

alter procedure [dbo].[xp_createMemberProjectView] @mid int
as
begin
  declare @account nvarchar(64), @sql nvarchar(2000)

  select @account = (
      select Account
      from [dbo].[Member]
      where MID = @mid
      )

  print (@account)

  select @sql = '
    CREATE OR ALTER VIEW dbo.vd_project_' + @account +
    '
    AS
    SELECT
      C.CID as id,
      C.EName as title,
      C.EDes as des,
      C.IDPath as path,
      C.Since as since,
      C.LastModifiedDT as lastModifiedDT,
	  C.CDes as type
    FROM [dbo].[Inheritance] I, [dbo].[Class] C
    WHERE I.PCID = (
        SELECT CID
        FROM [dbo].[Class]
        WHERE NamePath = ''member/'
    + @account + '/project''
        )
      AND C.CID = I.CCID
  '

  exec sp_executesql @sql
end
go


