
import express from 'express';
import { getAverage, getDolarBlue, getSlippage } from '../controller/scraperController';



const createScraperRoutes = () => {

  const scraperRoutes = express.Router();
  scraperRoutes.get( '/dolar', getDolarBlue );
  scraperRoutes.get( '/average', getAverage );
  scraperRoutes.get( '/slippage', getSlippage );

  return scraperRoutes;
}
export default createScraperRoutes;


