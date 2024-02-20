/*
This procedure is used to create a new member's space for the specified member.
Included member's class and member's project class.
*/
use [DV]
go

create or

alter procedure xp_insertMemberClass @MID int
  -- 新創建會員的 ID
as
begin
  declare @Member int

  select @Member = CID
  from Class
  where nLevel = 1 and Class.EName = 'Member'

  declare @Account nvarchar(255), @CName nvarchar(255)

  select @Account = Account
  from [dbo].[Member]
  where MID = @MID

  declare @CCID int

  -- insert member's class
  exec xp_insertClass @Member, 1, @Account, 'Member', @CCID output

  update Member
  set CID = @CCID
  where MID = @MID

  -- insert project class to member's class
  exec xp_insertClass @CCID, 8, 'project', 'Project', @CCID output

  exec xp_createMemberProjectView @mid
end
