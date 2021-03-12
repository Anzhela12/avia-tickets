import api from '../services/apiService';
import { formatDate } from  '../helpers/date.js';
import currencyUI from '../views/currency';
import favoritesStore from './favorites';

class Locations {
// на старте ставим null, ниже присвоим значение после выполнения промиса(Promise.all)
// helpers для даты
  constructor(api, helpers, currency) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCitiesList = {};
    this.lastSearch = {};
    this.airlines = {};
    this.formatDate = helpers.formatDate;
    this.currency = currency;
    console.log(this.currency)
  }

  /**
   * получаем города и страны из apiService
   * разделяем ответ(response) отдельно на страны и города (деструктуризация)
   * полученые данные при деструктуризации присваиваем в поля страны и города, оборачиваем в метод, который ниже, для того чтобы получить нужный формат объекта
   */
  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines()
    ]);

    const [countriesRes, citiesRes, airlinesRes] = response; // { countries {...}, cities {...} }
    // console.log(airlinesRes);
    this.countries = this.serializeCountries(countriesRes); // {'UA' : {...}}
    this.cities = this.serializeCities(citiesRes); // {"IEV": {...поля с инфой о городе, country_name: "Украина", full_name: "Киев, Украина"}}
    this.shortCitiesList = this.createShortCitiesList(this.cities); // 'Kyiv, Ukraine', 'Уосо, США' ...
    this.airlines = this.serealizeAirlines(airlinesRes);
    console.log(this.airlines);
    return response;

  }

  /**
   * 12
   * Метод для app.js в form submit event
   * Получаем отдельно код выбранного города
   * Метод нужен для реализации отправки данных с формы на сервер в app.js
   * Метод Object.values() выводит все значения ключей в виде массива (будет выводиться массив вложенных объектов с инфой о городе)
   * Метод find выведет тот объект, у которого свойство full_name будет равным значению 'key'
   */
  getCityCodeByInputValue(inputValue) {
    // console.log(key);
    // console.log(Object.values(this.cities));// {IEV: {code: IEV, fullName: 'Киев Украина', ...}} => [{code: IEV, fullName: 'Киев Украина', country_name: 'Украина'}, {...}]
    const city = Object.values(this.cities).find((item) => {
      return item.full_name === inputValue;
    });
    return city.code;
  }

  /** 6
   * Работаем с {"IEV": {...поля с инфой о городе name: 'Киев', country_name: "Украина", full_name: "Киев, Украина"}}
   * Должны получить 'Киев'
   * Метод получения имени города
   * Так как при получении билетов(метод fetchTickets()) мы получаем в {} код города, нам нужно полное название
   * Теперь указываем полное имя города при получении билетов в fetchTickets()
   */
  getCityNameByCode(code) {
    return this.cities[code].name; // this.cities['IEV'].name => 'Киев'
  }

  /** 8
   * Работаем с { DN: {name: "Norwegian Air", code: "DN", name_translations: {…}, logo: "http://pics.avs.io/200/200DN.png"} }
   * Должны получить 'http://pics.avs.io/200/200/DN.png'
   * принимает код авиакомпании как параметр (напр "PS")
   * иногда бывает, что логотип авиакомпании отсутствует
   * поэтому делаем проверку через тернарники (возвращаем или логотип(ссылку), или пустую строку)
   */
  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : '';
  }

  /** 9
   * Работаем с { DN: {name: "Norwegian Air", code: "DN", name_translations: {…}, logo: "http://pics.avs.io/200/200DN.png"} }
   * Должны получить "Norwegian Air"
   * Метод будет возвращать логотип авиакомпании
   */
  getAirlineNameByCode(code) {
    return this.airlines[code].name ? this.airlines[code].name : '';
  }

  /** 13
   * Работаем с [{...ticket_info}, {...ticket_info}],
   * Нужно вытащить из {...ticket_info} свойство id
   *
   *
   */
  // getTicketById(ticket) {
  //   return ticket.ticketId;
  // }

  serializeFavTickets(ticketsArr, ticketBtnId) {
    ticketsArr.forEach(ticket => {
      // console.log(ticket.ticketId);
      if(ticket.ticketId == ticketBtnId) {
        console.log(ticket);
        // return ticket;
        favoritesStore.getFavTicket(ticket);
      }
    })
  }

  /** 4
   * Автокомплит(Автозаполнение)
   * Работаем с {"IEV": {...поля с инфой о городе, country_name: "Украина", full_name: "Киев, Украина"}}
   * Нужно вытащить 'Киевб Украина'
   * отправляем на перебор reduce : Object.entries => ['key', 'value'], оставляем только [value](это будет внутренний объект, вытаскиваем из него значение full_name)
   * Object.entries => ['IEV', {..., country_name: "Украина", full_name: "Киев, Украина"}}]
   */
  createShortCitiesList(cities) {
    return Object.entries(cities).reduce((acc, [, city]) => {
      // console.log(key); // 'Киев, Украина', 'Уосо, США' ...
      acc[city.full_name] = null;
      return acc; // пока null, потом при вводе юудут подсказки 'Киев, Украина', 'Уосо, США' ...
    }, {});
  }

  /** 1
   * Работаем с [{code: "UA", name: "Украина", currency: "UAH", name_translations: {…}, cases: {…}}, {...}]
   * Нужно преобразовать в {{'UA' : {code: "UA", name: "Украина", currency: "UAH", name_translations: {…}, cases: {…}, {...}}
   * Создаём как аккумулятор пустой объект - , {});
   * acc[oneCountry.code] - это будет имя ключа в каждом объекте, oneCountry - будет вложенным объектом с полной инфой
   */
  serializeCountries(countries) {
    return countries.reduce((acc, oneCountry) => {
      acc[oneCountry.code] = oneCountry; // {'UA' : {...}}
      return acc;
    }, {});
  }

  /** 3
   * Работаем с [{country_code: "UA", code: "IEV", coordinates: {…}, name: "Киев", time_zone: "Europe", …}, {...}]
   * Нужно преобразовать в {"IEV": {...поля с инфой о городе, country_name: "Украина", full_name: "Киев, Украина"}}
   * находим имя страны через объект одного города(его свойства - country_code)
   * проверка, если нет ключа name(null), заменить на другой ключ
   * находим ключ для каждого города('City name, Country name' )
   * acc[oneCity.code] = {...};// acc[oneCity.code] - это будет имя ключа в каждом объекте, oneCity - будет вложенным объектом с полной инфой
   * забрасываем в новый объект копию города + 2 новых свойства
   */
  serializeCities(cities) {
    return cities.reduce((acc, oneCity) => {
      const country_name = this.getCountryNameByCountryCode(oneCity.country_code);// 'Украина'
      const city_name = oneCity.name || oneCity.name_translations.en;// 'Киев'
      const full_name = `${city_name}, ${country_name}`;// 'Киевб Украина'
      acc[oneCity.code] = {
        ...oneCity,
        country_name,
        full_name
      }; // {"IEV": {...поля с инфой о городе, country_name: "Украина", full_name: "Киев, Украина"}}

      return acc;
    }, {});
  }

  /** 7
   * Работаем с [{name: "Norwegian Air", code: "DN", name_translations: {…}, logo: "http://pics.avs.io/200/200DN.png"}]
   * Должны получить {DN: {name: "Norwegian Air", code: "DN", name_translations: {…}, logo: "http://pics.avs.io/200/200DN.png"}}, ...
   * Подставляем в адрес логотипа картинки код авиакомпании
   * Меняем свойства logo и name
   * не забываем возвращать acc :)))
   */
  serealizeAirlines(airlines) {
    return airlines.reduce((acc, oneAirline) => {
      oneAirline.logo = `http://pics.avs.io/200/200/${oneAirline.code}.png`;
      oneAirline.name = oneAirline.name || oneAirline.name_translations.en;
      acc[oneAirline.code] = oneAirline;// {'DN' : {...}}
      return acc;
    }, {});
  }

  /** 2
   * Работаем с {{'UA' : {code: "UA", name: "Украина", currency: "UAH", name_translations: {…}, cases: {…}, {...}}
   * Нужно вытащить 'Украина'
   * Вытаскиваем из объекта countries название страны по её коду
   * Находим имя страны подставляя код страны ('UA'.name = Украина)
   */
  getCountryNameByCountryCode(code) {
    return this.countries[code].name; // Украина
  }

  /** 10
   * Отправляем запрос на сервер с билетами
   * вызываем у api метод prices и передаём params (будут передаваться выбранные данные пользователя)
   * преобразовываем ответ через обработчик serializeTickets()
   * далее работаем с методом в app.js
   */
  async fetchTickets(params) {
    const response = await this.api.prices(params);
    this.lastSearch = this.serializeTickets(response.data);// 2021-02-10: {origin: "IEV", destination: "ODS", price: 121, transfers: 0, airline: "7W", …}
    console.log(this.lastSearch);
  }

  /** 11
   * Работаем с { 2021-02-10: {origin: "ODS", destination: "IEV", price: 443, transfers: 1, airline: "TK", …} }
   * Должны получить и дополнить [ { инфа рейса + , airline_logo: "http://pics.avs.io/200/200FZ.png", airline_name: "Flydubai", destination_name: "Одесса", origin_name: "Киев"}, {...} ]
   * Object.values => [{ticket-info}, {ticket-info}]
   * map - будет обрабатывать каждый вложеный объект билета
   * Изменяем дату в удобный формат
   */
  serializeTickets(tickets) {
    return Object.values(tickets).map(oneTicket => {
      // console.log(oneTicket)// {ticket-info}
      return {
        ...oneTicket,
        origin_name: this.getCityNameByCode(oneTicket.origin),
        destination_name: this.getCityNameByCode(oneTicket.destination),
        airline_logo: this.getAirlineLogoByCode(oneTicket.airline),
        airline_name: this.getAirlineNameByCode(oneTicket.airline),
        departure_at: this.formatDate(oneTicket.departure_at, 'dd MMM yyyy hh:mm'),
        return_at: this.formatDate(oneTicket.return_at, 'dd MMM yyyy hh:mm'),
        currency: this.currency.currencySymbol,
        ticketId: Math.random(),
      }
    })
  }

}

const locations = new Locations(api, { formatDate }, currencyUI);

export default locations;