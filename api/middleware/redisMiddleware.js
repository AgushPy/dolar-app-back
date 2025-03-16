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
exports.getRedisClient = getRedisClient;
exports.redisMiddleware = redisMiddleware;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getRedisClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const redisClient = (0, redis_1.createClient)({
            username: process.env.REDIS_USER || '',
            password: process.env.REDIS_PASSWORD || '',
            socket: {
                host: process.env.REDIS_CLIENT || 'localhost',
                port: Number(process.env.REDIS_PORT) || 6379
            }
        });
        redisClient.on('error', err => console.log('Redis Client Error', err));
        yield redisClient.connect();
        console.log('Redis ready for cache storage');
        return redisClient;
    });
}
// Middleware para inicializar Redis en cada solicitud
function redisMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const redisClient = yield getRedisClient();
            req.redisClient = redisClient;
            next();
        }
        catch (error) {
            console.error('Error initializing Redis:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}
