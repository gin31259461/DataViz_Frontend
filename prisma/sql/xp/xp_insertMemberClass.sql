USE [DV]
GO

CREATE
  OR

ALTER PROCEDURE xp_insertMemberClass
  @MID INT
-- 新創建會員的 ID
AS
BEGIN
  DECLARE @Member INT

  SELECT @Member = CID
  FROM Class
  WHERE nLevel = 1 AND Class.EName = 'Member'

  DECLARE @Account NVARCHAR(255), @CName NVARCHAR(255)

  SELECT @Account = Account
  FROM [dbo].[Member]
  WHERE MID = @MID

  DECLARE @CCID INT

  -- insert member's class
  EXEC xp_insertClass @Member,
    1,
    @Account,
    'Member',
    @CCID OUTPUT

  UPDATE Member
  SET CID = @CCID
  WHERE MID = @MID

  -- insert project class to member's class
  EXEC xp_insertClass @CCID,
    8,
    '專案',
    'Project',
    @CCID OUTPUT
END
