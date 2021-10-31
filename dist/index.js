"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ClientAdapter_1 = __importDefault(require("./ClientAdapter"));
class App {
    constructor() {
        this.client = new ClientAdapter_1.default();
    }
    init() {
        this.client.start();
    }
    static get Instance() {
        return this.instance || (this.instance = new this());
    }
}
let app = App.Instance;
app.init();
