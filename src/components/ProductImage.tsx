import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";

export function ProductImage({ product }: { product: any }) {
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [index, setIndex] = useState(0);
    const images = [product.image_url1, product.image_url2];
    const opacityByStock = product.in_stock ? 1 : 0.5;


    useEffect(() => {
        const hasTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        setIsTouchDevice(hasTouch);
    }, []);

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => setIndex(1),
        onSwipedRight: () => setIndex(0),
        preventScrollOnSwipe: true,
        trackTouch: true,
        trackMouse: false,
    });

    const handleMouseEnter = () => {
        if (!isTouchDevice) setIndex(1);
    };

    const handleMouseLeave = () => {
        if (!isTouchDevice) setIndex(0);
    };

    return (
        <div
            {...swipeHandlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                width: "100%",
                aspectRatio: "1 / 1", // Makes it square based on width
                overflow: "hidden",
                position: "relative",
                cursor: isTouchDevice ? "pointer" : "default",
                backgroundColor: product.in_stock ? "var(--clr-bg)" : "white",
            }}
        >
            <div className={"wrapper"}>
            {images.map((img, i) => {
                const isActive = index === i;

                // Choose animation per device type
                const animateProps = isTouchDevice
                    ? { x: isActive ? 0 : index < i ? "100%" : "-100%", opacity: isActive ? opacityByStock : 0 }
                    : { x: 0, opacity: isActive ? opacityByStock : 0 };

                const transitionProps = isTouchDevice
                    ? { type: "spring", stiffness: 300, damping: 30 }
                    : { duration: 0.3, ease: "easeInOut" };

                return (
                    <motion.img
                        key={i}
                        src={img}
                        alt={product.title}
                        initial={false}
                        animate={animateProps}
                        transition={transitionProps}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center",
                        }}
                    />
                );
            })}

            {isTouchDevice && (
                <div
                    style={{
                        position: "absolute",
                        bottom: 10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "8px",
                    }}
                >
                    {[0, 1].map((i) => (
                        <div
                            key={i}
                            style={{
                                width: "12px",
                                height: "12px",
                                borderRadius: "50%",
                                backgroundColor: "#000",
                                opacity: index === i ? 0.2 : opacityByStock,
                                transition: "opacity 0.3s",
                            }}
                        />
                    ))}
                </div>
            )}
            {!product.in_stock && <div className="unavailable">חסר זמנית</div>}
        </div>
        </div>
    );
}
