# Precio Inmuebles MercadoLibre

## Code

La aplicación toma 1050 propiedades de la API de MercadoLibre por minuto (tanto para casas como apartamentos), calcula el precio promedio y guarda la información en una base de datos. Una vez al día recoge esa información guardada, toma el promedio y lo guarda en la DB a la vez que envía un mensaje por telegram usando un bot.

Se utilizan solo 1050 ya que ese es el límite de acceso de la API de MercadoLibre.

Tecnologías usadas: Node.js, CloudFlare y Neon (https://neon.tech/).

Base para el proyecto: https://x.com/ferminrp/status/1761413996727685442?s=20 

## Data

La clase UpdateData baja los datos de la base de datos y los agrega al Excel Datos.xlsx. Luego los datos obtenidos en el Excel se gráfica, de esto se encarga la clase GraphicGenerator.

A su vez, se genero un [dashboard](https://app.powerbi.com/groups/me/reports/3f822e19-f69f-4e78-a129-b30a2c73195d/450af4fe4f227a951b3e?experience=power-bi) en Power BI donde se grafican los datos.