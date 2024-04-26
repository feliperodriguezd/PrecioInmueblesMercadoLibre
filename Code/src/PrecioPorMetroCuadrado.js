import { ObtenerDia, ObtenerMes, ObtenerAnio, ObtenerDatosDeURL, PasarDatosAJSON, SeLlegoAlLimiteDeOffset, EnviarMensaje, VerificarSiElMensajeSeEnvio, DatosDePropiedades, CantidadDePropiedadesEnLista } from "./FuncionesAuxiliares";

import { telegramToken, telegramChatId } from "./tokens";

async function CalculoDePrecioPropiedadesPorMetroCuadrado(client) {
    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    let codigosCategoria = ["MLU1468", "MLU1474"];
    let PreciosPromediosDivididos = [];
    let Precios = []

    for (let i = 0; i < codigosCategoria.length; i++) {
        let PrecioSuma = await ObtenerSumaDePrecioPorMetroCuadradoDePropiedades(codigosCategoria[i]);
        let cantidadDePropiedadesVistas = 1050;
        let PrecioPromedio = PrecioSuma / cantidadDePropiedadesVistas;
        let PrecioEnMiles = Math.round(PrecioPromedio / 1000);
        let PrecioSinMiles = Math.round(PrecioPromedio % 1000);
        PreciosPromediosDivididos[i * 2] = PrecioEnMiles;
        PreciosPromediosDivididos[(i * 2) + 1] = PrecioSinMiles;
        Precios[i] = Math.round(PrecioPromedio);
    }

    let mensajeTelegram = MensajeTelegramMetroCuadrado(PreciosPromediosDivididos);

    const respuestaTelegram = await EnviarMensaje(telegramUrl, telegramChatId, mensajeTelegram);

    await VerificarSiElMensajeSeEnvio(respuestaTelegram);
}

function MensajeTelegramMetroCuadrado(PreciosPromediosDivididos) {
    let telegramMessage = ``;

    if (PreciosPromediosDivididos[0] >= 1) {
        telegramMessage = `Precios promedio por m² en MercadoLibre:\nCasa: U$S ${PreciosPromediosDivididos[0]}.`;
    } else {
        telegramMessage = `Precios promedio por m² en MercadoLibre:\nCasa: U$S `;

    }
    if (PreciosPromediosDivididos[1] < 100) {
        telegramMessage += `0${PreciosPromediosDivididos[1]}\n`;
    } else {
        telegramMessage += `${PreciosPromediosDivididos[1]}\n`;
    }

    if (PreciosPromediosDivididos[2]) {
        telegramMessage += `Apartamento: U$S ${PreciosPromediosDivididos[2]}.`
    } else {
        telegramMessage += `Apartamento: U$S `
    }

    if (PreciosPromediosDivididos[2] < 100) {
        telegramMessage += `0${PreciosPromediosDivididos[3]}`;
    } else {
        telegramMessage += `${PreciosPromediosDivididos[3]}`;
    }
    return telegramMessage;
}

function PrecioPropiedadMetroCuadrado(precio, metraje) {
    return precio / metraje;
}

function obtenerPrecio(propiedad) {
    return propiedad.price;
}

function obtenerMetros(propiedad) {
    let atributosPropiedade = propiedad['attributes'];
    for (let i = 0; i < atributosPropiedade.length; i++) {
        if (EsElAtributoDeMetros(atributosPropiedade[i])) {
            return atributosPropiedade[i]['value_struct'].number;
        }
    }
}

function EsElAtributoDeMetros(atributoPropiedad) {
    return atributoPropiedad.id == "TOTAL_AREA";
}


async function ObtenerSumaDePrecioPorMetroCuadradoDePropiedades(codigoCategoria) {
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
            let propiedad = propiedades[i];
            let metrosDePropiedad = obtenerMetros(propiedad);
            let precioDePropiedad = obtenerPrecio(propiedad);
            PrecioPromedio += PrecioPropiedadMetroCuadrado(precioDePropiedad, metrosDePropiedad);
        }
        offset += 50;
    }
    
    return PrecioPromedio;
}

export { CalculoDePrecioPropiedadesPorMetroCuadrado }
