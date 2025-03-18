import puppeteer from 'puppeteer';
import { Dolar } from '../models/Dolar';
import dotenv from 'dotenv';

dotenv.config();


const URL = 'https://www.ambito.com/contenidos/dolar-informal.html';

declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

export const getAmbitoFinanciero = async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
      protocolTimeout: 180000 
    });
    const page = await browser.newPage();

    await page.goto( URL, { waitUntil: 'domcontentloaded' } );

    await page.waitForFunction( () => window.jQuery !== undefined );

    await page.evaluate( () => {
      return new Promise( resolve => {
        window.$( document ).ajaxStop( resolve );
      } );
    } );

    const content = await page.content();

    await page.waitForSelector( 'span.variation-max-min__value.data-compra', { visible: true } );

    const valueCompra = await page.evaluate( () => {
      const span = document.querySelector( 'span.variation-max-min__value.data-compra' );
      return span ? span.textContent?.trim() : null;
    } );
    const valueVenta = await page.evaluate( () => {
      const span = document.querySelector( 'span.variation-max-min__value.data-venta' );
      return span ? span.textContent?.trim() : null;
    } );
    const variation = await page.evaluate( () => {
      const span = document.querySelector( 'span.variation-max-min__percent.data-class-variacion.data-variacion' );
      return span ? span.textContent?.trim() : null;
    } );

    await browser.close();

    const dolar = new Dolar();
    dolar.buyPrice = valueCompra || '';
    dolar.sellPrice = valueVenta || '';
    dolar.variation = variation || '';
    dolar.source = URL;
    dolar.sourcePlainText = 'Ambito financiero';
    // dolar.buyPrice = valueCompra;

    return dolar;



  } catch ( err ) {
    return new Dolar(); 
  }
};