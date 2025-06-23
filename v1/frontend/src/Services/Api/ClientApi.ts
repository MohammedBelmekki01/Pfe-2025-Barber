import axiosClient from "@/api/axios"

const ClientApi = {
    create : async (payload) => {
        return await axiosClient.post('/api/admin/clients', payload)
    },

    allclient : async () => {
        return await axiosClient.get('/api/admin/clients')
    },
    delete : async (id) => {
        return await axiosClient.delete(`/api/admin/clients/${id}`)
    },
    update: async (id: number, payload: any) => {
        return await axiosClient.put(`/api/admin/clients/${id}`, payload)
    },
    // to select colums
    // allDefColumn : async => {
    //     rteun await axiosClient.get('',{
    //         params : {
    //             columns: columns
    //         }
    //     })
    // }
    // to use
    // clientapi.alldefcolumn(['name','email'])

}

export default ClientApi