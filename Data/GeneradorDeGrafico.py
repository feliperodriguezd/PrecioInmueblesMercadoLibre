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
def GetCorrectMonthData(listPrices):
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
housePriceMonthly = GetCorrectMonthData(housePriceMonthly)
apartmentPriceMonthly = GetCorrectMonthData(apartmentPriceMonthly)


#Crear graficos
fig, ax = plt.subplots()
ax.plot(date, housePrice, label="Casas")
ax.plot(date, apartmentPrice, label="Apartamentos")
ax.axis((0, len(date), 0, max(housePrice)*1.3))
ax.xaxis.set_major_locator(plt.MaxNLocator(10))
ax.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, pos: 'US$ ' + '{:,.0f}'.format(x)))
ax.yaxis.grid(True)

plt.title("Precio promedio de casa y apartamentos en MercadoLibre")
plt.show()

fig, axx = plt.subplots()
axx.plot(dateMonthly, housePriceMonthly, label="Casas")
axx.plot(dateMonthly, apartmentPriceMonthly, label="Apartamentos")
axx.axis((0, len(dateMonthly), 0, max(housePriceMonthly)*1.3))
axx.xaxis.set_major_locator(plt.MaxNLocator(2))
axx.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, pos: 'US$ ' + '{:,.0f}'.format(x)))
axx.yaxis.grid(True)

plt.title("Precio promedio de casa y apartamentos en MercadoLibre")
plt.show()