import { ObtenerDatosDeURL, PasarDatosAJSON, SeLlegoAlLimiteDeOffset, DatosDePropiedades, CantidadDePropiedadesEnLista } from "./FuncionesAuxiliares";

async function CalculoDePrecioPropiedades(client) {
  let codigosCategoria = ["MLU1468", "MLU1474"];
  let Precios = []
  for (let i = 0; i < codigosCategoria.length; i++) {
    let PrecioSuma = await ObtenerSumaDePrecioPropiedades(codigosCategoria[i]);
    let cantidadDeCasasVistas = 1050;
    let PrecioPromedio = PrecioSuma / cantidadDeCasasVistas;
    Precios[i] = Math.round(PrecioPromedio);
  }
  await InsertarEnDB(client, Precios[0], Precios[1]);
}

async function InsertarEnDB(client, PrecioCasa, PrecioApartamento) {
  await client.query(`INSERT INTO datosdiariomultiple (preciocasa, precioapartamento) VALUES (${PrecioCasa}, ${PrecioApartamento})`);
}

async function ObtenerSumaDePrecioPropiedades(codigoCategoria) {
  let offset = 0;
  let url = `https://api.mercadolibre.com/sites/MLU/search?category=${codigoCategoria}&search_type=scan&offset=${offset}`;
  let response = await ObtenerDatosDeURL(url);
  let data = await PasarDatosAJSON(response);

  let propiedades = await DatosDePropiedades(data);
  let cantidadPropieadades = CantidadDePropiedadesEnLista(propiedades);
  let PrecioPromedio = 0;
  while (SeLlegoAlLimiteDeOffset(offset)) {
    url = `https://api.mercadolibre.com/sites/MLU/search?category=${codigoCategoria}&search_type=scan&offset=${offset}`;
    response = await ObtenerDatosDeURL(url);

    data = await PasarDatosAJSON(response);
    propiedades = await DatosDePropiedades(data);
    cantidadPropieadades = CantidadDePropiedadesEnLista(propiedades);

    for (let i = 0; i < cantidadPropieadades; i++) {
      let precio = propiedades[i].price;
      if (EstaPublicadoEnDolares(propiedades[i].currency_id)) {
        PrecioPromedio += precio;
      } else {
        let conversionDolarPeso = ValorPesoDolar(data)
        PrecioPromedio += (precio / conversionDolarPeso)
      }
    }
    offset += 50;
  }
  return PrecioPromedio;
}

function EstaPublicadoEnDolares(moneda) {
  return moneda == 'USD'
}

function ValorPesoDolar(data) {
  return data['available_currencies']['conversions'].usd_uyu;
}

export { CalculoDePrecioPropiedades }