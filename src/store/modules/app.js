const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus')
    },
    switchStatus:!+Cookies.get('online_status'), 
    theme: 'default',
    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
    visitedViews: [],
    customColor: '#D3B050', //全局，批量导入进度条-动态变化颜色
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1);
          } else {
            Cookies.set('sidebarStatus', 0);
          }
      state.sidebar.opened = !state.sidebar.opened;
    },
    TOGGLE_SWITCH: state => {
        if (state.switchStatus) {
            Cookies.set('online_status', 1);
        } else {
             Cookies.set('online_status', 0);
           }
        state.switchStatus = !state.switchStatus
    },
    ADD_VISITED_VIEWS: (state, view) => {
      if (state.visitedViews.includes(view)) return
      state.visitedViews.push(view)
    },
    DEL_VISITED_VIEWS: (state, view) => {
      const index = state.visitedViews.indexOf(view)
      state.visitedViews.splice(index, 1)
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    ToggleSwitch: ({ commit }) => {
      commit('TOGGLE_SWITCH')
    },
    addVisitedViews: ({ commit }, view) => {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews: ({ commit }, view) => {
      commit('DEL_VISITED_VIEWS', view)
    }
  }
};

export default app;
