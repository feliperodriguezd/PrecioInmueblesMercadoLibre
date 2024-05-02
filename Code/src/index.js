import { Client } from '@neondatabase/serverless';

import { CalculoDePrecioPropiedades } from './PrecioPorMinuto';
import { CalculoDePrecioPromedioMensual } from './PromedioMensual';
import { AgregarADByEnviarMensaje } from './DatoDiario';

export default {
  async scheduled(event, env, ctx) {
    let fecha = new Date()
    const client = new Client(env.DATABASE_URL);
    await client.connect();

    if (fecha.getHours() == 2 && fecha.getMinutes() == 55) {
      await CalculoDePrecioPromedioMensual(client);
      await AgregarADByEnviarMensaje(client)
    }

    await CalculoDePrecioPropiedades(client);

    ctx.waitUntil(client.end());
  }
}