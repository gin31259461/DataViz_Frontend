USE [DV]
GO

DECLARE @CCID INT

EXEC [dbo].[xp_insertClass] 1,
  1,
  '會員',
  'Member',
  @CCID
GO

set identity_insert Entity on

insert into Entity(EID, CName, EName, bORel)
values(6, '資料', 'Data', 1)

insert into Entity(EID, CName, EName, bORel)
values(7, '引數', 'Arg', 1)

set identity_insert Entity off


