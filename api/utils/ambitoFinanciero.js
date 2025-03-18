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
exports.getAmbitoFinanciero = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const Dolar_1 = require("../models/Dolar");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const URL = 'https://www.ambito.com/contenidos/dolar-informal.html';
const getAmbitoFinanciero = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer_1.default.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            protocolTimeout: 180000
        });
        const page = yield browser.newPage();
        yield page.goto(URL, { waitUntil: 'domcontentloaded' });
        yield page.waitForFunction(() => window.jQuery !== undefined);
        yield page.evaluate(() => {
            return new Promise(resolve => {
                window.$(document).ajaxStop(resolve);
            });
        });
        const content = yield page.content();
        yield page.waitForSelector('span.variation-max-min__value.data-compra', { visible: true });
        const valueCompra = yield page.evaluate(() => {
            var _a;
            const span = document.querySelector('span.variation-max-min__value.data-compra');
            return span ? (_a = span.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null;
        });
        const valueVenta = yield page.evaluate(() => {
            var _a;
            const span = document.querySelector('span.variation-max-min__value.data-venta');
            return span ? (_a = span.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null;
        });
        const variation = yield page.evaluate(() => {
            var _a;
            const span = document.querySelector('span.variation-max-min__percent.data-class-variacion.data-variacion');
            return span ? (_a = span.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null;
        });
        yield browser.close();
        const dolar = new Dolar_1.Dolar();
        dolar.buyPrice = valueCompra || '';
        dolar.sellPrice = valueVenta || '';
        dolar.variation = variation || '';
        dolar.source = URL;
        dolar.sourcePlainText = 'Ambito financiero';
        // dolar.buyPrice = valueCompra;
        return dolar;
    }
    catch (err) {
        return new Dolar_1.Dolar();
    }
});
exports.getAmbitoFinanciero = getAmbitoFinanciero;
