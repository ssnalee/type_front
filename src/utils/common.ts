import router from "@/router";
import { IProductsResult } from "@/types/product";
//현재 시간과 sessionStorage 시간 비교;
export function getItemWithExpireTime(keyName : string) {
  const objString = window.sessionStorage.getItem(keyName);
  if (!objString) return null;
  const obj = JSON.parse(objString);
  if (Date.now() > obj.expire) {
    window.sessionStorage.removeItem(keyName);
    router.push("/login");
    // return null;
  }
  return obj;
}

// 숫자 , 찍기
export function commonNumber(paramNum : number) {
  return Number(paramNum).toLocaleString();
}

// 이메일 형식 유효성 체크
export function emailCheck(email : string) {
  const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
  if (!email_regex.test(email) && email.length < 30) return false;
  else return true;
}

// 이름 형식 유효성 체크
export function nameCheck(name : string) {
  // 한글, 영어, 숫자만 가능
  const name_regex = /^[가-힣a-zA-Z0-9]{2,15}$/;
  if (name_regex.test(name)) return true;
  else return false;
}

// 비밀번호 형식 유효성 체크
export function passwordCheck(password :string, password_check : string) {
  // 8자~16자,대문자or소문자숫자+특수문자
  const pwd_regex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&#.~_-])[A-Za-z\d@$!%*?&#.~_-]{8,16}$/;
  if (pwd_regex.test(password) && password === password_check) return true;
  else return false;
}

// 핸드폰 번호 형식 유효성 체크
export function phoneCheck(phone_number : string) {
  // 01로 시작, (0,1,6,7,8,9 중 하나의 문자) 숫자만 3~4길이, 숫자만 4길이
  const phone_regex = /^01([0|1|6|7|9])([0-9]{3,4})([0-9]{4})$/;
  if (phone_regex.test(phone_number)) return true;
  else return false;
}

// 데이터 소팅하기
// 만든날짜, 업데이트날짜를 기준으로 최근과 가까운 날짜 순
export function sortData(data : IProductsResult[]) {
  let sortArr = [];
  const pattern = /[\D]/gi;
  sortArr = data.sort((a :IProductsResult, b :IProductsResult) => {
    const createdNumA = a.created_at.replaceAll(pattern, "");
    const updatedNumA =
      a.updated_at == null
        ? a.updated_at
        : a.updated_at.replaceAll(pattern, "") | 0;
    const createdNumB = b.created_at.replaceAll(pattern, "");
    const updatedNumB =
      b.updated_at == null
        ? b.updated_at
        : b.updated_at.replaceAll(pattern, "") | 0;
    const amax = createdNumA > updatedNumA ? createdNumA : a.updatedNumA;
    const bmax = createdNumB > updatedNumB ? createdNumB : a.updatedNumB;
    return amax < bmax ? 1 : amax > bmax ? -1 : 0;
  });
  return sortArr;
}

export function imageCheck(imgSrc:string) {
  const file_regex = /(.*?)\.(jpg|jpeg|png|gif|bmp|pdf)$/;
  const base64_regex = /data:image\/(.+)[^"]/;
  if (!imgSrc) {
    return require("@/assets/img/default.png");
  }
  if (file_regex.test(imgSrc) || base64_regex.test(imgSrc)) {
    return imgSrc;
  }
  else {
    return require("@/assets/img/default.png");
  }
}

export function pagingFn (currPage : number, str : string | number) : number {
  if (str == "prev") return currPage - 1;
  else if (str == "next") return currPage + 1;
  else if(typeof str === "number") return str;
  return currPage;
}

export function numToStrMenu (num : number){
  let str;
  switch(num){
    case 1 : str = "사료";
    break;
    case 2 : str = "간식";
    break;
    case 3 : str = "장난감";
    break;
    case 4 : str = "노즈워크";
    break;
    case 5 : str = "케어용품";
    break;
    case 6 : str = "계절상품";
    break;
    case 7 : str = "기타용품";
    break;
    default : str = "ALL";
  }
  return str;
}

export const categoryKey = (category : string) => {
  switch(category){
    case '사료' : return 'category_01';
    case '간식' : return 'category_02';
    case '장난감' : return 'category_03';
    case '노즈워크' : return 'category_04';
    case '케어용품' : return 'category_05';
    case '계절상품' : return 'category_06';
    case '기타용품' : return 'category_07';
    default : return 'category_01'; 
  }
}