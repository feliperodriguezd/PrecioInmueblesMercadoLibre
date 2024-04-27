# PrecioInmueblesMercadoLibre

## Code

La aplicación toma 1050 propiedades de la API de MercadoLibre (para casas y apartamentos), calcula el precio promedio, guarda la información en una base de datos y envía un mensaje por telegram usando un bot.

Se utilizan solo 1050 ya que ese es el límite de acceso de la API de MercadoLibre.

Tecnologías usadas: Node.js, CloudFlare y Neon (https://neon.tech/).

Base para el proyecto: https://x.com/ferminrp/status/1761413996727685442?s=20 

## Data

Se cargaron todos los datos obtenidos hasta el momento en un Excel (.xlsx) y se agrego un código en Python utilizando Jupyter Notebook que toma esos datos y genera una grafica.
