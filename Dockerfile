FROM nodejs

WORKDIR /app

copy . .

RUN pnpm install

RUN npm run build
EXPOSE 3000
EXPOSE 3001
CMD npm start

