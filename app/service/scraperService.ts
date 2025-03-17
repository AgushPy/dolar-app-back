import axios from 'axios';
import { Dolar } from '../models/Dolar';
import { getAmbitoFinanciero } from '../utils/ambitoFinanciero';
import { getCronista } from '../utils/cronista';
import { getDolarHoy } from '../utils/dolarHoy';
import { Request, Response } from 'express';

// Función que hace scraping del valor del dólar blue
export const getDolarBlueValues = async ( req: Request, res: Response ) => {

  const dolarHoy = await getDolarHoy();
  const ambitoFinanciero = await getAmbitoFinanciero();
  const cronista = await getCronista();



  if ( req.redisClient ) {
    await req.redisClient.set( 'infoDolars', JSON.stringify( [ dolarHoy, ambitoFinanciero, cronista ] ), { EX: 60 } );
    console.log( 'Data saved success' );
  }

  return [ dolarHoy, ambitoFinanciero, cronista ];
};

export const getDolarAverage = async ( req: Request, res: Response, dolars: Array<Dolar> ) => {
  if ( !dolars.length ) {
    dolars = await getDolarBlueValues( req, res );
  }

  let averageBuyPrice: number = 0;
  let averageSellPrice: number = 0;

  dolars.map( dolar => {
    averageBuyPrice += parseFloat( dolar.buyPrice.replace( '.', '' ).replace( ',', '.' ).replace( '$', '' ) ) || 0;
    averageSellPrice += parseFloat( dolar.sellPrice.replace( '.', '' ).replace( ',', '.' ).replace( '$', '' ) ) || 0;
  }
  );

  averageBuyPrice = averageBuyPrice / dolars.length;
  averageSellPrice = averageSellPrice / dolars.length;

  return {
    averageBuyPrice,
    averageSellPrice
  };
};

export const getDolarSlippage = async ( req: Request, res: Response, dolars: Array<Dolar> ) => {
  if ( !dolars.length ) {
    dolars = await getDolarBlueValues( req, res );
  }

  return dolars.map( dolar => {
    return {
      variation: dolar.variation,
      source: dolar.source
    };
  }
  );
};
