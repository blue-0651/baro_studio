import Image from 'next/image';

export default function Event() {
    return (
        <div style={{
            backgroundColor: "#FFFBF5",
            width: "100%",
            height: "clamp(300px, 40rem, 90vh)",
            position: "relative",
            overflow: "hidden",
            WebkitOverflowScrolling: "touch",
        }}>
            <Image
                src="/event/event.png"
                alt="이벤트"
                fill={true}
                priority
                sizes="100vw"
                style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                }}
            />
        </div>
    )
}