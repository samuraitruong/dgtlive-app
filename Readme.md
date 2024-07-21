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
MONGO_URI=mongo connection string
AUTH_SECRET=secret

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
The 1 standalone docker app will run both backend & front-end using nestjs static server module. IT was configured so serve static output of front-end app. refer to dockerfile for details
```sh
docker build -t dgtapp .

```

Then

```sh

docker run -e JUNIOR_TOURNAMENT_ID=c8087bf5-e192-4624-bc68-c0da149e0d4d  -e SENIOR_TOURNAMENT_ID=xxx -p 3000:3000 dgtapp





```

## Screenshot


<img width="1506" alt="image" src="https://github.com/samuraitruong/dgtlive-app/assets/1183138/910beac6-68ab-4957-81d9-b00049defbe6">



<img width="1507" alt="image" src="https://github.com/samuraitruong/dgtlive-app/assets/1183138/3c9aec40-51eb-43cf-bab8-8b4a1af5def0">

Fullscreen view
<img width="1512" alt="image" src="https://github.com/samuraitruong/dgtlive-app/assets/1183138/9e1828e1-91f0-4d56-807e-d00f28693c15">

Tournament view


<img width="1512" alt="image" src="https://github.com/samuraitruong/dgtlive-app/assets/1183138/8b7ba7df-4edd-4abd-b50c-40efd05de276">


## Live example

Please visit https://hbcclive.fly.dev/ or https://hbcclive.fly.dev/senior.html
