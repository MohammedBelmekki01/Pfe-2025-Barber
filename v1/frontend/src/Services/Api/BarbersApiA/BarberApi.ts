import axiosClient from "@/api/axios"

const BarberApiii = {
    create : async (payload) => {
        return await axiosClient.post('/api/admin/barbers', payload)
    },

    allBarbers : async () => {
        return await axiosClient.get('/api/admin/barbers')
    },
    delete : async (id) => {
        return await axiosClient.delete(`/api/admin/barbers/${id}`)
    },
    update: async (id: number, payload: any) => {
        return await axiosClient.put(`/api/admin/barbers/${id}`, payload)
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
    // barber.alldefcolumn(['name','email'])

}

export default BarberApiii