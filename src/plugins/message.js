import Main from 'components/sf-message.vue';
const MessageConstructor = Vue.extend(Main);
let instances = [];
let seed = 1;
let nextZIndex = 20000;
let Message_type = ['succsss', 'warning', 'info', 'error'];

function close(id, userOnClose) {
    let len = instances.length;
    let index = -1;
    let removedHeight;
    for (let i = 0; i < len; i++) {
        if (id === instances[i].id) {
            removedHeight = instances[i].$el.offsetHeight;
            index = i;
            if (typeof userOnClose === 'function') {
                userOnClose(instances[i]);
            }
            instances.splice(i, 1);
            break;
        }
    }
    if (len <= 1 || index === -1 || index > instances.length - 1) return;
    for (let i = index; i < len - 1; i++) {
        let dom = instances[i].$el;
        dom.style['top'] =
            parseInt(dom.style['top'], 10) - removedHeight - 16 + 'px';
    }
}

const Message = function (options) {
    if (Vue.prototype.$isServer) return; 
    options = options || {};
    if (typeof options === 'string') {
        options = {
            message: options
        };
    }
    let id = 'message_' + seed++;
    let verticalOffset = document.documentElement.clientHeight / 2;
    let userOnClose = options.onClose;
    options.onClose = function () {
        close(id, userOnClose);
    };
    const instance = new MessageConstructor({ data: options })   //创建子实例
    instance.$mount(document.createElement('div')) //挂载实例到我们创建的DOM上
    document.body.appendChild(instance.$el)
    instance.id = id;
    instances.forEach(item => {
        verticalOffset += item.$el.offsetHeight + 16;
    });
    instance.visible = true;
    instance.$el.style.zIndex = nextZIndex++;
    instance.verticalOffset = verticalOffset;
    instances.push(instance);

    return instance;
}

Message_type.forEach(type => {
    Message[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options
            };
        }
        options.type = type;
        return Message(options);
    }
})

export default Message;