const permission = {
    state: {
        menus: localStorage.getItem("USER_MENU"),
        permission: localStorage.getItem("USER_PERMISSION"),
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            console.log('SET_ROUTERS', routers)
            state.routers = routers;
        },
        SET_MENU: (state, menus) => {
            state.menus = menus;
        },
    }
};

export default permission;
