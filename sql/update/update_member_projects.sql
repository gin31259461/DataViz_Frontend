select *
from Member

declare @account nvarchar(200) = 'qw0207060413'

select *
from Class
where NamePath like 'member/' + @account + '/project/%'
go

declare @account nvarchar(200) = 'qw0207060413'

update Class
set CDes = 'racing-chart'
where NamePath like 'member/' + @account + '/project/%'
