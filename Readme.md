## Run local
```sh
npm install -g pnpm
pnpm install
npm run start:dev
```

## Build docker
```sh
docker build -t dgtapp .

```

Then

```sh

docker run -e GAME_ID=c8087bf5-e192-4624-bc68-c0da149e0d4d -p 3000:3000 dgtapp

```