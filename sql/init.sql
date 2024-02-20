USE [DV]
GO

SET IDENTITY_INSERT Entity ON

INSERT INTO Entity (EID, CName, EName, bORel)
VALUES (1, 'WEB資源', 'URL', 1),
(2, '會員', 'Member', 1),
(3, '檔案', 'Archive', 1),
(4, '公告', 'Announce', 1),
(5, '貼文', 'Post', 1),
(6, '資料', 'Data', 1),
(7, '引數', 'Arg', 1),
(8, '專案', 'Project', 1)

UPDATE Class
SET CName = 'member', NamePath = 'member'
WHERE CName = '會員'
  OR NamePath = '會員'

SET IDENTITY_INSERT Entity OFF

set identity_insert Class on

insert into Class(CID, Type, CName, EName, IDPath, NamePath, nLevel)
values (0, 1, 'member', 'Member', 0, 'member', 1)

set identity_insert Class off
