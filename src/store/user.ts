import { Module } from "vuex";
import userApi from "@/api/apiUser";
import purchaseApi from '@/api/apiPurchase';
import { RootState } from '@/types/index'
import { ActionContext } from 'vuex';
import { ILoginInfo, } from "@/types/user"
export interface Basket {
  id: number;
  productId?: number;
  product_image?:string;
  product_name: string;
  count: number;
  price: number;
  
}
export interface IUserStore {
  loginSuccess: boolean;
  joinFlag: number;
  basketInfo: Basket[],
  fetchStatus : number,
}


const user: Module<IUserStore, RootState> = {
  namespaced: true,
  state: (): IUserStore => ({
    loginSuccess: false,
    // flag 0 = 판매자, flag 1 = 구매자
    joinFlag: 1,
    basketInfo: [],
    fetchStatus : 0,
  }),
  mutations: {
    setLoginStatus(state: IUserStore, payload: boolean) {
      state.loginSuccess = payload;
    },
    setJoinFlag(state: IUserStore, payload: number) {
      state.joinFlag = payload;
    },
    // 장바구니 정보
    setBasketInfo(state: IUserStore, payload : Basket[]) {
      state.basketInfo = payload;
      state.basketInfo.forEach((el : Basket) =>{
        el.price = 1000;
      });
    },
    //삭제 등 http status로 에러값 구별
    setFetchStatus(state: IUserStore, payload : number) {
      state.fetchStatus = payload;
    }
  },
  actions: {
    async getLoginUser(
      { commit }: ActionContext<IUserStore, RootState>,
      info: ILoginInfo
    ) {
      try {
        const result = await userApi.loginUser(info);
        if (result.access_token) {
          const now = new Date();
          const ttl = 1800000; //로그인 만료시간 30분으로 설정
          const expire = now.getTime() + ttl;
          const userInfoObj = result;
          window.sessionStorage.setItem('userInfoObj', JSON.stringify(userInfoObj));
          commit('setLoginStatus', true);
          return result;
        }
      } catch (error) {
        return null;
      }
    },
    async getBasket({commit}: ActionContext<IUserStore, RootState>) {
      try {
        const result = await purchaseApi.viewCart();
        if(Array.isArray(result)){
          commit("setBasketInfo", result);
        }else{
          commit("setBasketInfo", []);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 장바구니 추가 api 호출
    async addBasket(
      context: ActionContext<any, RootState>,
      addBasketInfo: { productId: number; count: number }) {
      try {
        const result = await purchaseApi.addCart(
          addBasketInfo.productId,
          addBasketInfo.count
        );
        if(result){
          context.commit("setFetchStatus",result.status);
        }else{
          context.commit("setFetchStatus",400);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 장바구니 삭제 api 호출
    async delBasket(context: ActionContext<any, RootState>, basketId: number) {
      try {
        const result = await purchaseApi.deleteCart(basketId);
        if(result){
          context.commit("setFetchStatus",result.status);
        }else{
          context.commit("setFetchStatus",400);
        }
      } catch (error) {
        console.error(error);
      }
    },
    // 회원탈퇴
    async delUserInfo(context: ActionContext<any, RootState>, userId: string) {
      try {
        const status = await userApi.delOnlyUser(userId);
        context.commit("setFetchStatus",status);
      } catch (error) {
        console.error(error);
      }
    },
  }
}

export default user;
