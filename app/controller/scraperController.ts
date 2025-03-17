import { Request, Response } from 'express';
import { Dolar } from '../models/Dolar';
import { getDolarAverage, getDolarBlueValues, getDolarSlippage } from '../service/scraperService';

// Función que maneja la solicitud de obtener el valor del dólar blue
export const getDolarBlue = async ( req: Request, res: Response ) => {
  try {

    if ( req.redisClient ) {
      const getResultDolars = await req.redisClient.get( 'infoDolars' );

      console.log('El resultado de redis fue',getResultDolars)
      if ( getResultDolars ) {

        req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
        res.json( JSON.parse( getResultDolars ) );

        return;
      }

    }

    // Llamada al servicio de scraping para obtener el valor del dólar
    const dolarValue: Dolar[] = await getDolarBlueValues(req, res);

    if ( req.redisClient ) {
      req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
    }
    
    res.json( dolarValue );
    return;
  } catch ( error ) {
    console.error( 'Error en scraper:', error );
    res.status( 500 ).json( { error: 'Error to get usd pricing' } );
  }
};

export const getAverage = async ( req: Request, res: Response ) => {
  try {
    let getResultDolars: Dolar[];
    if ( req.redisClient ) {
      getResultDolars = JSON.parse( await req.redisClient.get( 'infoDolars' ) || '{}' );
    } else {
      getResultDolars = await getDolarBlueValues(req, res);
    }

    const average = await getDolarAverage( req, res, getResultDolars );

    if ( req.redisClient ) {
      req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
    }

    res.json( average );
  } catch ( err ) {
    res.status( 500 ).json( { error: 'Error to get average usd' } );
  }
};

export const getSlippage = async ( req: Request, res: Response ) => {
  try {
    let getResultDolars: Dolar[];
    if ( req.redisClient ) {
      getResultDolars = JSON.parse( await req.redisClient.get( 'infoDolars' ) || '{}' );
    }
    else {
      getResultDolars = await getDolarBlueValues(req, res);
    }

    const slippage = await getDolarSlippage( req, res , getResultDolars );

    if ( req.redisClient ) {
      req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
    }

    res.json( slippage );
  } catch ( err ) {
    res.status( 500 ).json( { error: 'Error to get average usd' } );
  }
};