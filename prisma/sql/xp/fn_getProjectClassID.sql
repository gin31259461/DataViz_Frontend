CREATE
  OR

ALTER FUNCTION fn_getProjectClassID (@mid INT)
RETURNS INT
AS
BEGIN
  DECLARE @ProjectClassID INT

  SELECT @ProjectClassID = (
      SELECT DISTINCT I.CCID
      FROM [dbo].[Class] C, [dbo].[Inheritance] I
      WHERE I.PCID = (
          SELECT CID
          FROM [dbo].[Member]
          WHERE MID = @mid
          )
        AND C.CName = 'project'
      )

  RETURN @ProjectClassID
END
