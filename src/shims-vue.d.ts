// /* eslint-disable */
// declare module '*.vue' {
//   import type { DefineComponent } from 'vue'
//   const component: DefineComponent<{}, {}, any>
//   export default component
// }
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare module 'vue3-carousel' {
  import { DefineComponent } from 'vue';
  const Carousel: DefineComponent<any, any, any>;
  const Slide: DefineComponent<any, any, any>;
  export { Carousel, Slide };
}
declare module "*.png" {
  const value: string;
  export default value;
}