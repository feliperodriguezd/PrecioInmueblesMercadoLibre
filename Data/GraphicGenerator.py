import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import os

#Toma datos del Excel
absolute_path = os.path.dirname(__file__)
relative_path = "Datos.xlsx"
full_path = os.path.join(absolute_path, relative_path)

all = pd.read_excel(full_path)
all2 = pd.DataFrame(all)

#Pasa los datos a lista
date = all2["fecha"].tolist()
housePrice = all2["preciocasa"].tolist()
apartmentPrice = all2["precioapartamento"].tolist()
housePriceMonthly = all2["preciocasamensual"].tolist()
apartmentPriceMonthly = all2["precioapartamentomensual"].tolist()

#Se queda solo con los datos que precisa
def GetCorrectMonthDataForPrice(listPrices):
    returnList = []
    for x in listPrices:
        if str(x) != 'nan':
            returnList.append(x)
    return returnList

def GetCorrectMonthDataForDate():
    returnList = []
    for x in range(len(housePriceMonthly)):
        if str(housePriceMonthly[x]) != 'nan':
            returnList.append(date[x])
    return returnList

dateMonthly = GetCorrectMonthDataForDate()
housePriceMonthly = GetCorrectMonthDataForPrice(housePriceMonthly)
apartmentPriceMonthly = GetCorrectMonthDataForPrice(apartmentPriceMonthly)

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

CreateGraphic(date, housePrice, apartmentPrice)
CreateGraphic(dateMonthly, housePriceMonthly, apartmentPriceMonthly)