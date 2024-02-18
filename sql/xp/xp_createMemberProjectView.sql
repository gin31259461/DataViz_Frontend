/*
This procedure is used to create a view for the specified member's project class.
*/
USE [DV]
GO

CREATE
  OR

ALTER PROCEDURE [dbo].[xp_createMemberProjectView] @mid INT
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

  EXEC sp_executesql @sql
END
GO


