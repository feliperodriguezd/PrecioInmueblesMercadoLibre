import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import os

absolute_path = os.path.dirname(__file__)
relative_path = "Datos.xlsx"
full_path = os.path.join(absolute_path, relative_path)

all = pd.read_excel(full_path)
all2 = pd.DataFrame(all)

date = all2["fecha"].tolist()
housePrice = all2["preciocasa"].tolist()
apartmentPrice = all2["precioapartamento"].tolist()

fig, ax = plt.subplots()
ax.plot(date, housePrice, label="Casas")
ax.plot(date, apartmentPrice, label="Apartamentos")
ax.axis((0, len(date), 0, max(housePrice)*1.3))
ax.xaxis.set_major_locator(plt.MaxNLocator(7))
ax.yaxis.set_major_formatter(ticker.FuncFormatter(lambda x, pos: 'US$ ' + '{:,.0f}'.format(x)))
ax.yaxis.grid(True)
plt.title("Precio promedio de casa y apartamentos en MercadoLibre")
plt.legend()
plt.show()