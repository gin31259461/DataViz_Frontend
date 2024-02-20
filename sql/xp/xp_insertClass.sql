use [DV]
go

/****** Object:  StoredProcedure [dbo].[xp_insertClass]    Script Date: 2023/11/21 下午 10:19:59 ******/
set ansi_nulls on
go

set quoted_identifier off
go

create or

alter procedure [dbo].[xp_insertClass] @PCID int,
  --c.CID，父節點
  @Type int,
  --c.Type
  @CName nvarchar(400),
  --c.CName
  @EName nvarchar(400),
  --c.EName
  @CCID int output
  --c.CID,新產生的節點，回傳
as
begin
  set xact_abort on

  --指定當 Transact-SQL 陳述式產生執行階段錯誤時，SQL Server 是否自動回復目前的交易
  begin try
    begin transaction --下面的過程設定為一整筆交易動作

    declare @NamePath nvarchar(900) = (
        select [dbo].[fn_getNamePath](@PCID, @CName)
        )

    if (
        (
          select count(*)
          from Class
          where NamePath = @NamePath
          ) = 0
        )
    begin
      declare @CID int
      declare @nlevel int

      insert into Class (CName, [Type], EName)
      values (@CName, @Type, @EName)

      set @CID = @@Identity

      if @PCID is not null
        insert into Inheritance (PCID, CCID)
        values (@PCID, @CID)

      -- 利用GetCID 取得Parent的CID
      insert into Permission (CID, RoleType, RoleID, PermissionBits)
      values (@CID, 0, 0, 63)

      insert into Permission (CID, RoleType, RoleID, PermissionBits)
      values (@CID, 1, 1, 3)

      insert into Permission (CID, RoleType, RoleID, PermissionBits)
      values (@CID, 0, 1, 3)

      insert into Permission (CID, RoleType, RoleID, PermissionBits)
      values (@CID, 0, 2, 3)

      update Class
      set nLevel = dbo.fn_getLevel(@PCID)
      where CID = @CID

      select @nlevel = nlevel
      from Class
      where CID = @CID

      if (@nlevel = 1)
      begin
        update Class
        set NamePath = @CName, IDPath = @CID
        where CID = @CID
      end
      else
      begin
        update Class
        set NamePath = dbo.fn_getNamePath(@PCID, @CName), IDPath = dbo.fn_getIDPath(@PCID, @CID)
        where CID = @CID
      end

      --設定回傳值
      set @CCID = @CID
    end
    else
    begin
      set @CCID = null
    end

    commit transaction
  end try

  begin catch
    if XACT_STATE() <> 0
    begin
      rollback transaction
    end

    select ERROR_NUMBER() as ErrorNumber, ERROR_MESSAGE() as ErrorMessage
  end catch

  set xact_abort off
end
