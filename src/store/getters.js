
const getters = {
    uid: state => state.user.uid,     //用户id
    token: state => state.user.token, //用户令牌
    userInfo: state => state.user.userInfo,//用户所有信息
    roleType: state => state.user.roleType,//用户角色类型

    sidebar: state => state.app.sidebar,
    switchStatus: state => state.app.switchStatus,
    visitedViews: state => state.app.visitedViews, //快速导航tab

    permissions: state => {
        // 权限
        return state.permission.permissions;
    },
    menus: state => {
        // 菜单
        return state.permission.menus;
    },
    addRouters: state => state.permission.addRouters
};
export default getters
