import { ObtenerDia, ObtenerMes, ObtenerAnio, EnviarMensaje, VerificarSiElMensajeSeEnvio } from "./FuncionesAuxiliares";

async function CalculoDePrecioPromedioMensual(client) {
    await client.connect();

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

        await InsertarEnDB(client, promedioMensualCasas, promedioMensualApartamentos);
    }
}

async function InsertarEnDB(client, PrecioCasa, PrecioApartamento) {
    await client.query(`INSERT INTO datosmensuales (Fecha, preciocasa, precioapartamento) VALUES ('${ObtenerDia()}/${ObtenerMes()}/${ObtenerAnio()}' , ${PrecioCasa}, ${PrecioApartamento})`);
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
    return fecha.getDate() == 8;
}

function MesAnterior() {
    let fecha = new Date();
    let mes = (fecha.getMonth() + 1) % 12;
    if (EsElPrimerMesDelAnio(mes)) {
        return 12;
    }
    return mes - 1;
}

function EsElPrimerMesDelAnio(mes) {
    return mes == 1;
}

export { CalculoDePrecioPromedioMensual }