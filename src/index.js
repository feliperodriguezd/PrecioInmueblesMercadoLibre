import { Client } from '@neondatabase/serverless';

import { CalculoDePrecioPropiedades } from './Preciototal';

export default {
  async scheduled(event, env, ctx) {
    const client = new Client(env.DATABASE_URL);
    
    await CalculoDePrecioPropiedades(client);

    ctx.waitUntil(client.end());
  }
}