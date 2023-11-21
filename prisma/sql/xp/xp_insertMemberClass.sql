USE [DV]
GO

CREATE
  OR

ALTER PROCEDURE xp_insertMemberClass @MID INT
  -- 新創建會員的 ID
AS
BEGIN
  DECLARE @MemberClassID INT

  SELECT @MemberClassID = CID
  FROM Class,
    Inheritance
  WHERE PCID = 1
    AND Class.EName = 'Member'

  DECLARE @CName NVARCHAR(400),
    @EName NVARCHAR(400)

  SELECT @CName = CName,
    @EName = EName
  FROM [dbo].[Object]
  WHERE OID = @MID

  SET @CName = @CName + CAST(@MID AS NVARCHAR(2000))

  DECLARE @CCID INT,
    @MemberIDPath NVARCHAR(255),
    @MemberNamePath NVARCHAR(800)

  -- insert member's class
  EXEC xp_insertClass @MemberClassID,
    1,
    @CName,
    @EName,
    @CCID OUTPUT

  UPDATE Member
  SET CID = @CCID
  WHERE MID = @MID

  SELECT @MemberIDPath = IDPath,
    @MemberNamePath = NamePath
  FROM Class
  WHERE CID = @CCID

  -- insert project class to member's class
  EXEC xp_insertClass @CCID,
    1,
    '專案',
    'Project',
    @CCID OUTPUT

  UPDATE Class
  SET IDPath = @MemberIDPath + '/' + IDPath,
    NamePath = @MemberNamePath + '/' + NamePath
  WHERE CID = @CCID
END