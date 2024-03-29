use [DV]
go

/****** Object:  UserDefinedFunction [dbo].[fn_getLevel]    Script Date: 2024/2/18 下午 01:50:13 ******/
set ansi_nulls on
go

set quoted_identifier off
go

create or

alter function [dbo].[fn_getLevel] (@CID int)
returns int
as
begin
  return (
      select nLevel
      from Class
      where CID = @CID
      ) + 1
end
