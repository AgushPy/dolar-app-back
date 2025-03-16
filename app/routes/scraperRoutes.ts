
import express from 'express';
import { getAverage, getDolarBlue, getSlippage } from '../controller/scraperController';
import { redisMiddleware } from '../middleware/redisMiddleware';

const createScraperRoutes = () => {

  const scraperRoutes = express.Router();

  scraperRoutes.use(redisMiddleware);

  scraperRoutes.get( '/dolar', getDolarBlue );
  scraperRoutes.get( '/average', getAverage );
  scraperRoutes.get( '/slippage', getSlippage );

  return scraperRoutes;
}
export default createScraperRoutes;


