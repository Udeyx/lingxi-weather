export interface Weather {
    weatherId: number
    locId: number
    time: string
    heat: number
    humidity: number
    windSpeed: number
    windDirection: number
    iconId: number
}

export const oneMockWeather: Weather = {
    weatherId: 0,
    locId: 1111,
    time: '2024-05-20 20:20',
    heat: 20,
    humidity: 10,
    windDirection: 40,
    windSpeed: 4,
    iconId: 100
}

export const oneMockRecommendation = {
    sport: '推荐',
    cloth: '短袖',
    fangshai: '推荐',
    glasses: '推荐',
    kongtiao: '推荐',
    liangshai: '推荐',
    journey: '不推荐',
    comfortable: '一般',
    xiche: '推荐'
}
export const mockHistoryWeather: Weather[] = [
    {
        weatherId: 1,
        locId: 1651,
        time: '2024-05-23 09:58:43',
        heat: 37.8,
        humidity: 31,
        windSpeed: 15.4,
        windDirection: 254,
        iconId: 2
    },
    {
        weatherId: 2,
        locId: 1391,
        time: '2024-05-23 09:48:43',
        heat: 32.2,
        humidity: 38,
        windSpeed: 18.9,
        windDirection: 265,
        iconId: 6
    },
    {
        weatherId: 3,
        locId: 1924,
        time: '2024-05-23 09:38:43',
        heat: 39.4,
        humidity: 64,
        windSpeed: 8.8,
        windDirection: 68,
        iconId: 8
    },
    {
        weatherId: 4,
        locId: 1609,
        time: '2024-05-23 09:28:43',
        heat: 32.3,
        humidity: 45,
        windSpeed: 0.0,
        windDirection: 205,
        iconId: 8
    },
    {
        weatherId: 5,
        locId: 1782,
        time: '2024-05-23 09:18:43',
        heat: 25.0,
        humidity: 34,
        windSpeed: 12.2,
        windDirection: 18,
        iconId: 7
    },
    {
        weatherId: 6,
        locId: 1893,
        time: '2024-05-23 09:08:43',
        heat: 25.2,
        humidity: 77,
        windSpeed: 19.9,
        windDirection: 222,
        iconId: 7
    }
]
