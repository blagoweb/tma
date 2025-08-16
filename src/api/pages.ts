import api from "@/api/index";

export const getPages = async () => {
    try {
        const res = await api.get('/pages')
        return res.data
    } catch (e) {
        console.error('getPages error:', e)
        return null
    }
}