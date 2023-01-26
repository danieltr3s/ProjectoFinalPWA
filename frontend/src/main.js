import { createApp } from 'vue';
import App from './App.vue';
import store from "./store";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faListUl, faPlus, faXmark, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { faCircle, faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import autobahn from 'autobahn-browser'

library.add(faListUl);
library.add(faPlus);
library.add(faXmark);
library.add(faShareNodes);
library.add(faCircle);
library.add(faCircleCheck);

var wampHost = window.location.host;
if(process.env.NODE_ENV === 'development')
    wampHost = window.location.host.replace(":5173", ":80");
console.log('Connect to:  wss://' + wampHost + '/ws');
var wamp = new autobahn.Connection({ url: 'wss://' + wampHost + '/ws', realm: 'realm1' });
wamp.open();

const app = createApp(App);

app.use(store);
app.component('font-awesome-icon', FontAwesomeIcon);
app.config.globalProperties.$wamp = wamp;

app.mount('#app');
