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
exports.getCronista = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const Dolar_1 = require("../models/Dolar");
const URL = 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB';
const getCronista = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer_1.default.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = yield browser.newPage();
        yield page.goto(URL, { waitUntil: 'domcontentloaded' });
        const content = yield page.content();
        const valueCompra = yield page.evaluate(() => {
            var _a;
            const span = document.querySelector('.buy .val');
            return span ? (_a = span.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null;
        });
        const valueVenta = yield page.evaluate(() => {
            var _a;
            const span = document.querySelector('.sell .val');
            return span ? (_a = span.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null;
        });
        const variation = yield page.evaluate(() => {
            var _a;
            const span = document.querySelector('.percentage .val');
            return span ? (_a = span.textContent) === null || _a === void 0 ? void 0 : _a.trim() : null;
        });
        yield browser.close();
        const dolar = new Dolar_1.Dolar();
        dolar.buyPrice = valueCompra || '';
        dolar.sellPrice = valueVenta || '';
        dolar.variation = variation || '';
        dolar.source = URL;
        return dolar;
    }
    catch (err) {
        return new Dolar_1.Dolar();
    }
});
exports.getCronista = getCronista;
