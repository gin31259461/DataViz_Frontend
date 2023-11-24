USE [DV]
GO

CREATE
  OR

ALTER PROCEDURE xp_createMemberProjectView @mid INT
AS
BEGIN
  DECLARE @account NVARCHAR(64), @sql NVARCHAR(2000)

  SELECT @account = (
      SELECT Account
      FROM [dbo].[Member]
      WHERE MID = @mid
      )

  PRINT (@account)

  SELECT @sql = '
    CREATE OR ALTER VIEW vd_project_' + @account +
    '
    AS
    SELECT C.*
    FROM [dbo].[Inheritance] I, [dbo].[Class] C
    WHERE I.PCID = (
        SELECT CID
        FROM [dbo].[Class]
        WHERE NamePath = ''member/'
    + @account + '/project''
        )
      AND C.CID = I.CCID
  '

  EXEC sp_executesql @sql
END
GO


