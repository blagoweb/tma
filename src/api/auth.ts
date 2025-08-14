import api from "@/api/index";
import {setAuthKey} from "@/helperts/storage";
import type {TelegramUser} from "@/types/user";
import {initData} from "@telegram-apps/sdk-vue";

interface AuthResponse {
    data: {
        token: string
        user: TelegramUser
    }
}

export const authTelegram = async () => {
    try {
        const res: AuthResponse = await api.post('/auth/telegram', { init_data: initData.raw() })
        setAuthKey(res.data.token)
        return res.data.user
    } catch (e) {
        console.error('Auth error:', e)
        return null
    }
}