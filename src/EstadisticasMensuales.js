import { telegramToken, telegramChatId } from "./tokens";

import { EnviarMensaje, VerificarSiElMensajeSeEnvio } from "./FuncionesAuxiliares";

async function CalculoDePrecioPromedioMensual(client) {
    await client.connect();
    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    if (CambioElMes()) {
        const datosCrudos = await BuscarEnLaBaseDeDatosLasFilasCorrectas(client);
        let datos = datosCrudos['rows'];
        let promedioMensualCasas = Math.round(CalcularPromedio(datos, "casa"));
        let promedioMensualApartamentos = Math.round(CalcularPromedio(datos, "apartamentos"));

        let PreciosPromediosDivididos = [];
        let PrecioSinMilesCasas = Math.round(promedioMensualCasas % 1000);
        let PrecioEnMilesCasas = Math.round((promedioMensualCasas - PrecioSinMilesCasas) / 1000);
        PreciosPromediosDivididos[0] = PrecioEnMilesCasas;
        PreciosPromediosDivididos[1] = PrecioSinMilesCasas;

        let PrecioSinMilesApartamento = Math.round(promedioMensualApartamentos % 1000);
        let PrecioEnMilesApartamento = Math.round((promedioMensualApartamentos - PrecioSinMilesApartamento) / 1000);
        PreciosPromediosDivididos[2] = PrecioEnMilesApartamento;
        PreciosPromediosDivididos[3] = PrecioSinMilesApartamento;

        let mensajeTelegram = MensajeTelegram(PreciosPromediosDivididos);

        const respuestaTelegram = await EnviarMensaje(telegramUrl, telegramChatId, mensajeTelegram);
        await VerificarSiElMensajeSeEnvio(respuestaTelegram);
    }
}

function MensajeTelegram(PreciosPromediosDivididos) {
    let telegramMessage = `El precio promedio del mes anterior es:\nCasa: U$S ${PreciosPromediosDivididos[0]}.`;
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

function CalcularPromedio(datos, tipoPropiedad) {
    let sumaDePrecios = 0;
    let cantidadDeDias = datos.length
    if (tipoPropiedad == "casa") {
        for (let i = 0; i < cantidadDeDias; i++) {
            sumaDePrecios += datos[i].preciocasa;
        }
    } else {
        for (let i = 0; i < cantidadDeDias; i++) {
            sumaDePrecios += parseInt(datos[i].precioapartamento);
        }
    }
    return sumaDePrecios / cantidadDeDias
}

async function BuscarEnLaBaseDeDatosLasFilasCorrectas(client) {
    let mesAnterior = MesAnterior();
    let anioDelMesAnterior = DevolverAnioDelMes(MesAnterior);
    return await client.query(`select* FROM datossemanales where fecha LIKE '%/${mesAnterior}/${anioDelMesAnterior}%'`);
}

function DevolverAnioDelMes(mes) {
    let fecha = new Date();
    if (EsElUltimoMesDelAnio(mes)) {
        return fecha.getFullYear() - 1;
    } else {
        return fecha.getFullYear();
    }
}

function EsElUltimoMesDelAnio(mes) {
    return mes == 12;
}

function CambioElMes() {
    let fecha = new Date();
    return fecha.getDate() == 1;
}

function MesAnterior() {
    let fecha = new Date();
    let mes = (fecha.getMonth() + 1) % 12;
    if (EsElPrimerMesDelAnio(mes)) {
        return 12;
    }
    return mes;
}

function EsElPrimerMesDelAnio(mes) {
    return mes == 1;
}

export { CalculoDePrecioPromedioMensual }