# Сборка в два этапа (multi-stage)
# 1. Сборка: ставим все зависимости и компилируем TypeScript в dist/
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN npm run build

# 2. Запуск: только dist/ и production-зависимости
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist

# Не запускаем от root: если сервер взломают, у процесса не будет прав на систему
USER node

# Порт задаёт облако через переменную PORT; 8080 — значение по умолчанию у Yandex Serverless Containers
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]
