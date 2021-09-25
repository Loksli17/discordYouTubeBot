"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const discord_js_1 = __importStar(require("discord.js"));
const commands_1 = __importDefault(require("./commands"));
const main = () => {
    const intents = [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES], bot = new discord_js_1.default.Client({ intents: [intents] });
    bot.on('ready', () => {
        console.log('I am working!');
    });
    bot.on('messageCreate', (msg) => {
        var _a, _b;
        if (msg.author.username == ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.username) || ((_b = bot.user) === null || _b === void 0 ? void 0 : _b.discriminator) == msg.author.discriminator)
            return;
        if (msg.content[0] != config_1.default.prefix)
            return;
        const words = msg.content.split(" "), userCommandName = words[0].substr(1, words[0].length);
        commands_1.default.forEach((command) => {
            if (command.name == userCommandName)
                command.out(bot, msg, words);
        });
    });
    bot.login(config_1.default.token);
};
main();
