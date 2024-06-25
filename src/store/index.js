import app from './modules/app'; 
import user from './modules/user';
import permission from './modules/permission';
import getters from './getters';


const store = new Vuex.Store({
  modules: {
    app, 	
    user,
    permission
  },
  getters
});

export default store
