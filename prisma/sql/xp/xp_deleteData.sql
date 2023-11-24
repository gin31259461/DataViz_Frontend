USE [DV]
GO

-------------------------------------------------------------------------------
-- SP delete data       													               							|
-------------------------------------------------------------------------------
CREATE
  OR

ALTER PROCEDURE [dbo].[xp_deleteData] @mid INT, @oid INT
AS
BEGIN
  IF EXISTS (
      SELECT *
      FROM dbo.OBJECT
      WHERE OID = @oid
        AND Type = 6
      )
  BEGIN
    DELETE
    FROM Data
    WHERE DID = @oid

    DELETE
    FROM OBJECT
    WHERE OID = @oid
      AND OwnerMID = @mid

    DECLARE @sql NVARCHAR(max) = '
		  DROP TABLE RawDB.dbo.D' + cast(@oid AS NVARCHAR(
          max))
  END

  EXEC sp_executesql @sql
END
