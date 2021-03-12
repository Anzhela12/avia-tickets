import axios from 'axios';
import config from '../config/apiConfig';


/** Entrypoints for api aviasales
 * /countries - return from server array of countries
 * /cities - return array of cities
 * /prices/cheap - return array of prices (if user choice country & city for journey)
 */
// Создаём класс, екземляр этого класа и передаём в аргумент config, там он вытащит url
// Затем експортируем
// В response содержится объект ответа от сервера через axios, сам массив стран/городов хранится в поле data, поетому мы возвращаем response.data
class Api {
  constructor(config) {
    this.url = config.url;
  }
  async countries() {
    try {
      const response = await axios.get(`${this.url}/countries`);
      return response.data;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);
    }
  }
  async cities() {
    try {
      const response = await axios.get(`${this.url}/cities`);
      return response.data;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);

    }
  }

  /**
    * Добавляем запрос на получение логотипа авиакомпании
  */
  async airlines() {
    try {
      const response = await axios.get(`${this.url}/airlines`);
      return response.data;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);

    }
  }

  /**
   * Отправляем запрос по ценам на выбраный маршрут
   * В axios мы можем передавать дополнительно свои параметры в {}
   * params - это query параметры, которые будут подставлены в url строке
   * передаём params в запрос(в дальнейшем он будет содержать данные поиска пользователей(объект) и отправлять на сервер)
   * далее работаем с методом в locations.js
   */
  async prices(params) {
    try {
      const response = await axios.get(`${this.url}/prices/cheap`, {
        params,
      });
      return response.data;
    } catch(err) {
      console.log(err);
      return Promise.reject(err);

    }
  }
}

const api = new Api(config);

export default api;
