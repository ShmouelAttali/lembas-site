'use client'
import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";

export default function Footer() {
    const [isMobile, setIsMobile] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 600);

        checkMobile(); // initial check
        setIsReady(true); // now ready

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Prevent flicker by not rendering anything until isReady
    if (!isReady) {
        return null;  // OR you can return a small <footer>Loading...</footer> if you prefer
    }

    return (
        <footer className={styles.footer}>
            <p>
                לכל שאלה ופניה אפשר ליצור קשר{" "}
                <a href="https://wa.me/972542338344" target="_blank">
                    <span>בוואטסאפ</span>{" "}
                    <img src="/icons/whatsapp.svg" alt="Whatsapp" className={styles.icon} />
                </a>
                {" "}בטלפון -{" "}
                <a href="tel:+972542338344">
                    {isMobile ? <img src="/icons/phone.svg" alt="Phone" className={styles.icon} /> : "0542338344"}
                </a>, או באימייל -{" "}
                <a href="mailto:ester.attali@gmail.com">
                    {isMobile ? <img src="/icons/email.svg" alt="Email" className={styles.icon} /> : "ester.attali@gmail.com"}
                </a>
            </p>
            <p>כתובת לאיסוף הזמנות - הקטורת 48, שילה</p>
        </footer>
    );
}
