#!/usr/bin/env node

import axios from "axios";
import moment from "moment";
import fs from "fs";
import path from "path";
import { Command } from "commander";

interface Tournament {
    name: string;
    location?: string;
    rounds: { count: number }[];
}

interface Player {
    fname: string;
    lname: string;
}

interface Pair {
    white: Player;
    black: Player;
    result: string;
}

interface Game {
    firstMove: string;
    moves: string[];
    live: boolean;
    result: string;
    round: number;
}

async function getTournament(id: string): Promise<Tournament> {
    const { data } = await axios.get<Tournament>(
        `https://1.pool.livechesscloud.com/get/${id}/tournament.json`
    );
    return data;
}

async function getPairings(id: string, round: number): Promise<Pair[]> {
    const url = `https://1.pool.livechesscloud.com/get/${id}/round-${round}/index.json`;
    const { data } = await axios.get<{ pairings: Pair[] }>(url);
    return data.pairings;
}

async function getGame(id: string, round: number, game: number): Promise<Game> {
    const url = `https://1.pool.livechesscloud.com/get/${id}/round-${round}/game-${game}.json`;
    const { data } = await axios.get<Game>(url);
    data.round = round;
    return data;
}

function generatePgn(tournament: Tournament, pair: Pair, game: Game, outputFolder: string): string {
    const resultMap: { [key: string]: string } = {
        WHITEWIN: "1-0",
        BLACKWIN: "0-1",
        DRAW: "1/2-1/2",
    };
    const d = moment(game.firstMove);
    const moves = game.moves.map((el, index) => {
        const m = el.split(" ")[0].replace(",", "");
        return index % 2 === 0 ? `${index / 2 + 1}. ${m}` : m;
    });

    const folder = path.join(outputFolder, tournament.name, `${game.round}`);
    fs.mkdirSync(folder, { recursive: true });

    let result = pair.result;
    const lastMove = moves[moves.length - 1];
    if (lastMove) {
        if (lastMove.includes("#")) {
            result = moves.length % 2 === 0 ? "0-1" : "1-0";
        } else {
            result = "1/2-1/2";
        }
    }
    if (!game.live && resultMap[game.result]) {
        result = resultMap[game.result];
    }

    const filename = path.join(
        folder,
        `${pair.white.lname},${pair.white.fname} vs ${pair.black.lname},${pair.black.fname} ${result}.pgn`.replace("1/2-1/2", "½-½")
    );

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

    fs.writeFileSync(filename, pgn);

    return pgn;
}

async function fetchMe(tournamentId: string, outputFolder: string, round: string, board: string): Promise<void> {
    const tournament = await getTournament(tournamentId);
    console.log(tournament);

    const fetchRound = async (round: number) => {
        let index = 1;
        const pairings = await getPairings(tournamentId, round);
        for await (const p of pairings) {

            const game = await getGame(tournamentId, round, index++);
            const pgn = generatePgn(tournament, p, game, outputFolder);
            console.log(pgn);
        }
    };

    await Promise.all(
        tournament.rounds.filter((x) => x.count > 0).map((_, index) => fetchRound(index + 1))
    );
}

// CLI setup
const program = new Command();
program
    .option('-t, --tournament-id <id>', 'tournament ID')
    .option('-o, --output-folder <folder>', 'output folder', 'data')
    .option('-r, --round <round>', 'round', '')
    .option('-b, --board <board>', 'board', '')
    .action(async (options) => {
        if (options.tournamentId) {
            await fetchMe(options.tournamentId, options.outputFolder, options.round, options.board);
        } else {
            console.error("Please provide a tournament ID with -t or --tournament-id");
        }
    });

program.parse(process.argv);
