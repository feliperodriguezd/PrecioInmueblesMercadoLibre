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
  await InsertarEnDatosDiarioMultiple(client, Precios[0], Precios[1]);
}

async function InsertarEnDatosDiarioMultiple(client, PrecioCasa, PrecioApartamento) {
  await client.query(`INSERT INTO datosdiariomultiple (preciocasa, precioapartamento) VALUES (${PrecioCasa}, ${PrecioApartamento})`);
}

async function ObtenerSumaDePrecioPropiedades(codigoCategoria) {
  let offset = 0;
  let precioSuma = 0;

  while (SeLlegoAlLimiteDeOffset(offset)) {
    let url = `https://api.mercadolibre.com/sites/MLU/search?category=${codigoCategoria}&search_type=scan&offset=${offset}`;
    let response = await ObtenerDatosDeURL(url);
    let data = await PasarDatosAJSON(response);
    let propiedades = await DatosDePropiedades(data);
    let cantidadPropieadades = CantidadDePropiedadesEnLista(propiedades);
    precioSuma += CalcularPrecio(cantidadPropieadades, propiedades)
    offset += 50;
  }
    
  return precioSuma;
}

function CalcularPrecio(cantidadPropieadades, propiedades){
  let precioSuma = 0
  for (let i = 0; i < cantidadPropieadades; i++) {
    let precio = propiedades[i].price;
    if (EstaPublicadoEnDolares(propiedades[i].currency_id)) {
      precioSuma += precio;
    } else {
      let conversionDolarPeso = ValorPesoDolar(data)
      precioSuma += PrecioConvertidoAUSD(precio, conversionDolarPeso)
    }
  }
  return precioSuma
}

function PrecioConvertidoAUSD(precio, conversionDolarPeso){
  return precio / conversionDolarPeso
}

function EstaPublicadoEnDolares(moneda) {
  return moneda == 'USD'
}

function ValorPesoDolar(data) {
  return data['available_currencies']['conversions'].usd_uyu;
}

export { CalculoDePrecioPropiedades }