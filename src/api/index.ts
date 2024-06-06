import axios from 'axios'

const instance = axios.create({
    timeout: 3000,
    baseURL: 'http://114.116.201.58:8080/user'
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
    return await instance.get('/getIndicators/')
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
    return await axios.post('http://211.159.168.136:4000/upload-quill-content', { content })
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
