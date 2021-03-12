import {getAutocompleteInstance, getDatePickerInstance} from '../plugins/materialize';

class FormUi {
  /**
   * Инициализируем инпуты формы
   * Инициализируем форму чуруз _form, что бы установить на неё геттер и получить форму в app.js
   * Импортируем инстансы(методы) Материалайза для автокомплита и привязки дат к нужным инпутам
   */
  constructor(autoCompleteInstance, datePickerInstance) {
    this._form = document.forms['locationControls'];
    this.origin = document.getElementById('autocomplete-origin');
    this.destination = document.getElementById('autocomplete-destination');
    this.depart = document.getElementById('datepicker-depart');
    this.return = document.getElementById('datepicker-return');
    this.originAutoComplete = autoCompleteInstance(this.origin);
    this.destinationAutoComplete = autoCompleteInstance(this.destination);
    this.departDatePicker =  datePickerInstance(this.depart);
    this.returnDatePicker =  datePickerInstance(this.return);
  }

  // Получаем форму через геттер
  get form() {
    return this._form;
  }

  // Получаем значение инпутов (где toString() это спец метод из Materialize)
  get originValue() {
    return this.origin.value;
  }

  get destinationValue() {
    return this.destination.value;
  }

  get departDateValue() {
    return this.departDatePicker.toString();
  }

  get returnDateValue() {
    return this.returnDatePicker.toString();
  }

  /**
   * Задаём настройки для автокомплита(автозаполнения) 2-х инпутов
   * data - это объект с информацией для обработки
   * updateData(data) - установка(привязка) объекта data к инпутам с автокомплитом
   */
  setAutoCompleteData(data) {
    this.originAutoComplete.updateData(data);
    this.destinationAutoComplete.updateData(data)

  }
}

const formUI = new FormUi(getAutocompleteInstance, getDatePickerInstance);

export default formUI;