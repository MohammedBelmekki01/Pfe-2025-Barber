import axiosClient from "@/api/axios"

export const UserApi = {
    getCsrfToken : async () => {
        return  await axiosClient.get('/sanctum/csrf-cookie')
    },

    login : async (email : string, password : string) => {
        return await axiosClient.post('/login', {
        email: email,
        password: password,
      });
    },

    getUser : async () => {
        return await axiosClient.get('/api/me')
    },
    logout : async () => {
        return await axiosClient.post('api/logout')
    }
}
