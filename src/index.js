import { Client } from '@neondatabase/serverless';

import { CalculoDePrecioPropiedades } from './Preciototal';
import { CalculoDePrecioPromedioMensual } from './EstadisticasMensuales';

export default {
  async scheduled(event, env, ctx) {
    const client = new Client(env.DATABASE_URL);
    await client.connect();
    await CalculoDePrecioPropiedades(client);
    await CalculoDePrecioPromedioMensual(client);

    ctx.waitUntil(client.end());
  }
}