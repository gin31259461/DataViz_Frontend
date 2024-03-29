use [DV]
go

set ansi_nulls on
go

set quoted_identifier off
go

--取得IDPath資料
create or

alter function [dbo].[fn_getIDPath] (@PCID int, @CID int)
returns varchar(255)
as
begin
  declare @nLevel int = (
      select nLevel
      from Class
      where CID = @PCID
      )
  declare @IDPath nvarchar(900)

  if (@nLevel is null)
    set @IDPath = convert(nvarchar(max), @CID)
  else
    set @IDPath = (
        select IDPath + '/' + convert(nvarchar(max), @CID)
        from Class
        where CID = @PCID
        )

  return @IDPath
end
