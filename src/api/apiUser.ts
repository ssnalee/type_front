import { API } from "./apiAuth";
import { AxiosError } from 'axios';
import { IJoinInfo, ILoginInfo, IResultLogin, IProfile, IExtendInfo, IExtendUser } from "@/types/user"
import { ApiResponse } from "@/types/api";
// password,password_check,username,email
// 회원가입 api 호출

const joinUser = async (info: IJoinInfo): Promise<ApiResponse<any> | undefined> => {
    try {
        const response = await API.post<ApiResponse<any>>(`user/create`, info);
        return response.data;
    } catch (error) {
        const err = error as AxiosError;
        if (err.response) {
            const data = err.response.data as ApiResponse;
            if (err.response.status === 409) {
                alert(data.detail)
            } else {
                console.error(err.response);
            }
        }
    }
}

// 로그인 api 호출
const loginUser = async (info: ILoginInfo): Promise<IResultLogin> => {
    try {
        const curi = `grant_type=${info.grant_type}&username=${info.username}&password=${info.password}&scope=${info.scope}&client_id=${info.client_id}&client_secret=${info.client_secret}`;
        const response = await API.post<IResultLogin>(`user/login`, curi);
        return response.data;
    } catch (error) {
        // const err = error as AxiosError;
        // if (err.response) {
        //     const data = err.response.data as ApiResponse;
        //     if (err.response.status === 401) {
        //         alert(data.detail)
        //     } 
        // }
        // return {
        //     success: false,
        //     message: 'Login failed due to an error',

        // };
        throw new Error('erorr');
 
    }
}


// 회원 정보 전체 조회 api 호출
const getUsers = async (): Promise<IExtendUser[]> => {
    try {
        const response = await API.get<ApiResponse<IExtendUser[]>>(`user/`);
        return response.data.data;
    } catch (error) {
        throw new Error('Unexpected error occurred');
    }
}

// 특정 회원 정보 조회 api 호출
const getOnlyUser = async (user_id: string) : Promise<IExtendInfo[]> => {
    try {
        const response = await API.get<ApiResponse<IExtendInfo[]>>(`user/?user_id=${user_id}`);
        return response.data.data;
    } catch (error) {
        throw new Error(`error`);
    }
}

// 회원 정보 수정 api 호출
const putOnlyUser = async (user_id: string, info : IProfile) => {
    try {
        const response = await API.put(`user/${user_id}`, info);
        return response.data;
    } catch (error : any) {
        if(error.response.data.detail.includes('user.user_name')){
            return {errorMsg : "중복된 아이디입니다."}
        }else if(error.response.data.detail.includes('userinfo.phone_number')){
            return {errorMsg : "중복된 핸드폰번호입니다."}
        }
        console.error(error);
    }
}

// 회원 정보 삭제 api 호출
const delOnlyUser = async (user_id: string) : Promise<number> => {
    try {
        const response = await API.delete<ApiResponse<any>>(`user/${user_id}`);
        return response.status;
    } catch (error : any) {
        return error.response ? error.response.status : 404;
    }
}
export default {
    joinUser,
    loginUser,
    getUsers,
    getOnlyUser,
    putOnlyUser,
    delOnlyUser,
};