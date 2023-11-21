USE [DV]
GO

DECLARE @CCID INT

EXEC [dbo].[xp_insertClass] 1,
  1,
  '會員',
  'Member',
  @CCID
GO


