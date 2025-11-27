export interface IProductsResult {
    created_at: datetime,
    updated_at: datetime,
    thumbnail: string,
    name: string,
    user_name? : string,
    animal_category: string,
    category: string,
    price: number,
    id : number,
    is_cart? : boolean,
    updatedNumA? : number,
    updatedNumB? : number,
    basket_id? : number,
}

export interface IProductResult {
    image: string[],
    animal_category: string,
    category: string,
    user_name?: string,
    name: string,
    price: number,
    content?: string,
    count? : number,
    is_cart? : boolean,
}
