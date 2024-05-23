<template>
  <div class="logo" style="text-align: center;">
    <img :src="app.staticURL+'static/logo.'+app.sysName+'.png'" />
  </div>
  <div class="router" style="margin:0 0 20px;">
    <li @click="handleGO('global')">global page</li>
    <li @click="handleGO('common')">common page</li>
  </div>
  <router-view />
</template>

<script setup name="App">
import { getCurrentInstance, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { proxy } = getCurrentInstance();

const app = reactive({
  staticURL: proxy.$AppEnv.staticURL,
  apiURL: proxy.$AppEnv.apiURL,
  title: proxy.$AppEnv.title,
  sysApp: proxy.$AppEnv.sysApp,
  sysName: proxy.$AppEnv.sysName,
  dist: proxy.$AppEnv.dist,
  webURL: proxy.$AppEnv.webURL,
  prod: proxy.$AppEnv.dist,
  appVersion: proxy.$AppEnv.appVersion,
});

const handleGO = (path) => {
  router.push('/'+path);
}
</script>
