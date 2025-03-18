"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scraperRoutes_1 = __importDefault(require("./routes/scraperRoutes"));
require("./cronJob");
const cors_1 = __importDefault(require("cors"));
const cronJob_1 = require("./cronJob");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const scraperRoutes = (0, scraperRoutes_1.default)();
const corsOptions = {
    origin: 'https://dolar-app-front.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    yield (0, cronJob_1.runScraper)();
}));
