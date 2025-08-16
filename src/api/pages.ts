import api from "@/api/index";
import exampleJSONData from "@/mocks/exampleJSONData.json";

export const getPages = async () => {
    try {
        const res = await api.get('/pages')
        return res.data
    } catch (e) {
        console.error('getPages error:', e)
        return []
    }
}

export const addPage = async (title: string) => {
    try {
        const res = await api.post('/pages', {
            title,
            json_data: exampleJSONData
        })
        return res.data
    } catch (e) {
        console.error('getPages error:', e)
        return null
    }
}