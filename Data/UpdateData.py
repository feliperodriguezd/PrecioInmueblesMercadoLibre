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

def Edit(sheet, data):
    for numbre in range(0, len(data)):
        row = numbre + 2
        sheet[f'A{str(row)}'] = data[numbre][0]
        sheet[f'B{str(row)}'] = data[numbre][1]
        sheet[f'C{str(row)}'] = data[numbre][2]
    row = len(data) + 1
    last = len(data) - 1
    sheet[f'A{str(row)}'] = data[last][0]
    sheet[f'B{str(row)}'] = data[last][1]
    sheet[f'C{str(row)}'] = data[last][2]

def OpenAndEdit(data):
    excel = OpenExcel()
    sheet = excel.active     
    try:
        Edit(sheet, data)
        excel.save(GetRelativePath('Datos.xlsx')) 
    except Exception as ex:
        print(f"Error: {ex}")

def GetData():
    data = []
    connection = psycopg2.connect(ConnectionString.connection_string)
    cur = connection.cursor()
    query = "SELECT * FROM datossemanales order by SPLIT_PART(fecha, '/', 3), CAST(SPLIT_PART(fecha, '/', 2) AS INTEGER), CAST(SPLIT_PART(fecha, '/', 1) AS INTEGER)"
    cur.execute(query)
    row = cur.fetchone()
    while row != None:
        rowData = []
        rowData.append(row[0])
        rowData.append(row[1])
        rowData.append(int(row[2]))
        data.append(rowData)
        row = cur.fetchone()
    cur.close()
    connection.close()
    return data

def GetRelativePath(relativePath):
    absolutePath = os.path.dirname(__file__)
    fullPath = os.path.join(absolutePath, relativePath)
    return fullPath

data = GetData()
OpenAndEdit(data)