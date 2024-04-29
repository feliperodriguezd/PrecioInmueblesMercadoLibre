import { Client } from '@neondatabase/serverless';

import { CalculoDePrecioPropiedades } from './PrecioPorMinuto';
import { CalculoDePrecioPromedioMensual } from './PromedioMensual';
import { AgregarADByEnviarMensaje } from './DatoDiario';

export default {
  async scheduled(event, env, ctx) {
    let fecha = new Date()
    const client = new Client(env.DATABASE_URL);
    await client.connect();

    await CalculoDePrecioPromedioMensual(client);

    if (fecha.getHours() == 23 && fecha.getMinutes() == 50) {
      await AgregarADByEnviarMensaje(client)
    }

    await CalculoDePrecioPropiedades(client);

    ctx.waitUntil(client.end());
  }
}