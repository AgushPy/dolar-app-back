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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSlippage = exports.getAverage = exports.getDolarBlue = void 0;
const scraperService_1 = require("../service/scraperService");
// Función que maneja la solicitud de obtener el valor del dólar blue
const getDolarBlue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.redisClient) {
            const getResultDolars = yield req.redisClient.get('infoDolars');
            req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
            console.log('El resultado de redis fue', getResultDolars);
            if (getResultDolars) {
                res.json(JSON.parse(getResultDolars));
                return;
            }
        }
        // Llamada al servicio de scraping para obtener el valor del dólar
        const dolarValue = yield (0, scraperService_1.getDolarBlueValues)(req, res);
        res.json(dolarValue);
        return;
    }
    catch (error) {
        console.error('Error en scraper:', error);
        res.status(500).json({ error: 'Error to get usd pricing' });
    }
});
exports.getDolarBlue = getDolarBlue;
const getAverage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let getResultDolars;
        if (req.redisClient) {
            getResultDolars = JSON.parse((yield req.redisClient.get('infoDolars')) || '{}');
            req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
        }
        else {
            getResultDolars = yield (0, scraperService_1.getDolarBlueValues)(req, res);
        }
        const average = yield (0, scraperService_1.getDolarAverage)(req, res, getResultDolars);
        res.json(average);
    }
    catch (err) {
        res.status(500).json({ error: 'Error to get average usd' });
    }
});
exports.getAverage = getAverage;
const getSlippage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let getResultDolars;
        if (req.redisClient) {
            getResultDolars = JSON.parse((yield req.redisClient.get('infoDolars')) || '{}');
            req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
        }
        else {
            getResultDolars = yield (0, scraperService_1.getDolarBlueValues)(req, res);
        }
        const slippage = yield (0, scraperService_1.getDolarSlippage)(req, res, getResultDolars);
        res.json(slippage);
    }
    catch (err) {
        res.status(500).json({ error: 'Error to get average usd' });
    }
});
exports.getSlippage = getSlippage;
