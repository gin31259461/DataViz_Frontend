USE [DV]
GO

-------------------------------------------------------------------------------
-- SP post data          													               							|
-------------------------------------------------------------------------------
CREATE
  OR

ALTER PROCEDURE [dbo].[xp_postData] @mid INT,
  @name NVARCHAR(800),
  @des NVARCHAR(MAX),
  @lastID NVARCHAR(MAX) OUTPUT
AS
BEGIN
  SET XACT_ABORT ON

  BEGIN TRY
    BEGIN TRANSACTION

    DECLARE @insertedRows TABLE (id INT);

    INSERT INTO OBJECT (
      TYPE,
      CName,
      CDes,
      nClick,
      OwnerMID
      )
    OUTPUT inserted.OID
    INTO @insertedRows
    VALUES (
      6,
      @Name,
      @Des,
      1,
      @MID
      )

    SELECT @lastID = id
    FROM @insertedRows;

    INSERT INTO dbo.Data (DID)
    VALUES (@lastID)

    COMMIT TRANSACTION
  END TRY

  BEGIN CATCH
    IF XACT_STATE() <> 0
    BEGIN
      ROLLBACK TRANSACTION
    END

    SELECT ERROR_NUMBER() AS ErrorNumber,
      ERROR_MESSAGE() AS ErrorMessage
  END CATCH

  SET XACT_ABORT OFF
END
