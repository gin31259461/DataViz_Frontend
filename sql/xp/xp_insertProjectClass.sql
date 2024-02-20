use [DV]
go

create or

-- MID: project creator
-- EName: project title
-- EDes: project description
-- CDes: project type
alter procedure xp_insertProjectClass @mid int, @EName nvarchar(255), @EDes nvarchar(800), @CDes nvarchar(100)
as
begin
  declare @ProjectClassID int, @CCID int

  select @ProjectClassID = [dbo].[fn_getProjectClassID](@mid)

  declare @guid uniqueidentifier, @CName varchar(255)

  select @guid = NEWID()

  select @CName = CONVERT(varchar(255), @guid)

  exec [dbo].[xp_insertClass] @ProjectClassID, 8, @CName, @EName, @CCID output

  update Class
  set EDes = @EDes, CDes = @CDes
  where CID = @CCID

  select @guid = NEWID()

  select @CName = CONVERT(varchar(255), @guid)

  exec [dbo].[xp_insertClass] @CCID, 8, @CName, @EName, @CCID output

  update Class
  set cRank = 0
  where CID = @CCID
end
go


