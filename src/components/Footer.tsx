'use client'
import React from "react";

export default function Footer() {
    const isMobile = window.innerWidth <= 600;
    console.log(isMobile);

    return <footer>
        <p>לכל שאלה ופניה אפשר ליצור קשר <a href="https://wa.me/972542338344"
                                            target="_blank">בוואטסאפ</a></p>
        <p>בטלפון - <a href="tel:+972542338344">0542338344</a>, או באימייל - <a
            href="mailto:ester.attali@gmail.com">ester.attali@gmail.com</a></p>
    </footer>
}