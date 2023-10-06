/**
 * Оберка котоаря выполнит задачу через {ms} выремени
 * @param fn Функция которая отработает после указанног овремени
 * @param ms Время срабатывания
 * @returns Анонимная функция
 */
export const debounce = (fn: Function, ms: number): Function => {

    let interval: ReturnType<typeof setInterval> | null = null;

    return async () => {

        if(interval) clearTimeout(interval)
        interval = setTimeout(async () => await fn(), ms)

    }
}