import { ObtenerDia, ObtenerMes, ObtenerAnio, EnviarMensaje, VerificarSiElMensajeSeEnvio } from "./FuncionesAuxiliares";
import { telegramToken, telegramChatId } from "./tokens";


async function AgregarADByEnviarMensaje(client) {
    const datosCrudos = await DatosDelaDB(client);
    let datos = datosCrudos['rows'];
    let precioCasa = PrecioPromedioCasa(datos)
    let precioApartamento = PrecioPromedioApartamento(datos)

    await InsertarEnDB(client, precioCasa, parseInt(precioApartamento))
    await EliminarDeLaDB(client)

    const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;

    let PreciosPromediosDivididos = [];
    let PrecioSinMiles = Math.round(precioCasa % 1000);
    let PrecioEnMiles = Math.round((precioCasa - PrecioSinMiles) / 1000);
    PreciosPromediosDivididos[0] = PrecioEnMiles;
    PreciosPromediosDivididos[1] = PrecioSinMiles;
    PrecioSinMiles = Math.round(precioApartamento % 1000);
    PrecioEnMiles = Math.round((precioApartamento - PrecioSinMiles) / 1000);
    PreciosPromediosDivididos[2] = PrecioEnMiles;
    PreciosPromediosDivididos[3] = PrecioSinMiles;

    let mensajeTelegram = MensajeTelegram(PreciosPromediosDivididos);

    const respuestaTelegram = await EnviarMensaje(telegramUrl, telegramChatId, mensajeTelegram);

    await VerificarSiElMensajeSeEnvio(respuestaTelegram);
}

function PrecioPromedioCasa(datos) {
    let cantidadDeDatos = datos.length
    let sumaPromedio = 0
    for (let i = 0; i < cantidadDeDatos; i++) {
        sumaPromedio += datos[i].preciocasa
    }
    return sumaPromedio / cantidadDeDatos
}

function PrecioPromedioApartamento(datos) {
    let cantidadDeDatos = datos.length
    let sumaPromedio = 0
    for (let i = 0; i < cantidadDeDatos; i++) {
        sumaPromedio += datos[i].precioapartamento
    }
    return sumaPromedio / cantidadDeDatos
}

async function DatosDelaDB(client) {
    return await client.query(`select * FROM datosdiariomultiple`);
}

async function EliminarDeLaDB(client) {
    return await client.query(`DELETE FROM datosdiariomultiple`);
}

async function InsertarEnDB(client, PrecioCasa, PrecioApartamento) {
    await client.query(`INSERT INTO DatosSemanales (Fecha, preciocasa, precioapartamento) VALUES ('${ObtenerDia()-1}/${ObtenerMes()}/${ObtenerAnio()}' , ${PrecioCasa}, ${PrecioApartamento})`);
}

function MensajeTelegram(PreciosPromediosDivididos) {
    let telegramMessage = `Precios promedio en MercadoLibre:\nCasa: U$S ${PreciosPromediosDivididos[0]}.`;

    if (PreciosPromediosDivididos[1] < 100) {
        telegramMessage = telegramMessage + `0${PreciosPromediosDivididos[1]}\nApartamento: U$S ${PreciosPromediosDivididos[2]}.`;
    } else {
        telegramMessage = telegramMessage + `${PreciosPromediosDivididos[1]}\nApartamento: U$S ${PreciosPromediosDivididos[2]}.`;
    }

    if (PreciosPromediosDivididos[3] < 100) {
        telegramMessage = telegramMessage + `0${PreciosPromediosDivididos[3]}`;
    } else {
        telegramMessage = telegramMessage + `${PreciosPromediosDivididos[3]}`;
    }
    return telegramMessage;
}


export { AgregarADByEnviarMensaje }