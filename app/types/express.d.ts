import { RedisClientType } from 'redis'; // Asegúrate de importar el tipo correcto de RedisClientType

declare global {
  namespace Express {
    interface Request {
      redisClient?: RedisClientType; // Aquí agregamos la propiedad redisClient al tipo Request
    }
  }
}