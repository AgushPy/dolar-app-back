import puppeteer from 'puppeteer';
import { Dolar } from '../models/Dolar';

const URL = 'https://dolarhoy.com/';

export const getDolarHoy = async () => {
  try {
    const browser = await puppeteer.launch();

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
    console.log( valueCompra );
    console.log( valueVenta );
    console.log( variation );

    const dolar = new Dolar();
    dolar.buyPrice = valueCompra || '';
    dolar.sellPrice = valueVenta || '';
    dolar.variation = variation || '';
    dolar.source = URL;
    // dolar.buyPrice = valueCompra;


    return dolar;
  } catch ( err ) {
    return new Dolar();
  }

};
