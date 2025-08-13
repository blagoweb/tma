import axios from 'axios';

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.url !== '/api/auth/login') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Интерфейс для эндпоинта
export interface Endpoint {
  name: string;
  method: string;
  path: string;
  body?: any;
}

// Функция для вызова эндпоинта
export async function callEndpoint(endpoint: Endpoint): Promise<string> {
  try {
    const config = {
      method: endpoint.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch',
      url: endpoint.path,
    };

    if (endpoint.body) {
      config.data = endpoint.body;
    }

    const response = await apiClient(config);
    return JSON.stringify(response.data, null, 2);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return `Error: ${error.response?.status} - ${error.response?.statusText}\n${JSON.stringify(error.response?.data, null, 2)}`;
    }
    return error instanceof Error ? error.message : String(error);
  }
}

// Экспортируем экземпляр для прямого использования
export default apiClient;
