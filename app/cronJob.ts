import cron from 'node-cron';
import { getDolarBlueValues } from './service/scraperService';

// Ejecutar la función cada 45 segundos
cron.schedule('*/45 * * * * *', async () => {
  console.log('Ejecutando scraping del dólar blue...');
  await getDolarBlueValues();
});
