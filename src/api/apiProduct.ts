import { IPostProduct, IProductResult, IProductsResult } from "@/types/product";
import { API } from "./apiAuth";
// import { ApiResponse } from "@/types/api";


// // 상품 정보 전체 조회 api 호출
const viewAllProduct = async (user_id : number | null): Promise<IProductsResult[]> => {
  try {
    if(user_id){
      const response = await API.get<IProductsResult[]>(`product/?user_id=${user_id}`);
      return response.data; 
    }else{
      const response = await API.get<IProductsResult[]>("product/");
      return response.data; 
    }

  } catch (error) {
    console.error(error);
    return []; 
  }
};


// 개별 상품 조회 api 호출
const viewIndividualProduct = async (product_id : string) : Promise<IProductResult | null> => {
  try {
    const response = await API.get<IProductResult>(`product/${product_id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// 상품 등록 api 호출
const postProduct = async (user_id : string, productData : IPostProduct) => {
  try {
    const response = await API.post(`product/?product_id=${user_id}`, productData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 상품 수정 api 호출
const editProduct = async (product_id : number, productData : IPostProduct) => {
  try {
    const response = await API.put(`product/${product_id}`, productData);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// // 상품 삭제 api 
// const deleteProduct = async (product_id) => {
//   try {
//     const response = await API.delete(`product/${product_id}`);
//     return response.data;
//   } catch (error) {
//     console.error(error);
//   }
// };

// 동물 카테고리 조회 api 호출
const getAnimalCategory = async () : Promise<string[]>=> {
  try {
    const response = await API.get<string[]>("category/pet");
    return response.data;
  } catch (error) {
    return [];
  }
};




export default {
  viewAllProduct,
  viewIndividualProduct,
  postProduct,
  editProduct,
//   deleteProduct,
  getAnimalCategory,
};
