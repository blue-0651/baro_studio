import Image from 'next/image';

export default function Event() {
    return (
        <div style={{
            backgroundColor: "#f9fafb",
            width: "100%",
            height: "40rem",
            position: "relative",
            overflow: "hidden"
        }}>
            <Image
                src="/event/event.png"
                alt="이벤트"
                fill={true}
                priority

                style={{
                    objectFit: "cover"
                }}
            />
        </div>
    )
}