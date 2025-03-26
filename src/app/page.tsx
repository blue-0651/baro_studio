import FullScreenSlider from "@/components/full-screen-slider"
import CardSlider from "@/components/card-slider"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  // Sample slider data - replace with your actual content
  const slides = [
    {
      id: 1,
      title: "UFT가 제공하는",
      subtitle: "차별화된 베트남 IT아웃소싱을 경험하세요",
      image: "/placeholder.svg?height=1080&width=1920",
    },
    {
      id: 2,
      title: "글로벌 IT 솔루션",
      subtitle: "최고의 기술력으로 비즈니스 성장을 지원합니다",
      image: "/placeholder.svg?height=1080&width=1920",
    },
    {
      id: 3,
      title: "혁신적인 서비스",
      subtitle: "맞춤형 IT 서비스로 경쟁력을 강화하세요",
      image: "/placeholder.svg?height=1080&width=1920",
    },
  ]

  // Sample card data - replace with your actual content
  const cards = [
    {
      id: 1,
      title: "CNC Machining",
      icon: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      title: "CNC Machining",
      icon: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      title: "CNC Machining",
      icon: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      title: "CNC Machining",
      icon: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      title: "CNC Machining",
      icon: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      title: "CNC Machining",
      icon: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <main style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <Header />
        <FullScreenSlider slides={slides} />
      </div>
      <CardSlider cards={cards} />
      <Footer />
    </main>
  )
}

