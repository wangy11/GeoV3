import wyRequest from '../request'

//获取城市
export const getCity = () => {
  return wyRequest.post({
    url: 'https://restapi.amap.com/v3/ip',
    data: 'key=e17802d541158928bbe8cce0b35a5133'
  })
}

//获取天气
export const getWeather = (data) => {
  return wyRequest.post({
    url: 'https://restapi.amap.com/v3/weather/weatherInfo',
    data: 'key=e17802d541158928bbe8cce0b35a5133&city=' + data
  })
}
