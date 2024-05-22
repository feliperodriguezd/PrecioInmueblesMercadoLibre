import psycopg2
import openpyxl
import os

import ConnectionString

def OpenExcel():
    try:
        excel = openpyxl.load_workbook(GetRelativePath('Datos.xlsx'))
    except:
        print("Error al abrir el excel")
    return excel

def EditCell(sheet, cell, data):
    sheet[cell] = data

def Edit(sheet, data):
    cells = ['A', 'B', 'C']
    for numbre in range(0, len(data)):
        row = numbre + 2
        for num in range(0, 3):
            cell = cells[num] + str(row)
            specificData = cells[num] + str(row)
            EditCell(sheet, cell, specificData)

def OpenAndEdit(data):
    excel = OpenExcel()
    sheet = excel.active     
    try:
        Edit(sheet, data)
        excel.save(GetRelativePath('Datos.xlsx')) 
    except Exception as ex:
        print(f"Error: {ex}")

def EndConnection(cur, connection):
    cur.close()
    connection.close()

def GetNextLine(cur):
    return cur.fetchone()

def GetData():
    data = []
    connection = psycopg2.connect(ConnectionString.connection_string)
    cur = connection.cursor()
    query = "SELECT * FROM datossemanales order by SPLIT_PART(fecha, '/', 3), CAST(SPLIT_PART(fecha, '/', 2) AS INTEGER), CAST(SPLIT_PART(fecha, '/', 1) AS INTEGER)"
    cur.execute(query)
    row = GetNextLine(cur)
    while row != None:
        rowData = []
        rowData.append(row[0])
        rowData.append(row[1])
        rowData.append(int(row[2]))
        data.append(rowData)
        row = GetNextLine(cur)
    EndConnection(cur, connection)
    return data

def GetRelativePath(relativePath):
    absolutePath = os.path.dirname(__file__)
    fullPath = os.path.join(absolutePath, relativePath)
    return fullPath

data = GetData()
OpenAndEdit(data)