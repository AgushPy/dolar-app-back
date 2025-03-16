import axios from 'axios';
import { redisClient } from '..';
import { Dolar } from '../models/Dolar';
import { getAmbitoFinanciero } from '../utils/ambitoFinanciero';
import { getCronista } from '../utils/cronista';
import { getDolarHoy } from '../utils/dolarHoy';
import cron from 'node-cron';

// Función que hace scraping del valor del dólar blue
export const getDolarBlueValues = async () => {

  const informationCurrency = new Array<Dolar>;

  const dolarOfDolarHoy: Dolar = await getDolarHoy();
  const dolarOfAmbitoFinanciero: Dolar = await getAmbitoFinanciero();
  const dolarOfCronista: Dolar = await getCronista();
  informationCurrency.push( dolarOfDolarHoy, dolarOfAmbitoFinanciero, dolarOfCronista );

  const saveResultRedis = await redisClient.set( 'infoDolars', JSON.stringify( informationCurrency ), { EX: 60 } );
  console.log( 'Data saved success' );

  return informationCurrency;
};

export const getDolarAverage = async ( dolars: Array<Dolar> ) => {
  if ( !dolars.length ) {
    dolars = await getDolarBlueValues();
  }

  let averageBuyPrice : number = 0;
  let averageSellPrice : number = 0;

  dolars.map( dolar =>{
      averageBuyPrice += parseFloat( dolar.buyPrice.replace('.', '').replace(',', '.').replace('$', '') ) || 0
      averageSellPrice += parseFloat( dolar.sellPrice.replace('.', '').replace(',', '.').replace('$', '') ) || 0
    }
  );

  averageBuyPrice = averageBuyPrice / dolars.length
  averageSellPrice = averageSellPrice / dolars.length

  return {
    averageBuyPrice,
    averageSellPrice
  }
};

export const getDolarSlippage = async (dolars: Array<Dolar>) => {
  if ( !dolars.length ) {
    dolars = await getDolarBlueValues();
  }

  return dolars.map( dolar =>{
    return {
      variation: dolar.variation,
      source: dolar.source
    }
  }
);
}
