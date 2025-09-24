export interface IJoinInfo {
  password: string,
  password_check: string,
  username: string,
  email: string,
}

export interface ILoginInfo {
  password: string,
  username: string,
  grant_type : string,
  scope : string,
  client_id : string,
  client_secret : string,
}

export interface IUsers {
  id: number;
  email: string;
  created_at : datetime;
  updated_at : datetime | null;
  address : string | null;
  phone_number : string;
  is_active : boolean;
  // 다른 사용자 정보 필드 추가
}
export interface IExtendUser extends IUsers {
  username?: string;
  user_name?: string;
}
export interface IExtendInfo extends IUsers {
  user_name: string;
  is_admin : boolean;
}
export interface IResultLogin {
  access_token: string;
  token_type:string
  username:string
  user_id:string
}

// 구매목록
export interface IPurchaseData {
  id: number,
  user_id: number,
  product_id: number,
  count: number,
  purchase_chk: boolean,
  created_at: datetime,
  updated_at: datetime,
  name: string,
  image: string,
}

// profile
export interface IProfile {
  password?: string,
  password_check?: string,
  user_name: string;
  email: string;
  address: string;
  detail_address: string;
  phone_number: string;
  zonecode : string;
  is_admin : boolean;
  is_seller : boolean;
  is_active : boolean;
}