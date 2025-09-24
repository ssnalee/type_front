import { IErrorStore } from '@/store/error';
import { IMenuListStore } from '@/store/menuList';
import { IProductStore } from '@/store/product';
import { IUserStore } from '@/store/user'; 

export interface RootState {
  login: IUserStore; 
  product: IProductStore;
  error: IErrorStore;
  menuList: IMenuListStore;
}
export interface IBanner{
  backgroundImage : string,
  color : string
}

export interface IImage{
  backgroundImage? : string,
  color? : string,
  image? : string,
  product_image? : string,
  product_name? : string,
  name? : string,
  count? : number,
  price? : number,
  animal_category? :string,
  category? :string,
  id? :number,
  is_active? : boolean,
}