use [DV]
go

create or

-- MID: prooject creator
-- EName: projecct title
-- EDes: projecct description
-- CCID: current added project id -> output
alter procedure xp_insertObservationClass @ProjectCID int, @EName nvarchar(255), @EDes nvarchar(800), @CCID int output
as
begin
  declare @guid uniqueidentifier, @CName varchar(255), @currentCRank tinyint

  select @guid = NEWID()

  select @CName = CONVERT(varchar(255), @guid)

  exec [dbo].[xp_insertClass] @ProjectCID, 8, @CName, @EName, @CCID output

  select top 1 @currentCRank = cRank
  from Class
  where CID = @ProjectCID

  update Class
  set EDes = @EDes, cRank = @currentCRank + 1
  where CID = @CCID
end
go


