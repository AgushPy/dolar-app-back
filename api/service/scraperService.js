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
// Función que hace scraping del valor del dólar blue
const getDolarBlueValues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const informationCurrency = new Array;
    const dolarOfDolarHoy = yield (0, dolarHoy_1.getDolarHoy)();
    const dolarOfAmbitoFinanciero = yield (0, ambitoFinanciero_1.getAmbitoFinanciero)();
    const dolarOfCronista = yield (0, cronista_1.getCronista)();
    informationCurrency.push(dolarOfDolarHoy, dolarOfAmbitoFinanciero, dolarOfCronista);
    if (req.redisClient) {
        const saveResultRedis = yield req.redisClient.set('infoDolars', JSON.stringify(informationCurrency), { EX: 60 });
        console.log('Data saved success');
    }
    return informationCurrency;
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
