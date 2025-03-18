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
exports.runScraper = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const scraperService_1 = require("./service/scraperService");
const redisMiddleware_1 = require("./middleware/redisMiddleware");
const runScraper = () => __awaiter(void 0, void 0, void 0, function* () {
    const redisClient = yield (0, redisMiddleware_1.getRedisClient)();
    const req = { redisClient };
    const res = {
        json: (data) => console.log('Response JSON:', data),
        status: (code) => ({
            json: (data) => console.log(`Response Status ${code}:`, data),
        }),
    };
    const getResultDolars = yield redisClient.get('infoDolars');
    console.log('El resultado de redis fue', getResultDolars);
    if (getResultDolars) {
        yield redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
        return;
    }
    console.log('Starting scraper execution');
    yield (0, scraperService_1.getDolarBlueValues)(req, res);
    console.log('Finish scraper execution');
});
exports.runScraper = runScraper;
node_cron_1.default.schedule('*/3 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Cron ejecutado');
    yield (0, exports.runScraper)();
}));
