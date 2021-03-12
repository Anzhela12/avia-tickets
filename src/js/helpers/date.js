import { format } from 'date-fns';
import { FormSelect } from 'materialize-css';

// str - дата в виде строки
// type - тип(шаблон) форматирования
// new Date - класс для дат в js, вернёт объект даты
// format() - библиотека шаблонов date-fns

/**
 *
 * @param {String} str - дата в виде строки
 * @param {String} type - 'yyyy.mm.dd'
 * @returns - указываем какой тип будет возвращён
 */
export function formatDate(str, type) {
  const date = new Date(str);
  return format(date, type)
}