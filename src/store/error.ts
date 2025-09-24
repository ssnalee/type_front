
import { Module } from "vuex";
import { RootState } from '@/types/index'

export interface IErrorStore {
    apiError : any,
    errorPath : string,
}

const error: Module<IErrorStore, RootState> = {
    namespaced: true,
    state: (): IErrorStore => ({
        apiError : {},
        errorPath : "",
    }),
    mutations: {
        setApiError(state,payload) {
            state.apiError = payload.error;
            state.errorPath = payload.path;
        }
    },
    actions : {
        handleApiError({commit}, payload){
            commit("setApiError",payload);
        }
    }
}

export default error; 