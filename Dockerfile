ARG BUN_VERSION=1.1.10

FROM --platform=linux/amd64 oven/bun:${BUN_VERSION}-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --chown=bun:bun ./package.json ./package.json
COPY --chown=bun:bun ./bun.lockb ./bun.lockb
RUN bun install --frozen-lockfile --production

USER bun

COPY --chown=bun:bun . .

EXPOSE 3000

CMD bun src/index.ts
