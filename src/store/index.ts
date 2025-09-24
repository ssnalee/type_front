import { createStore } from "vuex";
import user from "./user";
import product from "./product";
import error from "./error";
import menuList from "./menuList";
import { RootState } from '@/types/index'


export default createStore<RootState>({
  modules : {
    user,
    product,
    error,
    menuList,
}
});
