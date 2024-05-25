## Introduction

The objective of this project is to develop a proxy application connecting to the DGT Live Cloud, with the primary goal of concealing tournament IDs while also facilitating delayed moves for live games.

Tech Stack:

- Backend: NestJS with Socket.io
- Frontend: NextJS with React"


## Get
### prepare .env
The miniumn .env requires for the app as below .env

```sh
PORT=3001
JUNIOR_TOURNAMENT_ID=[DGT TournamentID]
SENIOR_TOURNAMENT_ID=[DGT TournamentID]
DELAY_MOVE=2
```
### Run local
```sh
npm install -g pnpm
pnpm install
npm run start:dev
```
By default below service will start:
- frontend -> http://localhost:3000
- backend -> http://localhost:3001


## Build docker
The 1 standalone docker app will run both backend & front-end using nestjs static server module. IT was confiured so serve static output of front-end app.
```sh
docker build -t dgtapp .

```

Then

```sh

docker run -e JUNIOR_TOURNAMENT_ID=c8087bf5-e192-4624-bc68-c0da149e0d4d  -e SENIOR_TOURNAMENT_ID=xxx -p 3000:3000 dgtapp

```


## Live example

Please visit https://hbcclive.fly.dev/ or https://hbcclive.fly.dev/senior.html