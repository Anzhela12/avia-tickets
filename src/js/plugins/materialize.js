import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';

// Init select
const select = document.querySelectorAll('select');// находим наши селекты
M.FormSelect.init(select);// инициализируем селекты

export function getSelectInstance(elem) {
  return M.FormSelect.getInstance(elem);
}


// Init form autocomplete
const autocomplete = document.querySelectorAll('.autocomplete');
M.Autocomplete.init(autocomplete, {
  data: {
    "Apple": null,
    "Microsoft": null,
    "Google": 'https://placehold.it/250x250'
  }
});// инициализируем селекты

export function getAutocompleteInstance(elem) {
  return M.Autocomplete.getInstance(elem);
}


// Init datepickers передаём настройки вторым аргументом, например кнопку очистки даты(вне настрйоки есть в материалайзе)
// Указываем нужный формат даты (смотреть в документации)
const datepickers = document.querySelectorAll('.datepicker');
M.Datepicker.init(datepickers, {
  showClearBtn: true,
  format: 'yyyy-mm'
});

export function getDatePickerInstance(elem) {
  return M.Datepicker.getInstance(elem);
}