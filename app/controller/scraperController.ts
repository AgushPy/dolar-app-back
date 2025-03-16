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

        const parsedResult = JSON.parse(getResultDolars);

        if (Array.isArray(parsedResult) && parsedResult.every(item => Object.keys(item).length === 0)) {
          console.log('Redis devolvió objetos vacíos, realizando scraping');
          // Realiza el scraping si los objetos están vacíos
          const dolarValue: Dolar[] = await getDolarBlueValues(req, res);
          res.json(dolarValue);
          return;
        }
        
        res.json( JSON.parse( parsedResult ) );
        return;
      }

    }

    // Llamada al servicio de scraping para obtener el valor del dólar
    const dolarValue: Dolar[] = await getDolarBlueValues(req, res);
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

    res.json( slippage );
  } catch ( err ) {
    res.status( 500 ).json( { error: 'Error to get average usd' } );
  }
};