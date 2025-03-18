import cron from 'node-cron';
import { getDolarBlueValues } from './service/scraperService';
import { Request, request, Response, response } from 'express';
import { getRedisClient } from './middleware/redisMiddleware';

export const runScraper = async() =>  {
  const redisClient = await getRedisClient();
  const req = { redisClient } as Partial<Request> as Request;

  const res = {
    json: (data: any) => console.log('Response JSON:', data),
    status: (code: number) => ({
      json: (data: any) => console.log(`Response Status ${code}:`, data),
    }),
  } as Partial<Response> as Response;

  const getResultDolars = await redisClient.get('infoDolars');
  console.log('El resultado de redis fue', getResultDolars);

  if (getResultDolars) {
    await redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
    return;
  }

  console.log('Starting scraper execution');
  await getDolarBlueValues(req, res);
  console.log('Finish scraper execution');
}

cron.schedule( '*/3 * * * *', async () => {
  console.log('Cron ejecutado');
  await runScraper();
} );