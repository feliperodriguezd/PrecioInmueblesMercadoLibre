import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import os

def ThereIsData(data):
    return data != 'nan'

#Se queda solo con los datos que precisa
def GetCorrectMonthDataForPrice(listPrices):
    returnList = []
    for x in listPrices:
        listItemToString = str(x)
        if ThereIsData(listItemToString):
            returnList.append(x)
    return returnList


def GetCorrectMonthDataForDate(dates, listWithEmptySpots, lengthofList):
    returnList = []
    for x in range(lengthofList):
        if ThereIsData(str(listWithEmptySpots[x])):
            returnList.append(dates[x])
    return returnList


def CreateGraphic(dataDate, dataHouse, dataApartment):
    fig, ax = plt.subplots()
    ax.plot(dataDate, dataHouse, label="Casas")
    ax.plot(dataDate, dataApartment, label="Apartamentos")
    ax.axis((0, len(dataDate), 0, max(dataHouse)*1.3))
    xTickerQuantity = 0
    if len(dataDate)>10:
        xTickerQuantity = 10
    else:
        xTickerQuantity = len(dataDate)
    ax.xaxis.set_major_locator(plt.MaxNLocator(xTickerQuantity))
    ax.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, pos: 'US$ ' + '{:,.0f}'.format(x)))
    ax.yaxis.grid(True)
    plt.title("Precio promedio de casa y apartamentos en MercadoLibre")
    plt.show()

def GetPathOfExcelFile():
    absolutePath = os.path.dirname(__file__)
    relativePath = "Datos.xlsx"
    fullPath = os.path.join(absolutePath, relativePath)
    return fullPath


def TakeDataAndCreateGraph(excel):
    dates = excel["fecha"].tolist()
    housePrice = excel["preciocasa"].tolist()
    apartmentPrice = excel["precioapartamento"].tolist()
    housePriceMonthly = excel["preciocasamensual"].tolist()
    apartmentPriceMonthly = excel["precioapartamentomensual"].tolist()
    month = excel["mes"].tolist()

    dateMonthly = GetCorrectMonthDataForDate(month, housePriceMonthly, len(dates))
    housePriceMonthly = GetCorrectMonthDataForPrice(housePriceMonthly)
    apartmentPriceMonthly = GetCorrectMonthDataForPrice(apartmentPriceMonthly)

    CreateGraphic(dates, housePrice, apartmentPrice)
    CreateGraphic(dateMonthly, housePriceMonthly, apartmentPriceMonthly)

if __name__ == '__main__':
    path = GetPathOfExcelFile()
    allExcelData = pd.read_excel(path)
    excelDataToDataFrame = pd.DataFrame(allExcelData)
    TakeDataAndCreateGraph(excelDataToDataFrame)
    