import favoritesUI from '../views/favoritesUI';


class FavoritesStore{
  constructor() {
    this.store = {}
  }

  getFavTicket(ticket) {
    console.log(ticket);
    favoritesUI.getFavoritsTickets(ticket);
  }
}

const favoritesStore = new FavoritesStore();

export default favoritesStore;