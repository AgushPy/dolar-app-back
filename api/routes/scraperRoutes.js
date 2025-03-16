"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const scraperController_1 = require("../controller/scraperController");
const redisMiddleware_1 = require("../middleware/redisMiddleware");
const createScraperRoutes = () => {
    const scraperRoutes = express_1.default.Router();
    scraperRoutes.use(redisMiddleware_1.redisMiddleware);
    scraperRoutes.get('/dolar', scraperController_1.getDolarBlue);
    scraperRoutes.get('/average', scraperController_1.getAverage);
    scraperRoutes.get('/slippage', scraperController_1.getSlippage);
    return scraperRoutes;
};
exports.default = createScraperRoutes;
