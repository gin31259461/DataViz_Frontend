SELECT *
FROM OBJECT

SELECT *
FROM Account

SELECT *
FROM Member

SELECT *
FROM Class

SELECT *
FROM CO

DELETE
FROM Member
WHERE MID >= 536

DELETE
FROM OBJECT
WHERE OID >= 536

SELECT *
FROM Inheritance

EXEC xp_insertMemberClass 297


EXEC xp_insertProjectClass 297, 'title', 'desccripttion', @CCID OUTPUT

DECLARE @CCID INT
EXEC xp_insertObservationClass 140, 'title', 'desccripttion', @CCID OUTPUT

SELECT *
FROM vd_project_qw0207060413

-- delete member
DECLARE @ID INT

SET @ID = 557

DELETE
FROM [Object]
WHERE OID = @ID

DELETE
FROM [Member]
WHERE MID = @ID

DELETE
FROM [Account]
WHERE MID = @ID

EXEC xp_deleteClass 140

EXEC xp_deleteClass 141

EXEC xp_deleteClass 142

EXEC xp_deleteClass 143

EXEC [dbo].[xp_deleteObject] 103
