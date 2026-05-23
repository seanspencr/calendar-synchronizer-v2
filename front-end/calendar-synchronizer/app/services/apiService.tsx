// axiosService.ts
import axios from 'axios';
import { router } from 'expo-router';
import { AuthApi, Configuration, MessagesApi, SchedulesApi, TasksApi, UsersApi } from '../api-client';
import { StorageService } from './storageService';
import { ExternalPathString } from 'expo-router';



const axiosInstance = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`,
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = await StorageService.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            await StorageService.clearAccessToken();
            router.replace('/');
        }
        return Promise.reject(error);
    }
);

const configuration = new Configuration({
    basePath: `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`,
    accessToken: async () => {
        const token = await StorageService.getAccessToken();
        return token ?? '';
    },
    httpApi: axiosInstance,
});

export const authApi = new AuthApi(configuration, `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`, axiosInstance);
export const schedulesApi = new SchedulesApi(configuration, `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`, axiosInstance);
export const tasksApi = new TasksApi(configuration, `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`, axiosInstance);
export const usersApi = new UsersApi(configuration, `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`, axiosInstance);
export const messagesApi = new MessagesApi(configuration, `${process.env.EXPO_PUBLIC_BACKEND_URL}:${process.env.EXPO_PUBLIC_BACKEND_PORT}`, axiosInstance);
