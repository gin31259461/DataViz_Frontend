select * from Member
select * from Account
select * from Object
select * from Data
select * from MSession
select * from Class


declare @id int = 759
delete from Data where DID in (select OID from Object where OwnerMID = @id)
delete from ORel where OID2 in (select OID from Object where OwnerMID = @id)
delete from CO where OID in (select OID from Object where OwnerMID = @id)
delete from Object where OID in (select OID from Object where OwnerMID = @id)
delete from Object where OID = @id

delete from Inheritance where CCID = 138 or PCID = 138
delete from Class where CID = 138


delete from Inheritance where PCID in (select CID from Class where CID = @cid) or CCID in (select CID from Class where CID = @cid)
delete from CO where CID in (select CID from Class where CID = @cid)
delete from Class where CID = @cid

declare @cid int = 338
delete from Inheritance where PCID in (select CID from Class where CID >= @cid) or CCID in (select CID from Class where CID >= @cid)
delete from CO where CID in (select CID from Class where CID >= @cid)
delete from Class where CID >= @cid