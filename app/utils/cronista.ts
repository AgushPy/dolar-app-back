import puppeteer from 'puppeteer';
import { Dolar } from '../models/Dolar';
import dotenv from 'dotenv';

dotenv.config();


const URL = 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB';

export const getCronista = async() => {
  try{
    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
      protocolTimeout: 180000 
    });
    const page = await browser.newPage();

    await page.goto( URL, { waitUntil: 'domcontentloaded' } );

    const content = await page.content();

    const valueCompra = await page.evaluate( () => {
      const span = document.querySelector( '.buy .val' );
      return span ? span.textContent?.trim()  : null;
    } );
    const valueVenta = await page.evaluate( () => {
      const span = document.querySelector( '.sell .val' );
      return span ? span.textContent?.trim() : null;
    } );
    const variation = await page.evaluate( () => {
      const span = document.querySelector( '.percentage .val' );
      return span ? span.textContent?.trim() : null;
    } );

    await browser.close();

    const dolar = new Dolar();
    dolar.buyPrice = valueCompra || '';
    dolar.sellPrice = valueVenta || '';
    dolar.variation = variation || '';
    dolar.source = URL;
    dolar.sourcePlainText = 'Cronista';

    return dolar;
  }catch(err){
    return new Dolar(); 
  }
}