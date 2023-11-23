USE [DV]
GO

DECLARE @CCID INT
EXEC [dbo].[xp_insertClass] 1, 1, '會員', 'Member', @CCID output
UPDATE Class SET nLevel = 1 WHERE CID = @CCID

SET IDENTITY_INSERT Entity ON

INSERT INTO Entity
  (EID, CName, EName, bORel)
VALUES(6, '資料', 'Data', 1)

INSERT INTO Entity
  (EID, CName, EName, bORel)
VALUES(7, '引數', 'Arg', 1)

INSERT INTO Entity
  (EID, CName, EName, bORel)
VALUES(8, '專案', 'Project', 1)

SET IDENTITY_INSERT Entity OFF


