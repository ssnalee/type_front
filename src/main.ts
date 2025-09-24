import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router/index";
import store from "@/store/index";
import "dropzone/dist/dropzone.css";
import { quillEditor } from "vue3-quill";
import VueLazyload from 'vue-lazyload';

const app = createApp(App);
app.use(VueLazyload, {
    preLoad: 1.3,
    error: require('@/assets/img/default.png'), 
    loading: require('@/assets/img/default.png'), 
    attempt: 1,
  });
app.use(store).use(router).component("QuillEditor", quillEditor).mount("#app");
