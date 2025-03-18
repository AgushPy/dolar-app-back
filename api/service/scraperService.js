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
exports.getDolarSlippage = exports.getDolarAverage = exports.getDolarBlueValues = void 0;
const ambitoFinanciero_1 = require("../utils/ambitoFinanciero");
const cronista_1 = require("../utils/cronista");
const dolarHoy_1 = require("../utils/dolarHoy");
const getDolarBlueValues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.redisClient) {
        const getResultDolars = yield req.redisClient.get('infoDolars');
        console.log('El resultado de redis fue', getResultDolars);
        if (getResultDolars) {
            yield req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
            return JSON.parse(getResultDolars);
        }
    }
    const dolarHoy = yield (0, dolarHoy_1.getDolarHoy)();
    const ambitoFinanciero = yield (0, ambitoFinanciero_1.getAmbitoFinanciero)();
    const cronista = yield (0, cronista_1.getCronista)();
    const hoy = new Intl.DateTimeFormat('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date());
    const dolarHoyHistorical = Object.assign(Object.assign({}, dolarHoy), { hour: hoy });
    const ambitoFinancieroHistorical = Object.assign(Object.assign({}, ambitoFinanciero), { hour: hoy });
    const cronistaHistorical = Object.assign(Object.assign({}, cronista), { hour: hoy });
    if (req.redisClient) {
        yield req.redisClient.set('infoDolars', JSON.stringify([dolarHoy, ambitoFinanciero, cronista]), { EX: 60 });
        yield req.redisClient.set('infoDolarsHistorical', JSON.stringify([dolarHoyHistorical, ambitoFinancieroHistorical, cronistaHistorical]), { EX: 240 });
        yield req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
        console.log('Data saved success');
    }
    return [dolarHoy, ambitoFinanciero, cronista];
});
exports.getDolarBlueValues = getDolarBlueValues;
const getDolarAverage = (req, res, dolars) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dolars.length) {
        dolars = yield (0, exports.getDolarBlueValues)(req, res);
    }
    let averageBuyPrice = 0;
    let averageSellPrice = 0;
    dolars.map(dolar => {
        averageBuyPrice += parseFloat(dolar.buyPrice.replace('.', '').replace(',', '.').replace('$', '')) || 0;
        averageSellPrice += parseFloat(dolar.sellPrice.replace('.', '').replace(',', '.').replace('$', '')) || 0;
    });
    averageBuyPrice = averageBuyPrice / dolars.length;
    averageSellPrice = averageSellPrice / dolars.length;
    return {
        averageBuyPrice,
        averageSellPrice
    };
});
exports.getDolarAverage = getDolarAverage;
const getDolarSlippage = (req, res, dolars) => __awaiter(void 0, void 0, void 0, function* () {
    if (!dolars.length) {
        dolars = yield (0, exports.getDolarBlueValues)(req, res);
    }
    return dolars.map(dolar => {
        return {
            variation: dolar.variation,
            source: dolar.source
        };
    });
});
exports.getDolarSlippage = getDolarSlippage;
