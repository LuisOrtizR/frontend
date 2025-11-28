import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// Ant Design
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

// Registrar todos los íconos de Ant Design globalmente
import * as Icons from '@ant-design/icons-vue';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(Antd);

// Registrar cada ícono
Object.keys(Icons).forEach((key) => {
  app.component(key, (Icons as any)[key]);
});

app.mount('#app');
