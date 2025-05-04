import {useState, useRef} from "react";
import {useSwipeable} from "react-swipeable";
import {motion, AnimatePresence} from "framer-motion";

export function ProductImage({product}: { product: any }) {
    const [swapped, setSwapped] = useState(false);
    const isTouchDevice = useRef('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const [swipeDirection, setSwipeDirection] = useState("left"); // or "right"
    console.log(isTouchDevice.current);
    // Swipe handlers
    const handlers = useSwipeable({
        onSwipedLeft: () => {
            console.log('swiped left');
            setSwipeDirection("left");
            setSwapped(prevState => !prevState);
        },
        onSwipedRight: () => {
            console.log('swiped right');
            setSwipeDirection("right");
            setSwapped(prevState => !prevState);
        },
        preventScrollOnSwipe: true,
        trackTouch: true,
        trackMouse: false,
    });

    const handleMouseEnter = () => {
        if (isTouchDevice.current) return;
        setSwapped(true);
    };

    const handleMouseLeave = () => {
        if (isTouchDevice.current) return;
        setSwapped(false);
    };

    const currentImage = swapped ? product.image_url2 : product.image_url1;

    return (
        <div
            {...handlers}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{width: "100%", height: "330px", overflow: "hidden", position: "relative", cursor: isTouchDevice.current ? "pointer" : 'default'}}
        >
            <AnimatePresence initial={false}>
                <motion.img
                    key={currentImage}
                    src={currentImage}
                    alt={product.title}
                    className="product-thumb"
                    initial={{x: swipeDirection === "left" ? 300 : -300, opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: swipeDirection === "left" ? -300 : 300, opacity: 0}}
                    transition={{type: "spring", stiffness: 300, damping: 30}}
                    style={{position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover"}}
                />
            </AnimatePresence>
            {isTouchDevice.current &&
                <div style={{
                    position: "absolute",
                    bottom: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "8px"
                }}>
                    <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: swapped ? "#000" : "#000",
                        opacity: swapped ? 0.2 : 1,
                        transition: "opacity 0.3s, background-color 0.3s",
                        zIndex: 1000
                    }}/>
                    <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: swapped ? "#000" : "#000",
                        opacity: swapped ? 1 : 0.2,
                        transition: "opacity 0.3s, background-color 0.3s",
                        zIndex: 1000
                    }}/>
                </div>
            }
        </div>
    );
}
