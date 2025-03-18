import cron from 'node-cron';
import { getDolarBlueValues } from './service/scraperService';
import { Request, request, Response, response } from 'express';
import { getRedisClient } from './middleware/redisMiddleware';

cron.schedule('*/3 * * * *', async () => {
  const redisClient = await getRedisClient();
  const req = {
    redisClient,
  } as Partial<Request> as Request;

  const res = {
    json: (data: any) => console.log('Response JSON:', data),
    status: (code: number) => ({
      json: (data: any) => console.log(`Response Status ${code}:`, data),
    }),
  } as Partial<Response> as Response;
  console.log('Starting cron execution');
  await getDolarBlueValues(req, res);
  console.log('Finish cron execution');
});