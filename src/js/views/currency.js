class CurrencyUI {
  constructor() {
    this.currency = document.getElementById('currency');
    this.dictionary = {
      USD: '$',
      EUR: '€'
    }
  }

  /**
    * получаем 'USD' || 'EUR'
  */
  get currencyValue() {
    return this.currency.value;
  }

  get currencySymbol() {
    return this.dictionary[this.currencyValue]
  }
}

const currencyUI = new CurrencyUI();

export default currencyUI;