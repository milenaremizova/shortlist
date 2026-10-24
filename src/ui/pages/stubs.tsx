import { ScreenStub } from '@/ui/components/ScreenStub/ScreenStub';

// Заглушки экранов v1. Каждую по мере работы заменяем настоящей страницей в своей папке,
// как WelcomePage: Page.tsx + Page.module.scss.

export const HomePage = () => <ScreenStub code="02.1" title="Что делаем?" />;
export const EveningPage = () => <ScreenStub code="03" title="Собрать вечер" />;
export const DuelPage = () => <ScreenStub code="04" title="Пара тапочек" />;
export const RatingPage = () => <ScreenStub code="05" title="Свой рейтинг" />;
export const HistoryPage = () => <ScreenStub code="07.1" title="Вечера" />;
export const NotFoundPage = () => <ScreenStub code="404" title="Тут пусто" />;
