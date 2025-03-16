"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scraperRoutes_1 = __importDefault(require("./routes/scraperRoutes"));
require("./cronJob");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const scraperRoutes = (0, scraperRoutes_1.default)();
app.use('/api/scrape', scraperRoutes);
app.get('/health', (req, res) => {
    res.status(200).json({
        message: 'Server on'
    });
});
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Welcome to Dolar Scrap api '
    });
});
// if ( process.env.NODE_ENV !== 'production' ) {
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
// }
// export default app;
