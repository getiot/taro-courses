import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export default function Home () {

  const handleClick = () => {
    Taro.showToast({
      title: '你点击了按钮',
      icon: 'success'
    })
  }

  return (
    <View className='home-container'>
      <Image
        className="home-banner"
        src="https://static.getiot.tech/getiot-banner-2020.webp"
        mode="widthFix"
      />
      <Text className="home-title">这是首页</Text>
      <Button className="home-button" type="primary" onClick={handleClick}>
        点我试试看
      </Button>
    </View>
  )
}
