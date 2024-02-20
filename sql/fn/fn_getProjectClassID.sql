use [DV]
go

create or

alter function [dbo].[fn_getProjectClassID] (@mid int)
returns int
as
begin
  declare @ProjectClassID int

  select @ProjectClassID = (
      select distinct I.CCID
      from [dbo].[Class] C, [dbo].[Inheritance] I
      where I.PCID = (
          select CID
          from [dbo].[Member]
          where MID = @mid
          ) and C.CName = 'project'
      )

  return @ProjectClassID
end
