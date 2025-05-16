# Stage 1: Build Stage
FROM node:24 as build
RUN npm install -g pnpm
WORKDIR /app

COPY . .

RUN pnpm install
RUN npm run lint

ENV NEXT_PUBLIC_WS_URL=/
ENV NEXTJS_BUILD_MODE=1
ENV NEXTJS_BUILD_API_URL=https://hbcclive.fly.dev/api/public
RUN npm run build-publish

# Stage 2: Production Stage
FROM node:24

WORKDIR /app

COPY --from=build /app/*.* /app/
COPY --from=build /app/packages/frontend/out /app/packages/frontend/out
COPY --from=build /app/packages/backend/dist /app/packages/backend/dist
COPY --from=build /app/packages/backend/package.json /app/packages/backend/package.json
COPY --from=build /app/packages/library /app/packages/library
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --production

ENV PORT=3000

# Expose the port
EXPOSE 3000

CMD ["npm", "start"]

