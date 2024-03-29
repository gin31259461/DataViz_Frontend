use [DV]
go

set ansi_nulls on
go

set quoted_identifier off
go

--取得NamePath資料
create or

alter function [dbo].[fn_getNamePath] (@PCID int, @CName nvarchar(255))
returns nvarchar(900)
as
begin
  declare @nLevel int = (
      select nLevel
      from Class
      where CID = @PCID
      )
  declare @NamePath nvarchar(900)

  if (@nLevel is null)
    select @NamePath = @CName, @nLevel = 0
  else
    set @NamePath = (
        select NamePath + '/' + @CName
        from Class
        where CID = @PCID
        )

  return @NamePath
end
