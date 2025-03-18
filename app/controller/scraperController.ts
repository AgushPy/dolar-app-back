import { Request, Response } from 'express';
import { Dolar } from '../models/Dolar';
import { getDolarAverage, getDolarBlueValues, getDolarSlippage } from '../service/scraperService';
import async from 'async';

type Task = () => Promise<void>;

const queue = async.queue<Task>( async ( task, callback ) => {
  await task();
  callback();
}, 1 );

export const getDolarBlue = async ( req: Request, res: Response ) => {
  try {
    queue.push( async () => {
      const dolarValue = await getDolarBlueValues( req, res );
      res.json( { dolar: dolarValue } );
    } );
    return;
  } catch ( error ) {
    console.error( 'Error en scraper:', error );
    res.status( 500 ).json( { error: 'Error to get usd pricing' } );
  }
};

export const getDolarBlueHistorical = async ( req: Request, res: Response ) => {
  try {
    if ( req.redisClient ) {
      const getResultDolarsHistorical = JSON.parse( await req.redisClient.get( 'infoDolarsHistorical' ) || '{}' );
      res.json( { dolarHistorical: getResultDolarsHistorical } );
      return;
    }
    res.json( { dolarHistorical: [] } );
    return;
  } catch ( error ) {
    res.status( 500 ).json( { error: 'Error to get usd pricing historical' } );
  }
};

export const getAverage = async ( req: Request, res: Response ) => {
  try {
    let getResultDolars: Dolar[];
    if ( req.redisClient ) {
      getResultDolars = JSON.parse( await req.redisClient.get( 'infoDolars' ) || '{}' );
    } else {
      getResultDolars = await getDolarBlueValues( req, res );
    }

    const average = await getDolarAverage( req, res, getResultDolars );

    if ( req.redisClient ) {
      req.redisClient.quit().then( () => console.log( "Conexión Redis cerrada" ) );
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
      getResultDolars = await getDolarBlueValues( req, res );
    }

    const slippage = await getDolarSlippage( req, res, getResultDolars );

    if ( req.redisClient ) {
      req.redisClient.quit().then( () => console.log( "Conexión Redis cerrada" ) );
    }

    res.json( slippage );
  } catch ( err ) {
    res.status( 500 ).json( { error: 'Error to get average usd' } );
  }
};