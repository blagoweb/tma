import api from "@/api/index";
import {setAuthKey} from "@/helperts/storage";
import type {TelegramUser} from "@/types/user";
import {initData} from "@telegram-apps/sdk-vue";

interface AuthResponse {
    token: string
    user: TelegramUser
}

export const authTelegram = async () => {
    try {
        console.log('auth: authTelegram called')
        const initDataRaw = initData?.raw() || ''
        console.log('auth: initData.raw():', initDataRaw)
        console.log('auth: initData object:', initData)
        
        const res: AuthResponse = await api.post('/auth/telegram', { init_data: initDataRaw })
        console.log('auth: API response:', res)
        setAuthKey(res.token)
        console.log('auth: Token saved to storage')
        return res.user
    } catch (e) {
        console.error('auth: API error:', e)
        return null
    }
}