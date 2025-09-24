
import { Module } from "vuex";
import { RootState } from '@/types/index'
import catImage from "@/assets/img/products/category_cat.png";
import dogImage from "@/assets/img/products/category_dog.png";
export interface IMenu {
    key: number;
    label: string;
    is_admin?: boolean;
    is_sell?: boolean;
    is_active: boolean;
    path?:string;
    image? : string;
    is_beta? : boolean;
}
export interface IMenuListStore {
    menu: IMenu[];
    subMenu: IMenu[];
    detailMenu : IMenu[];
}
const menuList: Module<IMenuListStore, RootState> = {
    namespaced: true,
    state: (): IMenuListStore => ({
        menu: [
            {
                key: 0,
                label: 'ALL',
                is_admin: false,
                is_sell: false,
                is_active: false,
                path : '/products/',
            },
            {
                key: 1,
                label: '사료',
                is_admin: false,
                is_sell: false,
                is_active: false,
                path : '/products/1',
            },
            {
                key: 2,
                label: '간식',
                is_admin: false,
                is_sell: false,
                is_active: false,
                path : '/products/2',
            },
            {
                key: 3,
                label: '장난감',
                is_admin: false,
                is_sell: false,
                is_active: false,
                path : '/products/3',
            },
            {
                key: 4,
                label: '노즈워크',
                is_admin: false,
                is_sell: false,
                is_active: false,
                path : '/products/4',
            },
            {
                key: 5,
                label: '케어용품',
                is_admin: false,
                is_sell: false,
                is_active: false,
                path : '/products/5',
            },
            {
                key: 6,
                label: '계절상품',
                is_admin: false,
                is_sell: false,
                is_active: false,
                path : '/products/6',
            },
            {
                key: 7,
                label: '기타용품',
                is_admin: false,
                is_sell: false,
                is_active: false,
                path : '/products/7',
            },
            {
                key: 8,
                label: '상품/재고 관리',
                is_admin: true,
                is_sell: false,
                is_active: false,
                path : '/manage/products',
            },
            // {
            //     key: 9,
            //     label: '주문/결제 관리',
            //     is_admin: true,
            //     is_sell: false,
            //     is_active: false,
            //     path : '/manage/orders',
            // },
            {
                key: 10,
                label: '사용자 관리',
                is_admin: true,
                is_sell: false,
                is_active: false,
                path : '/manage/users',
            },
        ],
        subMenu: [
            {
                key: 0,
                label: 'ALL',
                is_active: true,
            },
            {
                key: 1,
                label: '고양이',
                is_active: false,
                image : catImage,
            },
            {
                key: 2,
                label: '강아지',
                is_active: false,
                image : dogImage
            }
        ],
        detailMenu : [
            {
                key:0,
                label: '상세정보',
                is_active: true,
                is_beta : false,
            },
            {
                key:1,
                label: '리뷰',
                is_active: false,
                is_beta : true,
            },
            {
                key:2,
                label: '상품Q&A',
                is_active: false,
                is_beta : true,
            },
            {
                key:3,
                label: '판매자 정보',
                is_active: false,
                is_beta : true,
            }
        ],
    }),
    mutations: {
        setActiveMenu : (state,payload : number) => {
            state.menu.forEach((item)=>{
                item.is_active = item.key === payload;
            });
        },
        setActiveSubMenu : (state,payload) =>{
            state.subMenu.forEach((item)=>{
                item.is_active = item.key === payload;
            });
        },
        setActiveDetailMenu : (state,payload) =>{
            state.detailMenu.forEach((item)=>{
                item.is_active = item.key === payload;
            });
        },
    },
    actions: {
        handleApiError({ commit }, payload) {
            commit("setApiError", payload);
        }
    },
    getters: {
        userMenuList: (state) => {
            return state.menu.filter((item) => !item.is_sell && !item.is_admin);
        },
        sellerMenuList: (state) => {
            return state.menu.filter((item) => item.is_sell);
        },
        adminMenuList: (state) => {
            return state.menu.filter((item) => item.is_admin);
        },
        subMenuList: (state) => {
            return state.subMenu;
        },
        activeMenu : (state) => {
            return state.menu.find((item)=>item.is_active);
        },
        activeSubMenu : (state) => {
            return state.subMenu.find((item)=>item.is_active);
        },
        category : (state) => {
            return state.menu.map((item)=>item.label).slice(1);
        },
        animalCategory : (state) => {
            return state.subMenu.map((item)=>item.label).slice(1);
        },
        detailMenuList :(state) => {
            return state.detailMenu;
        }
    }
}

export default menuList; 