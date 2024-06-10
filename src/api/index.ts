import type { PersonProfile } from '@/types/person'
import axios from 'axios'

const backendUrl = 'http://114.116.201.58:8080'
export const staticHostUrl = 'http://101.126.87.200:4000'

const instance = axios.create({
    timeout: 3000,
    baseURL: backendUrl + '/user'
})

instance.interceptors.request.use((request) => {
    request.headers.Authorization = 'Bearer ' + (localStorage.getItem('token') || '')
    return request
})

instance.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return error.response
    }
)

export async function login({ phone, password }: { phone: string; password: string }) {
    return await instance.post('/login/', { phone_num: phone, password })
}

export async function register({
    phone,
    password,
    username,
    locId
}: {
    phone: string
    password: string
    username: string
    locId: number
}) {
    return await axios.post('http://114.116.201.58:8080/user/register/', {
        phone_num: phone,
        password,
        username,
        default_area: locId
    })
}

export async function getIndicators() {
    const res = await instance.get('/getIndicators/')
    console.log(res)
    return res
}

export async function feedback({ title, content }: { title: string; content: string }) {
    await instance.post('/feedback/', { title, content })
}

export async function getFeedbacks() {
    return await instance.get('/getFeedbacks/')
}

export async function getFeedbackById(feedbackId: number) {
    return await instance.get(`/getFeedbackById/${feedbackId}`)
}

export async function sendToOSS(content: string) {
    return await axios.post(staticHostUrl + '/upload-quill-content', { content })
}

export async function getWeather() {
    return await instance.get('/getAllWeatherData/')
}

export async function getWeatherHistory(localid: number) {
    return await instance.get(`/getLatestSeven/${localid}`)
}

export async function getPredict() {
    return await instance.get('/getPredict')
}

export async function modifyUserProfile(profile: PersonProfile) {
    await instance.post('/modifyUserProfile/', profile)
}

export async function getUserProfile() {
    return await instance.get('/getUserProfile/')
}

export async function getCurWeather() {
    return await instance.get('/getCurWeather/')
}

export async function getSixWeather() {
    return await instance.get('/getSixPrediction/')
}

export async function getTodayPrediction() {
    return await instance.get('/getTodayPrediction/')
}

export async function subscribe(data: any) {
    await instance.post('/updateSubscribe/', {
        subscribes: data
    })
}
export async function getSun(localid: number) {
    return await instance.get(`/getSun/${localid}`)
}

export async function getWarning() {
    return await instance.get('/getWarning/')
}

export async function getAllWarning() {
    return await instance.get('/getAllWarning/')
}

export async function updateInfo(profile: {
    password?: string
    username?: string
    avatar?: string
    locId?: number
}) {
    console.log(profile)
    await instance.put('/updateInfo/', { ...profile, default_area: profile.locId })
}

export async function getSubscriptions() {
    return await instance.get('/getSubscribes/')
}

export async function getHeatMap() {
    return await instance.get('/getHeatMap/')
}
