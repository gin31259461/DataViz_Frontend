SELECT
  O.OID AS id,
  O.CName AS name,
  O.CDes AS description,
  O.OwnerMID AS ownerID,
  CONVERT(VARCHAR, O.Since, 20) AS since,
  CONVERT(VARCHAR, O.LastModifiedDT, 20) AS lastModified,
  O.nClick AS frequency
FROM
  OBJECT AS O
WHERE
  TYPE = 6