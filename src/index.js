import { Client } from '@neondatabase/serverless';

import { CalculoDePrecioPropiedades } from './Preciototal';
import { CalculoDePrecioPromedioMensual } from './PromedioMensual';

export default {
  async scheduled(event, env, ctx) {
    const client = new Client(env.DATABASE_URL);
    await client.connect();
    await CalculoDePrecioPromedioMensual(client);
    await CalculoDePrecioPropiedades(client);

    ctx.waitUntil(client.end());
  }
}