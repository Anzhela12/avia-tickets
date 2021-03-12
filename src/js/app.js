import '../css/style.css';
import './plugins';
import locations from './store/locations';
import favoritesStore from './store/favorites';
import formUI from './views/form';
import currencyUI from './views/currency';
import ticketsUI from './views/tickets';
import favoritesUI from './views/favoritesUI';

//Вешаем всю инициализацию приложения на событие загрузки страницы, и когда документ загрузится, будут выполнятся скрипты внутри
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  const form = formUI.form;
  const ticketsSection = document.querySelector('.tickets-sections');
  const dropdDownTrig = document.querySelector('.dropdown-trigger')
  const dropdown = document.getElementById('dropdown1');

  // console.log(btnFav)

  // EVENTS

  /**
    * Вешаем событие на форму
    * e.preventDefault() убирает перезагрузку страницы
    * onFormSubmit() - наш обработчик события
  */
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    onFormSubmit()

  });

  ticketsSection.addEventListener('click', (e) => {
    console.log(e.target);// Любой елемент на который кликнули
    let currentBtn = e.target.dataset.identify;
    locations.serializeFavTickets(locations.lastSearch, currentBtn);
  });









  //   const [...addToFavoritesBtn] = document.querySelectorAll('.add-favorite');
  //   addToFavoritesBtn.forEach(btn => {
  //     btn.addEventListener('click', (e) => {
  //       e.preventDefault();
  //       const currentBtn = e.target;
  //       const ticketCard = currentBtn.parentElement;

  //       ticketsArr.forEach(ticket => {
  //         console.log(ticket);
  //       });

  //       const currentTicketId = ticketCard.getAttribute('id');
  //       console.log(currentTicketId);





  //       ticketCard.classList.toggle('favorite-ticket');

  //         currentBtn.classList.toggle('color-red');
  //         currentBtn.classList.toggle('green');

  //         if(ticketCard.classList.contains('favorite-ticket')) {
  //           console.log(ticketCard);
  //           currentBtn.innerHTML = 'Remove from Favorites';
  //           favoritsStore.saveFavoriteTicket(ticketCard);
  //         } else {
  //           currentBtn.innerHTML = 'Add to Favorites';
  //         }


  //       console.log(ticketCard);
  //       console.dir(ticketCard);
  //     })
  //   });


  // HANDLERS

  /**
    * Фун-я инициализации приложения
    * будет асинхронной, так как отправляем запросы к серверу
    * получаем объект locations со странами и городами в удобном формате
    * вызываем метод формы для автокомплита и передаём объект ответа от сервера (свойство со списком городов из объекта-ответа locations, который мы обработали заранее)
    * вызываем фун-ю initApp() перед её объявлением
  */
  async function initApp() {
    await locations.init();
    formUI.setAutoCompleteData(locations.shortCitiesList);// появляются подсказки городов в инпуте
  }

  // function addTicketsToFavorites(tickets) {
  //   favoritesUI.getFavoritsTickets(tickets);
  // }

  /**
    * Создаём обработчик для события формы
    * Собираем данные из инпутов (в form.js мы создали геттеры для получения значения каждого инпута)
    * переменные объявляем так, как они выводятся в ответе сервера, чтобы их правильно считали(напр. return_date)
    * Нужно правильно преобразовать данные для отправки на сервер:
    * Код города отправки, Код города прибытия, дата отправки(2020-11), дата прибытия(2020-12) - год и месяц
    * Для получения кода страны из строки, берём метод getCityCodeByInputValue из location.js
    * Формат даты выставляем в Materialize.js
    * Вызываем метод для отправки запроса пользавателя на сервер fetchTickets()
  */
  async function onFormSubmit() {
    const origin = locations.getCityCodeByInputValue(formUI.originValue);
    const destination = locations.getCityCodeByInputValue(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currencyValue;

    console.log(origin, destination, depart_date, return_date);// ODS IEV 2021-02 2021-02

    await locations.fetchTickets({ // получили ответ от сервера в виде билетов на нужные даты
      origin,
      destination,
      depart_date,
      return_date,
      currency,

    });

    // console.log(locations.lastSearch);
    ticketsUI.renderTickets(locations.lastSearch);
  }

});















