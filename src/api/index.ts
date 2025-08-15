import axios from 'axios'
import {getAuthKey} from "@/helperts/storage";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE}/api/v1`,
})


api.interceptors.request.use(
    (config) => {
        const authKey = getAuthKey()
        config.headers['Authorization'] = authKey ? `Bearer ${authKey}` : ''
        config.headers['Content-Type'] = 'application/json'
        return config
    }
)


export default api
