import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
String.prototype.replaceAll = function (s1, s2) {
  return this.replace(new RegExp(s1, 'gm'), s2);
};
import { AppEnv } from '@utils/AppEnv';

const app = createApp(App);
app.config.globalProperties.$AppEnv = AppEnv;
app.use(router);
app.mount('#app');
