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
        const res: AuthResponse = await api.post('/auth/telegram', { init_data: initData?.raw() || '' })
        setAuthKey(res.token)
        return res.user
    } catch (e) {
        console.error('auth: API error:', e)
        return null
    }
}