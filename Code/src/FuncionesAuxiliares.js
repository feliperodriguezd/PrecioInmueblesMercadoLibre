const options = {
    headers: {
        'authority': 'www.mercadolibre.com.uy',
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'dnt': '1',
        'kavak-client-type': 'web',
        'kavak-country-acronym': 'ar',
        'referer': 'https://casa.mercadolibre.com.uy/',
        'sec-ch-ua': '"Chromium";v="121", "Not A(Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    }
};

function ObtenerDia() {
    let fecha = new Date();
    return fecha.getDate();
}

function ObtenerMes() {
    let fecha = new Date();
    return fecha.getMonth() + 1;
}

function ObtenerAnio() {
    let fecha = new Date();
    return fecha.getFullYear();
}

async function ObtenerDatosDeURL(url) {
    return await fetch(url, options);
}

async function PasarDatosAJSON(datos) {
    return await datos.json();
}

function SeLlegoAlLimiteDeOffset(offset) {
    return offset <= 1000;
}

async function EnviarMensaje(telegramUrl, telegramChatId, mensajeTelegram) {
    await fetch(telegramUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: telegramChatId,
            text: mensajeTelegram
        })
    });
}

async function VerificarSiElMensajeSeEnvio(respuestaTelegram) {
    const telegramResult = await respuestaTelegram.json();
    if (!telegramResult.ok) {
        console.error('Error sending Telegram message', telegramResult);
    }
}

async function DatosDePropiedades(datos) {
    return await datos['results'];
}

function CantidadDePropiedadesEnLista(lista) {
    return lista.length;
}

function CantidadDeDiasDelMesAnteriror(){
    return new Date(ObtenerAnio(), ObtenerMes()-1, 0).getDate();
}

function CambioElMes() {
    let fecha = new Date();
    return fecha.getDate() == 1;
}

function CambioElMesParaCloudflare() {
    let fecha = new Date();
    return fecha.getDate() == 2;
}

export { ObtenerDia, ObtenerMes, ObtenerAnio, ObtenerDatosDeURL, PasarDatosAJSON, SeLlegoAlLimiteDeOffset, EnviarMensaje, VerificarSiElMensajeSeEnvio, DatosDePropiedades, CantidadDePropiedadesEnLista, CantidadDeDiasDelMesAnteriror, CambioElMes, CambioElMesParaCloudflare }