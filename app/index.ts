import express from 'express';
import createScraperRoutes from './routes/scraperRoutes';
import './cronJob';
import cors from 'cors';

const app = express();

app.use( express.json() );

const scraperRoutes = createScraperRoutes();

const corsOptions = {
  origin: 'https://dolar-app-front.vercel.app',  // Permitir solo este dominio
  methods: ['GET', 'POST'],         // Permitir solo ciertos métodos
  allowedHeaders: ['Content-Type', 'Authorization'], // Permitir ciertos encabezados
};

app.use(cors(corsOptions));

app.use( '/api/scrape', scraperRoutes );

app.get( '/health', ( req, res ) => {
  res.status( 200 ).json( {
    message: 'Server on'
  } );
} );

app.get( '/', ( req, res ) => {
  res.status( 200 ).json(
    {
      message: 'Welcome to Dolar Scrap api '
    }
  );
} );


const PORT = process.env.PORT || 3000;
app.listen( PORT, () => {
  console.log( `Servidor corriendo en el puerto ${ PORT }` );
} );
