/**
 * Обрабатываем ошибку
 * @param error Объект ошибки
 * @returns текст ошибки
 */
export const errorProcessing = (e: any) => {
    return e.data.message
}