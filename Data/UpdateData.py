import psycopg2
import ConnectionString

conn = psycopg2.connect(ConnectionString.connection_string)

cur = conn.cursor()
query = "SELECT * FROM datossemanales order by SPLIT_PART(fecha, '/', 3), CAST(SPLIT_PART(fecha, '/', 2) AS INTEGER), CAST(SPLIT_PART(fecha, '/', 1) AS INTEGER)"
cur.execute(query)
row = cur.fetchone()
while row != None:
    print(row)
    row = cur.fetchone()
cur.close()
conn.close()

