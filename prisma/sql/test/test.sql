SELECT *
FROM Object
SELECT * from Account
SELECT *
FROM Member
SELECT *
FROM Class

DELETE FROM Member WHERE MID >= 536
DELETE FROM Object WHERE OID >= 536
SELECT *
FROM Inheritance


EXEC xp_insertMemberClass 297


-- delete member
declare @ID int
set @ID = 557
delete from [Object] WHERE OID = @ID
delete from [Member] WHERE MID = @ID
DELETE from [Account] where MID = @ID

EXEC xp_deleteClass 107
EXEC xp_deleteClass 108
EXEC xp_deleteClass 109