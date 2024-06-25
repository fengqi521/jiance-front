const user = {
    state: {
        uid: Cookies.get('SuserId'),
        userInfo: Cookies.get('Pusername'),
        roleType: localStorage.getItem('USER_ROLE_TYPE'),
    },

    mutations: {
        SET_UID: (state, uid) => {
            state.uid = uid;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_ROLE_TYPE: (state, roleType) => {
            state.roleType = roleType;
            localStorage.setItem("USER_ROLE_TYPE", roleType);
        },

        LOGIN_SUCCESS: () => {
            console.log('login success')
        },
    }
};

export default user;
