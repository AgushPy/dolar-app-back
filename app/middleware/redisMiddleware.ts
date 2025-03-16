import { Request, Response, NextFunction } from 'express';
import { createClient, RedisClientType } from 'redis';

export async function getRedisClient() {
  const redisClient : RedisClientType  = createClient({ url: process.env.REDIS_CLIENT });
  redisClient.on('error', err => console.log('Redis Client Error', err));

  await redisClient.connect();
  console.log('Redis ready for cache storage');

  return redisClient;
}

// Middleware para inicializar Redis en cada solicitud
export async function redisMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const redisClient = await getRedisClient();

    req.redisClient = redisClient;
    next();
  } catch (error) {
    console.error('Error initializing Redis:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}