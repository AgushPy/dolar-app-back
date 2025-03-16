import express from 'express';
import { createClient } from 'redis';
import  createScraperRoutes  from './routes/scraperRoutes';
import './cronJob'; 

const app = express();

const redisClient = createClient( { url: "redis://localhost:6379" } );
redisClient.on( 'error', err => console.log( 'Redis Client Error', err ) );

// Middleware
app.use( express.json() );

const scraperRoutes = createScraperRoutes(); 

// Rutas del scraper
app.use( '/api/scrape', scraperRoutes );

// Iniciar servidor
const PORT = process.env.PORT || 3000;

redisClient.connect().then( () => {
  console.log('Redis ready for cache storage');
} );

app.listen( PORT, () => {
  console.log( `Servidor corriendo en el puerto ${ PORT }` );
} );


export { redisClient };