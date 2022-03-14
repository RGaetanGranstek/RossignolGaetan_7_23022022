import { createStore } from 'vuex'

// Appel le backend avec Axios pour créer un compte, se connecter et faire des requêtes authentifiées avec un token.
const axios = require('axios');
const instance = axios.create({
  baseURL: 'http://localhost:3000/api/auth/'
});
let user = localStorage.getItem('user');
if (!user) {
  user = {
    userId: -1,
    token: '',
  };
} else {
  try {
    user = JSON.parse(user);
    instance.defaults.headers.common['Authorization'] = user.token;
  } catch (ex) {
    user = {
      userId: -1,
      token: '',
    };
  }
}

// Creation d'une nouvelle instance du store.
export default createStore({
  // Vuex utilise une arborescence de state unique, c’est-à-dire que cet objet unique contient tous vos états au niveau de l’application et sert de « source unique de vérité »
  state: {
    status: '',
    user: user,
    userInfos: {
      id: '',
      nom: '',
      prenom: '',
      pseudo: '',
      email: '',
      role: '',
    },
  },
  // propriété calculées => propriété d'état du magasin
  getters: {
  },
  // La seule façon de changer d’état dans un magasin Vuex est de commettre une mutation. Les mutations De Vuex sont très similaires aux événements : chaque mutation a un type de chaîne et un gestionnaire. 
  mutations: {
    setStatus(state, status) {
      state.status = status;
    },
    logUser(state, user) {
      instance.defaults.headers.common['Authorization'] = user.token;
      localStorage.setItem('user', JSON.stringify(user));
      state.user = user;
    },
    userInfos(state, userInfos) {
      state.userInfos = userInfos;
    },
    logout(state) {
      state.user = {
        userId: -1,
        token: '',
      }
      localStorage.removeItem('user');
    }
  },
  // Les actions sont similaires aux mutations, les différences étant que => Au lieu de muter l’état, les actions commettent des mutations. et/ou Les actions peuvent contenir des opérations asynchrones arbitraires.
  actions: {
    userProfil: ({ commit }) => {
      let user = localStorage.getItem('user')
      let userId = JSON.parse(user)
      // axios.get('http://localhost:3000/api/auth/profil/' + localStorage.getItem("user.userId"))
      // axios.get('http://localhost:3000/api/auth/profil/35')
      instance.get('/profil/' + userId.userId)
        // .then((response) => {
        //   console.log(userId.userId)
        //   console.log(localStorage)
        //   console.log(response);
        //   console.log(response.data);
        // })
        // .catch(function (error) {
        //   if (error.response) {
        //     console.log(error.response.data);
        //     console.log(error.response.status);
        //     console.log(error.response.headers);
        //   }
        // });
        .then((response) => {
          commit('userInfos', response.data);
          console.log(userId.userId)
          console.log(localStorage)
          console.log(response);
          console.log(response.data);
        })
        .catch(function () {
        });
    },
    login: ({ commit }, userInfos) => {
      commit('setStatus', '');
      return new Promise((resolve, reject) => {
        instance.post('/login', userInfos)
          .then(function (response) {
            commit('setStatus', '');
            commit('logUser', response.data);
            resolve(response);
          })
          .catch(function (error) {
            commit('setStatus', 'error_login');
            reject(error);
          });
      });
    },
    signup: ({ commit }, userInfos) => {
      commit('setStatus', '');
      console.log(userInfos);
      return new Promise((resolve, reject) => {
        instance.post('/signup', userInfos)
          .then(function (response) {
            commit('setStatus', 'created');
            console.log(response);
            resolve(response);
          })
          .catch(function (error) {
            commit('setStatus', 'error_create');
            reject(error);
          });
      });
    }
  },
  // Vuex nous permet de diviser notre magasin en modules. Chaque module peut contenir son propre état, des mutations, des actions, des getters et même des modules imbriqués
  modules: {
  }
})