import About from "@/components/about/about"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About BARO Studio | Custom Prototype Manufacturing",
  description: "BARO Studio provides rapid prototyping solutions and low volume production services. Our expertise includes injection molding, compression molding, and quick turn tooling. 바로 스튜디오는 신속한 프로토타이핑 솔루션과 소량 생산 서비스를 제공합니다.",
  keywords: "BARO Studio, Custom Prototype, Rapid Prototyping, injection molding, compression molding, low volume production, quick turn tooling, 맞춤형 프로토타입, 사출성형, 압축성형, 소량생산",
}

export default function AboutPage() {
    return <About />
}

