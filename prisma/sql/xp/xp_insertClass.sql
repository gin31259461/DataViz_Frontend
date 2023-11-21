USE [DV]
GO

/****** Object:  StoredProcedure [dbo].[xp_insertClass]    Script Date: 2023/11/21 下午 10:19:59 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER OFF
GO

ALTER PROCEDURE [dbo].[xp_insertClass] @PCID INT,
	--c.CID，父節點
	@Type INT,
	--c.Type
	@CName NVARCHAR(400),
	--c.CName
	@EName NVARCHAR(400),
	--c.EName
	@CCID INT OUTPUT
	--c.CID,新產生的節點，回傳
AS
BEGIN
	SET XACT_ABORT ON

	--指定當 Transact-SQL 陳述式產生執行階段錯誤時，SQL Server 是否自動回復目前的交易
	BEGIN TRY
		BEGIN TRANSACTION --下面的過程設定為一整筆交易動作

		DECLARE @NamePath NVARCHAR(900) = (
				SELECT dbo.fn_getNamePath(@PCID, @CName)
				)

		IF (
				(
					SELECT count(*)
					FROM Class
					WHERE NamePath = @NamePath
					) = 0
				)
		BEGIN
			DECLARE @CID INT
			DECLARE @nlevel INT

			INSERT INTO Class (
				CName,
				[Type],
				EName
				)
			VALUES (
				@CName,
				@Type,
				@EName
				)

			SET @CID = @@Identity

			IF @PCID IS NOT NULL
				INSERT INTO Inheritance (
					PCID,
					CCID
					)
				VALUES (
					@PCID,
					@CID
					)

			-- 利用GetCID 取得Parent的CID
			INSERT INTO Permission (
				CID,
				RoleType,
				RoleID,
				PermissionBits
				)
			VALUES (
				@CID,
				0,
				0,
				63
				)

			INSERT INTO Permission (
				CID,
				RoleType,
				RoleID,
				PermissionBits
				)
			VALUES (
				@CID,
				1,
				1,
				3
				)

			INSERT INTO Permission (
				CID,
				RoleType,
				RoleID,
				PermissionBits
				)
			VALUES (
				@CID,
				0,
				1,
				3
				)

			INSERT INTO Permission (
				CID,
				RoleType,
				RoleID,
				PermissionBits
				)
			VALUES (
				@CID,
				0,
				2,
				3
				)

			UPDATE Class
			SET nLevel = dbo.fn_getLevel(@PCID)
			WHERE CID = @CID

			SELECT @nlevel = nlevel
			FROM Class
			WHERE CID = @CID

			IF (@nlevel = 1)
			BEGIN
				UPDATE Class
				SET NamePath = @CName,
					IDPath = @CID
				WHERE CID = @CID
			END
			ELSE
			BEGIN
				UPDATE Class
				SET NamePath = dbo.fn_getNamePath(@PCID, @CName),
					IDPath = dbo.fn_getIDPath(@PCID, @CID)
				WHERE CID = @CID
			END

			--設定回傳值
			SET @CCID = @CID
		END
		ELSE
		BEGIN
			SET @CCID = NULL
		END

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
