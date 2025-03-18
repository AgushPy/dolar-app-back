import puppeteer from 'puppeteer';
import { Dolar } from '../models/Dolar';
import dotenv from 'dotenv';

dotenv.config();


const URL = 'https://dolarhoy.com/';

export const getDolarHoy = async () => {
  try {
    const browser = await puppeteer.launch( {
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: true,
      args: [ '--no-sandbox', '--disable-setuid-sandbox' ],
      protocolTimeout: 180000 
    } );

    const page = await browser.newPage();

    await page.goto( URL, { waitUntil: 'domcontentloaded' } );

    const valueCompra = await page.evaluate( () => {
      const element = document.evaluate(
        '//a[contains(text(), "Dólar Blue")]//following::div[contains(@class, "compra")]//div[contains(@class, "val")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return element ? element.textContent?.trim() : null;
    } );
    const valueVenta = await page.evaluate( () => {
      const element = document.evaluate(
        '//a[contains(text(), "Dólar Blue")]//following::div[contains(@class, "venta")]//div[contains(@class, "val")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return element ? element.textContent?.trim() : null;
    } );

    const variation = await page.evaluate( () => {
      const element = document.evaluate(
        '//a[contains(text(), "Dólar Blue")]//following::div[contains(@class, "venta")]//div[contains(@class, "var-porcentaje")]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue;
      return element ? element.textContent?.trim() : null;
    } );

    await browser.close();

    const dolar = new Dolar();
    dolar.buyPrice = valueCompra || '';
    dolar.sellPrice = valueVenta || '';
    dolar.variation = variation || '';
    dolar.source = URL;
    dolar.sourcePlainText = 'Dolar Hoy';


    return dolar;
  } catch ( err ) {
    return new Dolar();
  }

};
