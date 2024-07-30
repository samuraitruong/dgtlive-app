#!/usr/bin/env node
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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
function getTournament(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(`https://1.pool.livechesscloud.com/get/${id}/tournament.json`);
        return data;
    });
}
function getPairings(id, round) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://1.pool.livechesscloud.com/get/${id}/round-${round}/index.json`;
        const { data } = yield axios_1.default.get(url);
        return data.pairings;
    });
}
function getGame(id, round, game) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://1.pool.livechesscloud.com/get/${id}/round-${round}/game-${game}.json`;
        const { data } = yield axios_1.default.get(url);
        data.round = round;
        return data;
    });
}
function generatePgn(tournament, pair, game, outputFolder) {
    const resultMap = {
        WHITEWIN: "1-0",
        BLACKWIN: "0-1",
        DRAW: "1/2-1/2",
    };
    const d = (0, moment_1.default)(game.firstMove);
    const moves = game.moves.map((el, index) => {
        const m = el.split(" ")[0].replace(",", "");
        return index % 2 === 0 ? `${index / 2 + 1}. ${m}` : m;
    });
    const folder = path_1.default.join(outputFolder, tournament.name, `${game.round}`);
    fs_1.default.mkdirSync(folder, { recursive: true });
    let result = pair.result;
    const lastMove = moves[moves.length - 1];
    if (lastMove) {
        if (lastMove.includes("#")) {
            result = moves.length % 2 === 0 ? "0-1" : "1-0";
        }
        else {
            result = "1/2-1/2";
        }
    }
    if (!game.live && resultMap[game.result]) {
        result = resultMap[game.result];
    }
    const filename = path_1.default.join(folder, `${pair.white.lname},${pair.white.fname} vs ${pair.black.lname},${pair.black.fname} ${result}.pgn`.replace("1/2-1/2", "½-½"));
    const pgn = `
    [Event "${tournament.name}"]
    [Site "${tournament.location || "Hobsons Bay Chess Club"}"]
    [White "${pair.white.lname},${pair.white.fname}"]
    [Black "${pair.black.lname},${pair.black.fname}"]
    [BlackElo ""]
    [WhiteElo ""]
    [Board ""]
    [Round "${game.round}"]
    [Result "${result}"]
    [Date "${d.format("yyyy.MM.DD")}"]

    ${moves.join(" ")}
    `
        .split("\n")
        .map((x) => x.trim())
        .join("\n");
    fs_1.default.writeFileSync(filename, pgn);
    return pgn;
}
function fetchMe(tournamentId, outputFolder, round, board) {
    return __awaiter(this, void 0, void 0, function* () {
        const tournament = yield getTournament(tournamentId);
        const fetchRound = (round) => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            let index = 1;
            const pairings = yield getPairings(tournamentId, round);
            try {
                for (var _d = true, pairings_1 = __asyncValues(pairings), pairings_1_1; pairings_1_1 = yield pairings_1.next(), _a = pairings_1_1.done, !_a; _d = true) {
                    _c = pairings_1_1.value;
                    _d = false;
                    const p = _c;
                    const game = yield getGame(tournamentId, round, index++);
                    const pgn = generatePgn(tournament, p, game, outputFolder);
                    console.log(pgn);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = pairings_1.return)) yield _b.call(pairings_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
        yield Promise.all(tournament.rounds.filter((x) => x.count > 0).map((_, index) => fetchRound(index + 1)));
    });
}
// CLI setup
const program = new commander_1.Command();
program
    .option('-t, --tournament-id <id>', 'tournament ID')
    .option('-o, --output-folder <folder>', 'output folder', 'data')
    .option('-r, --round <round>', 'round', '')
    .option('-b, --board <board>', 'board', '')
    .action((options) => __awaiter(void 0, void 0, void 0, function* () {
    if (options.tournamentId) {
        yield fetchMe(options.tournamentId, options.outputFolder, options.round, options.board);
    }
    else {
        console.error("Please provide a tournament ID with -t or --tournament-id");
    }
}));
program.parse(process.argv);
