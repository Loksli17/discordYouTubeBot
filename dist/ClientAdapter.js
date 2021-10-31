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
const discord_js_1 = __importDefault(require("discord.js"));
const configChipher_1 = __importDefault(require("./config/configChipher"));
const Bot_1 = __importDefault(require("./Bot/Bot"));
class ClientAdapter {
    constructor() {
        this.client = new discord_js_1.default.Client();
    }
    start() {
        this.ready();
        this.message();
        this.login();
    }
    ready() {
        this.client.on('ready', () => console.log('I am working!'));
    }
    message() {
        this.client.on('message', (msg) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (msg.author.username == ((_a = this.client.user) === null || _a === void 0 ? void 0 : _a.username) || ((_b = this.client.user) === null || _b === void 0 ? void 0 : _b.discriminator) == msg.author.discriminator) {
                console.error('error with user');
                // todo send error message !
                return;
            }
            const bot = new Bot_1.default(msg);
            const checkPrefixResult = bot.checkPrefix();
            if (!checkPrefixResult) {
                console.error('error this prefix');
                //todo send error message
            }
            try {
                yield bot.execute();
            }
            catch (error) {
                //todo send error message
                console.error(error);
            }
        }));
    }
    login() { this.client.login(configChipher_1.default.token); }
}
exports.default = ClientAdapter;
