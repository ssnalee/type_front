
import { Module } from "vuex";
import { RootState } from '@/types/index'
import { numToStrMenu } from "@/utils/common";

export interface IProductStore {
    animalTab: number,
    category_name: string,
}

const product: Module<IProductStore, RootState> = {
    namespaced: true,
    state: (): IProductStore => ({
        animalTab: 1,
        category_name: "ALL",
    }),
    mutations: {
        setAnimalTab(state: IProductStore, payload: number) {
            state.animalTab = payload;
        },
        // 선택한 카테고리
        setCtgyName(state: IProductStore, payload: string) {
            state.category_name = payload;
        },
        setFirstCtgy(state: IProductStore, payload: string) {
            state.category_name = numToStrMenu(Number(payload));
        }
    }
}

export default product;