import { Request, Response, NextFunction } from 'express';
import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export async function getRedisClient() {
  const redisClient: RedisClientType = createClient( {
    username: process.env.REDIS_USER || '',
    password: process.env.REDIS_PASSWORD || '',
    socket: {
      host: process.env.REDIS_CLIENT || 'localhost',
      port: Number( process.env.REDIS_PORT ) || 6379
    }
  } );
  redisClient.on( 'error', err => console.log( 'Redis Client Error', err ) );

  await redisClient.connect();
  console.log( 'Redis ready for cache storage' );

  return redisClient;
}

export async function redisMiddleware( req: Request, res: Response, next: NextFunction ) {
  try {
    const redisClient = await getRedisClient();

    req.redisClient = redisClient;
    next();
  } catch ( error ) {
    console.error( 'Error initializing Redis:', error );
    res.status( 500 ).json( { error: 'Internal Server Error' } );
  }
}