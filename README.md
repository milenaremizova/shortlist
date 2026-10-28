# Shortlist

> Вечер без мук выбора.

**Shortlist** — помощник для досуга. Он помогает быстро и весело решить, что посмотреть, что заказать на ужин и чем это запить. Варианты появляются парами: выбираешь, какой лучше, и через пару минут получаешь честный рейтинг и победителя. Провожает по приложению пиксельная **Тапочка**.

## Режимы

| Режим             | Что делает                                                                                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| **Собрать вечер** | Три коротких раунда подряд: фильм → еда → напитки. Не зашло что-то одно — переигрываешь только этот раунд. |
| **Пара тапочек**  | Выбор на двоих вслепую. Кубик решает, кто ходит первым, игра идёт до первого совпадения.                   |
| **Свой рейтинг**  | Расставь по местам что угодно: фильмы, книги, блюда, любые хотелки.                                        |

## Стек

- **TypeScript**, **React 19**, **React Router 7** — SPA, mobile-first
- **Vite**, **SCSS-модули**, токены дизайна из Фигмы в CSS-переменных
- **Vitest** + Testing Library — тесты домена и хуков
- **Node.js + Express** — прокси к внешним API, ключи не попадают в браузер
- Данные: [ПоискКино API](https://poiskkino.dev) — фильмы с постерами

## Архитектура

Зависимости идут в одну сторону: `ui → app → domain`, `api → domain`. Домен — чистый TypeScript, ESLint не даст импортировать в него React или другие слои.

```
src/
├── domain/                 # чистый TS: типы, сессии, стратегии
│   ├── ChoiceSession.ts    # общий интерфейс любой сессии выбора
│   ├── RankingSession.ts   # Facade: стратегия + журнал + отмена хода
│   ├── RankingStrategy.ts  # Strategy: какой алгоритм выбирает пары
│   ├── strategies/         # MergeSortStrategy (дальше — KnockoutStrategy)
│   ├── factories.ts        # единственное место, где собираются сессии
│   └── shuffle.ts          # перемешивание передаётся снаружи
├── api/                    # источники данных: ItemProvider, HistoryRepository
├── app/                    # хуки, роутер, DependenciesProvider
├── ui/
│   ├── pages/              # экраны — номера совпадают с макетом в Фигме
│   └── components/         # Tapochka, Button, …
└── styles/                 # tokens.scss, mixins.scss, global.scss
server/                     # Express-прокси (свой package.json)
```

**Паттерны:**

- **Strategy** — `RankingStrategy`: `MergeSortStrategy` даёт полный рейтинг, `KnockoutStrategy` (этап 3) — только победителя;
- **Facade** — `RankingSession` прячет стратегию и журнал за `choose` / `undo` / `progress`;
- **Factory** — сессия получает фабрику стратегии и пересоздаёт её при отмене хода; режимы собираются в `factories.ts`;
- **Repository** — `HistoryRepository`: сейчас localStorage, потом HTTP, экраны не меняются;
- **Dependency Injection** — перемешивание, хранилище и провайдеры передаются снаружи, поэтому всё тестируется без браузера и сети.

## Запуск

Node.js 22 (версия лежит в `.nvmrc`).

```bash
npm install
npm --prefix server install
cp server/.env.example server/.env   # вписать POISKKINO_API_KEY
```

В двух терминалах:

```bash
npm run dev          # клиент → http://localhost:5173
npm run dev:server   # прокси → http://localhost:3001
```
