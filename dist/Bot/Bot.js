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
const command_1 = __importDefault(require("../config/command"));
const config_1 = __importDefault(require("../config"));
const BotCommands_1 = __importDefault(require("./BotCommands"));
class Bot extends BotCommands_1.default {
    constructor(msg) { super(msg); }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let words = this.msg.toString().split(' '), commandName = words[1];
            this.words = words;
            if (!command_1.default.includes(commandName)) {
                throw new Error('Bad command');
            }
            switch (commandName) {
                case 'play':
                    yield this.play();
                    break;
                case 'pause':
                    this.pause();
                    break;
                case 'resume':
                    this.resume();
                    break;
                case 'prev':
                    this.prev();
                    break;
                case 'next':
                    this.next();
                    break;
                case 'current':
                    this.current();
                    break;
                case 'queue':
                    this.queue();
                    break;
                case 'remove':
                    this.remove();
                    break;
                case 'remove':
                    this.remove();
                    break;
                case 'sayAhaha':
                    this.remove();
                    break;
                case 'playAhaha':
                    this.remove();
                    break;
            }
        });
    }
    checkPrefix() {
        let reg = new RegExp(`^${config_1.default.prefix}`, 'g'), resultArr = this.msg.content.match(reg), prefix = resultArr == null ? "" : resultArr[0];
        if (prefix != config_1.default.prefix)
            return false;
        this.msg.content.replace(prefix, '');
        return true;
    }
}
exports.default = Bot;
