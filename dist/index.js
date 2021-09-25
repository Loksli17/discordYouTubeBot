"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const discord_js_1 = __importDefault(require("discord.js"));
const commands_1 = __importDefault(require("./commands"));
const configChipher_1 = __importDefault(require("./configChipher"));
const main = () => {
    const bot = new discord_js_1.default.Client();
    bot.on('ready', () => console.log('I am working!'));
    bot.on('message', (msg) => {
        var _a, _b;
        if (msg.author.username == ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.username) || ((_b = bot.user) === null || _b === void 0 ? void 0 : _b.discriminator) == msg.author.discriminator)
            return;
        //! FIX THIS SHIT !!!
        let reg = new RegExp(`^${config_1.default.prefix}`, 'g'), prefix = msg.content.match(reg)[0], words = msg.content.split(" "), userCommandName = words[0].substr(1, words[0].length);
        if (prefix != config_1.default.prefix)
            return;
        words = words.filter((value, ind) => ind > 0);
        commands_1.default.forEach((command) => {
            if (command.name == userCommandName)
                command.out(bot, msg, words);
        });
    });
    bot.login(configChipher_1.default.token);
};
main();
