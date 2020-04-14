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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const firestore_1 = require("@google-cloud/firestore");
const config = __importStar(require("./config.json"));
const client = new Discord.Client();
const db = new firestore_1.Firestore({
    projectId: config.projectId,
    keyFilename: config.keyFilename,
});
const getUserInput = (message) => {
    var _a;
    const args = message.slice(config.prefix.length).trim().split(/ +/g);
    const command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    return [args, command];
};
const checkTrashPlayer = (playerName) => __awaiter(void 0, void 0, void 0, function* () {
    const playersRef = db.collection('players');
    const badPlayer = yield (yield playersRef.where('player_name', '==', playerName).get()).docs;
    console.log(badPlayer);
});
// client.on('ready', () => {
//     console.log('Bot Ready');
// });
// client.on('message', (message: Discord.Message) => {
//     const validMessage = message.content.startsWith(config.prefix) || message.author.bot;
//     if (!validMessage) {
//         return;
//     }
//     const [args, command] = getUserInput(message.content);
//     switch (command) {
//         case 'add':
//             console.log('add');
//         case 'check':
//             console.log('check');
//     }
// });
// client.login(config.secret_token);
checkTrashPlayer('Riven Uce');
//# sourceMappingURL=index.js.map