<template>
  <div class="domestic" style="display: flex;">
    domestic app variable {{ app }}
  </div>
</template>

<script setup name="domesticIndex">
import { getCurrentInstance, reactive } from 'vue';

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
</script>
