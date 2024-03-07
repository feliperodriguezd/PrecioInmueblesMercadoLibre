import { ObtenerDia, ObtenerMes, ObtenerAnio, ObtenerDatosDeURL, PasarDatosAJSON, SeLlegoAlLimiteDeOffset, EnviarMensaje, VerificarSiElMensajeSeEnvio, DatosDePropiedades, CantidadDePropiedadesEnLista } from "./FuncionesAuxiliares";
import { telegramToken, telegramChatId } from "./tokens";

async function CalculoDePrecioPropiedades(client) {
  await client.connect();
  const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

  let codigosCategoria = ["MLU1468", "MLU1474"];
  let PreciosPromediosDivididos = [];
  let Precios = []
  for (let i = 0; i < codigosCategoria.length; i++) {
    let PrecioSuma = await ObtenerSumaDePrecioPropiedades(codigosCategoria[i]);
    let cantidadDeCasasVistas = 1050;
    let PrecioPromedio = PrecioSuma / cantidadDeCasasVistas;
    let PrecioSinMiles = Math.round(PrecioPromedio % 1000);
    let PrecioEnMiles = Math.round((PrecioPromedio - PrecioSinMiles) / 1000);
    PreciosPromediosDivididos[i * 2] = PrecioEnMiles;
    PreciosPromediosDivididos[(i * 2) + 1] = PrecioSinMiles;
    Precios[i] = Math.round(PrecioPromedio);
  }

  await InsertarEnDB(client, Precios[0], Precios[1]);

  let mensajeTelegram = MensajeTelegram(PreciosPromediosDivididos);

  const respuestaTelegram = await EnviarMensaje(telegramUrl, telegramChatId, mensajeTelegram);

  await VerificarSiElMensajeSeEnvio(respuestaTelegram);
}

async function InsertarEnDB(client, PrecioCasa, PrecioApartamento) {
  await client.query(`INSERT INTO DatosSemanales (Fecha, preciocasa, precioapartamento) VALUES ('${ObtenerDia()}/${ObtenerMes()}/${ObtenerAnio()}' , ${PrecioCasa}, ${PrecioApartamento})`);
}

function MensajeTelegram(PreciosPromediosDivididos) {
  let telegramMessage = `Precios promedio en MercadoLibre:\nCasa: U$S ${PreciosPromediosDivididos[0]}.`;

  if (PreciosPromediosDivididos[1] < 100) {
    telegramMessage = telegramMessage + `0${PreciosPromediosDivididos[1]}\nApartamento: U$S ${PreciosPromediosDivididos[2]}.`;
  } else {
    telegramMessage = telegramMessage + `${PreciosPromediosDivididos[1]}\nApartamento: U$S ${PreciosPromediosDivididos[2]}.`;
  }

  if (PreciosPromediosDivididos[2] < 100) {
    telegramMessage = telegramMessage + `0${PreciosPromediosDivididos[3]}`;
  } else {
    telegramMessage = telegramMessage + `${PreciosPromediosDivididos[3]}`;
  }
  return telegramMessage;
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