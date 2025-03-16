import { Request, Response } from 'express';
import { getDolarBlueValues } from './service/scraperService'; // O la ruta correcta de tu función
import { getRedisClient } from './middleware/redisMiddleware';


export default async function handler(req: Request, res : Response) {
  try {
    console.log('Ejecutando scraping del dólar blue...');
    req.redisClient = await getRedisClient();
    await getDolarBlueValues(req, res);
    res.status(200).json({ message: 'Scraping ejecutado exitosamente.' });
  } catch (error) {
    console.error('Error ejecutando el scraping:', error);
    res.status(500).json({ message: 'Hubo un error al ejecutar el scraping.' });
  }
}