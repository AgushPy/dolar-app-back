import axios from 'axios';
import { Dolar } from '../models/Dolar';
import { getAmbitoFinanciero } from '../utils/ambitoFinanciero';
import { getCronista } from '../utils/cronista';
import { getDolarHoy } from '../utils/dolarHoy';
import { Request, Response } from 'express';
import { DolarHistorical } from '../models/DolarHistorical';

export const getDolarBlueValues = async ( req: Request, res: Response ) => {

  if ( req.redisClient ) {
    const getResultDolars = await req.redisClient.get( 'infoDolars' );

    console.log( 'El resultado de redis fue', getResultDolars );
    if ( getResultDolars ) {

      await req.redisClient.quit().then( () => console.log( "Conexión Redis cerrada" ) );

      return JSON.parse( getResultDolars );
    }

  }

  const dolarHoy = await getDolarHoy();
  const ambitoFinanciero = await getAmbitoFinanciero();
  const cronista = await getCronista();

  const hoy = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date());

  const dolarHoyHistorical : DolarHistorical = {...dolarHoy, hour: hoy}
  const ambitoFinancieroHistorical : DolarHistorical = {...ambitoFinanciero, hour: hoy}
  const cronistaHistorical : DolarHistorical = {...cronista, hour: hoy}



  if ( req.redisClient ) {
    await req.redisClient.set( 'infoDolars', JSON.stringify( [ dolarHoy, ambitoFinanciero, cronista ] ), { EX: 60 } );
    await req.redisClient.set( 'infoDolarsHistorical', JSON.stringify( [ dolarHoyHistorical, ambitoFinancieroHistorical, cronistaHistorical ] ), { EX: 240 } );
    await req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
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
