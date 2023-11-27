USE [DV]
GO

CREATE
  OR

ALTER PROCEDURE xp_insertArgObject @CID INT, @CDes NVARCHAR(800), @EName NVARCHAR(255),
  @EDes NVARCHAR(800)
AS
BEGIN
  INSERT INTO [dbo].[Object] (CDes, EName, EDes, Type)
  VALUES (@CDes, @EName, @EDes, 7)

  DECLARE @CurrentObjectID INT, @rankCount INT

  SELECT @CurrentObjectID = @@IDENTITY

  SELECT @rankCount = count(*)
  FROM [dbo].[CO]
  WHERE CID = @CID

  -- step 3
  INSERT INTO [dbo].[CO] (CID, OID, Rank)
  VALUES (@CID, @CurrentObjectID, @rankCount + 1)
END
GO


