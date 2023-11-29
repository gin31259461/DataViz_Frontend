-------------------------------------------------------------------------------
-- Connect user to login													                    				|
-------------------------------------------------------------------------------
use DV
go

alter user apir with login = apir;
alter user apiw with login = apiw;
alter user dataviz with login = dataviz;
go

use RawDB
go

alter user apir with login = apir;
alter user apiw with login = apiw;