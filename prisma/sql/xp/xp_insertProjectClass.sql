USE [DV]
GO

CREATE
  OR

-- MID: prooject creator
-- EName: projecct title
-- EDes: projecct description
ALTER PROCEDURE xp_insertProjectClass @mid INT, @EName NVARCHAR(255), @EDes NVARCHAR(800
  )
AS
BEGIN
  DECLARE @ProjectClassID INT, @CCID INT

  SELECT @ProjectClassID = [dbo].[fn_getProjectClassID](@mid)

  DECLARE @guid UNIQUEIDENTIFIER, @CName VARCHAR(255)

  SELECT @guid = NEWID()

  SELECT @CName = CONVERT(VARCHAR(255), @guid)

  EXEC [dbo].[xp_insertClass] @ProjectClassID, 8, @CName, @EName, @CCID OUTPUT

  UPDATE Class
  SET EDes = @EDes
  WHERE CID = @CCID

  SELECT @guid = NEWID()

  SELECT @CName = CONVERT(VARCHAR(255), @guid)

  EXEC [dbo].[xp_insertClass] @CCID, 8, @CName, @EName, @CCID OUTPUT

  UPDATE Class
  SET EDes = @EDes, cRank = 0
  WHERE CID = @CCID
END
GO


