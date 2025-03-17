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
exports.default = handler;
const scraperService_1 = require("./service/scraperService"); // O la ruta correcta de tu función
const redisMiddleware_1 = require("./middleware/redisMiddleware");
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Ejecutando scraping del dólar blue...');
            req.redisClient = yield (0, redisMiddleware_1.getRedisClient)();
            req.redisClient.quit().then(() => console.log("Conexión Redis cerrada"));
            yield (0, scraperService_1.getDolarBlueValues)(req, res);
            res.status(200).json({ message: 'Scraping ejecutado exitosamente.' });
        }
        catch (error) {
            console.error('Error ejecutando el scraping:', error);
            res.status(500).json({ message: 'Hubo un error al ejecutar el scraping.' });
        }
    });
}
