import Image from "next/image"
import SimpleImageSlider from "./aboutImageSlider";

export default function About() {
    const companyExteriorImages = [
        "/about1.png",
        "/about2.png",
        "/about3.png",

    ];
    return (
        <div >
            {/* About Hero Section */}
            <section className="relative overflow-hidden ">
                <div className="max-w-8xl mx-auto">
                    <div className="relative z-10 " style={{ backgroundColor: "#EFEFEF" }}>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
                            <h1 className="text-4xl tracking-tight font-bold text-gray-900 sm:text-5xl mt-16 md:text-6xl">
                                <span className="block" style={{ color: "#333333" }}>About BARO</span>
                                <span className="block text-custom">Our Story & Vision</span>
                            </h1>
                            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                                Since 2008, BARO has been at the forefront of innovative machine manufacturing, supporting product
                                designers and engineers to quickly bring their ideas to life.
                            </p>
                        </div>
                        <div className="relative w-full h-96 sm:h-96 md:h-96 lg:h-[42rem]">
                            <Image
                                src="/main3.png"
                                alt="BARO Manufacturing Facility"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Company Overview */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
                        {/* 왼쪽 열 - 텍스트 내용 (스크롤 없음) */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Our Company</h2>
                            <p className="mt-4 text-lg text-gray-500">
                                Helping Product designers and engineers receive and showcase new products in no time, BARO strives to open a world of possibilities and leaves the power in the palm of your hands - this is the core of BARO's revolution.

                            </p>
                            <p className="mt-4 text-lg text-gray-500">
                                BARO is leading in speed, quality, and innovation for mechanical components. It opens the future to unlimited options in product development by providing quick turn mechanical fabrication and minimizing the product development cycle.
                            </p>
                            <p className="mt-4 text-lg text-gray-500">We support local Korea market since 2008 and are now expanding and moving at full speed to service all global markets with Korean ethos, Ppallippalli, and Jeong.</p>


                        </div>
                        {/* 오른쪽 열 - 이미지 (컨테이너 없음) */}
                        <div className="mt-10 lg:mt-0">
                            <Image
                                src="/about3.png"
                                alt="BARO Headquarters"
                                width={600}
                                height={450}

                                className="rounded-lg shadow-lg"
                                style={{ objectFit: "cover", width: "100%", height: "24rem" }}
                            />
                        </div>
                    </div>

                    {/* 하단 전체 너비 콘텐츠 */}
                    <div className="mt-6 text-lg text-gray-500">
                        <p className="mt-4 text-lg text-gray-500">
                            BARO means 'immediately' and Ppallippalli means 'hurry up' in Korean culture and ethos. Speed is our top priority to deliver on precision mechanical manufacturing, achieving high fidelity results to support customers' product development.
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            We also want to highlight our Korean 'Jeong' culture, centered in community to establish long-lasting business relationships. Jeong represents an invisible hug that brings people together. It promotes bonding and attachments that develop within interpersonal relationships. We translate that into our business by offering flexibility through discounts, options to expedite, and drop off services.
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            By continuously investing and researching in our development while operating high tech manufacturing systems, BARO strives to lead in the global market and offer top quality results to our customers.
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            BARO offers complete technological advantage ahead of the competition by securing future growth power in speed, quality and technologies that define our differentiation.
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            BARO strives to be a world-class global company and provides an excellent environment where all employees can maximize their skills. Our team of people is the company's biggest focus. Our employees work hard to accomplish our goals. We fully support them and believe we can achieve anything with the right attitude, diligence, and sincerity.
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            Quality is our most important objective, BARO concentrates its capabilities to achieve perfect quality results.
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            Our process takes into consideration full environmental safety as a priority and the most important element in any workplace environment. BARO is committed to safety for our team and products.
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            BARO fully processes your requests at the manufacturing site. If ever a problem is found, we are able to quickly analyze, readjust, and resolve it quickly and accurately.
                        </p>
                        <p className="mt-4 text-lg text-gray-500">
                            Diligence and sincerity without losing focus, a passion for improvement and spirit of challenge for the future, inspiring the world with outstanding speed, technology, and quality, BARO, a company that you can trust will be right by your side.
                        </p>
                    </div>
                </div>
            </section>

            {/* BARO's Core Values */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">BARO's Core Values</h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Supporting customer success through innovative manufacturing processes
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="text-custom">
                                <i className="fas fa-bolt text-3xl"></i>
                            </div>
                            <h3 className="mt-6 text-xl font-medium text-gray-900">Speed</h3>
                            <p className="mt-4 text-gray-500">Save time with industry-leading delivery speeds</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="text-custom">
                                <i className="fas fa-check-circle text-3xl"></i>
                            </div>
                            <h3 className="mt-6 text-xl font-medium text-gray-900">Quality</h3>
                            <p className="mt-4 text-gray-500">We promise to deliver only the highest quality products</p>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-8">
                            <div className="text-custom">
                                <i className="fas fa-lightbulb text-3xl"></i>
                            </div>
                            <h3 className="mt-6 text-xl font-medium text-gray-900">Innovation</h3>
                            <p className="mt-4 text-gray-500">Leading the future through continuous innovation</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BARO's Growth Story */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900">BARO's Growth Story</h2>
                        <p className="mt-4 text-lg text-gray-500">A Journey of Innovation Since 2008</p>
                    </div>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>
                        <div className="relative z-10">
                            <div className="flex items-center mb-12">
                                <div className="flex-1 text-right pr-8">
                                    <h3 className="font-bold text-lg" style={{ color: '#333333' }}>2008</h3>
                                    <p className="text-gray-500">Korean Market Entry</p>
                                </div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'skyBlue' }}></div>
                                <div className="flex-1 pl-8">
                                    <p style={{ color: '#333333' }}>BARO established in Seoul</p>
                                </div>
                            </div>
                            <div className="flex items-center mb-12">
                                <div className="flex-1 text-right pr-8">
                                    <h3 className="font-bold text-lg" style={{ color: '#333333' }}>2015</h3>
                                    <p className="text-gray-500">Tech Innovation</p>
                                </div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'skyBlue' }}></div>
                                <div className="flex-1 pl-8">
                                    <p style={{ color: '#333333' }}>Smart Manufacturing System Implementation</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1 text-right pr-8">
                                    <h3 className="font-bold text-lg" style={{ color: '#333333' }}>2023</h3>
                                    <p className="text-gray-500">Global Expansion</p>
                                </div>
                                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'skyBlue' }}></div>
                                <div className="flex-1 pl-8">
                                    <p style={{ color: '#333333' }}>Global Market Entry</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 sm:mb-12"> {/* Added margin bottom */}
                        <h2 className="text-3xl font-bold text-gray-900">Our New Company</h2>
                        <p className="mt-4 text-lg text-gray-500">Baro Studio Exterior</p>
                    </div>

                    <SimpleImageSlider
                        images={companyExteriorImages}
                        heightClass="h-[400px]"
                        autoPlayInterval={6000}
                    />

                </div>
            </section>

            {/* Global Vision */}
            {/* <section className="py-16 bg-white relative overflow-hidden" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900">Global Vision</h2>
                        <p className="mt-4 text-lg text-gray-500">Connecting the world with Korea's rapid service spirit</p>
                    </div>
                    <div className="mt-16 relative h-96">
                        <Image src="/placeholder.svg?height=720&width=1280" alt="Global Map" fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent"></div>
                        <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                            <div className="bg-white p-6 rounded-lg shadow-lg">
                                <h3 className="text-xl font-bold text-gray-900">Global Expansion</h3>
                                <p className="mt-2 text-gray-500">Expanding worldwide starting from Asia</p>
                                <div className="mt-4">
                                    <Link
                                        href="#"
                                        className="rounded-md inline-flex items-center px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: 'skyBlue' }}
                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

        </div >
    )
}

