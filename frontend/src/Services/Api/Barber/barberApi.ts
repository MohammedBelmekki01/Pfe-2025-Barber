import axiosClient from "@/api/axios"

export const BarberApi = {
    getCsrfToken : async () => {
        return  await axiosClient.get('/sanctum/csrf-cookie')
    },

    login : async (email : string, password : string) => {
        return await axiosClient.post('/api/login', {
        email: email,
        password: password,
      });
    },

    getUser : async () => {
        return await axiosClient.get('/api/user')
    },
    logout : async () => {
        return await axiosClient.post('api/logout')
    }
}
