USE [DV]
GO

CREATE
  OR

-- MID: prooject creator
-- EName: projecct title
-- EDes: projecct description
-- CCID: current added project id -> output
ALTER PROCEDURE xp_insertObservationClass @ProjectCID INT, @EName NVARCHAR(255), @EDes
  NVARCHAR(800), @CCID INT OUTPUT
AS
BEGIN
  DECLARE @guid UNIQUEIDENTIFIER, @CName VARCHAR(255)

  SELECT @guid = NEWID()

  SELECT @CName = CONVERT(VARCHAR(255), @guid)

  EXEC [dbo].[xp_insertClass] @ProjectCID, 8, @CName, @EName, @CCID OUTPUT

  UPDATE Class
  SET EDes = @EDes
  WHERE CID = @CCID
END
GO


