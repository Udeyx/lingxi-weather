import type { Weather } from '@/types/weather'

const processForPie = (rawData: number[], interval: number) => {
    const labels: string[] = []
    const processedData: number[] = []
    for (const rd of rawData) {
        const down =
            rd > 0
                ? Math.floor(Math.abs(rd) / interval) * 5
                : -Math.floor(Math.abs(rd) / interval) * 5
        const up = down + 5
        const label = down.toString() + '°C~' + up.toString() + '°C'
        const pos = labels.indexOf(label)
        if (pos === -1) {
            labels.push(label)
            processedData.push(1)
        } else {
            processedData[pos]++
        }
    }
    return {
        labels: labels,
        datasets: [
            {
                data: processedData
            }
        ]
    }
}

const processForRadar = (rawData: number[], interval: number) => {
    const labels: string[] = []
    const processedData: number[] = []
    for (const rd of rawData) {
        const down =
            rd > 0
                ? Math.floor(Math.abs(rd) / interval) * 5
                : -Math.floor(Math.abs(rd) / interval) * 5
        const up = down + 5
        const label = down.toString() + '°C~' + up.toString() + '°C'
        const pos = labels.indexOf(label)
        if (pos === -1) {
            labels.push(label)
            processedData.push(1)
        } else {
            processedData[pos]++
        }
    }
    return {
        labels: labels,
        datasets: [
            {
                label: '天数',
                data: processedData
            }
        ]
    }
}

const processForCombo = (rawData: number[], time: string[]) => {
    return {
        labels: time,
        datasets: [
            {
                type: 'line',
                data: rawData
            },
            {
                type: 'bar',
                data: rawData
            }
        ]
    }
}

export const processForHeat = (rawData: Weather[]) => {
    const rawHeat: number[] = rawData.map((rd) => rd.heat).reverse()
    const time: string[] = rawData.map((rd) => rd.time).reverse()
    const pieData = processForPie(rawHeat, 5)
    const radarData = processForRadar(rawHeat, 5)
    const comboData = processForCombo(rawHeat, time)
    return {
        pieData,
        radarData,
        comboData
    }
}
