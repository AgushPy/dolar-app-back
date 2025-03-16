import { Request, Response } from 'express';
import { redisClient } from '..';
import { Dolar } from '../models/Dolar';
import { getDolarAverage, getDolarBlueValues, getDolarSlippage } from '../service/scraperService';



// Función que maneja la solicitud de obtener el valor del dólar blue
export const getDolarBlue = async ( req: Request, res: Response ) => {
  try {

    const getResultDolars = await redisClient.get( 'infoDolars' );

    if ( getResultDolars ) {
      res.json( JSON.parse(getResultDolars) );
      return;
    }

    // Llamada al servicio de scraping para obtener el valor del dólar
    const dolarValue: Dolar[] = await getDolarBlueValues();
    res.json( dolarValue );
    return;
  } catch ( error ) {
    console.error( 'Error en scraper:', error );
    res.status( 500 ).json( { error: 'Error to get usd pricing' } );
  }
};

export const getAverage = async ( req: Request, res: Response ) => {
  try {
    const getResultDolars : Dolar[] = JSON.parse(await redisClient.get( 'infoDolars' ) || '{}');

    const average = await getDolarAverage(getResultDolars);

    res.json( average );
  }catch(err){
    res.status( 500 ).json( { error: 'Error to get average usd' } );
  }
};

export const getSlippage = async ( req: Request, res: Response ) => {
  try {
    const getResultDolars : Dolar[] = JSON.parse(await redisClient.get( 'infoDolars' ) || '{}');

    const slippage = await getDolarSlippage(getResultDolars);

    res.json( slippage );
  }catch(err){
    res.status( 500 ).json( { error: 'Error to get average usd' } );
  }
};