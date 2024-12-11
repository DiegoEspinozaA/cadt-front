import React, { useState, useEffect } from "react";
import "./CrossAnimation.css";

const CrossAnimation = ({ shouldAnimate = false }) => {
    const [animate, setAnimate] = useState(shouldAnimate);

    useEffect(() => {
        if (shouldAnimate) {
            setAnimate(true); // Activa la animación si se solicita
        } else {
            setAnimate(false); // Asegura que no se anime si `shouldAnimate` es falso
        }
    }, [shouldAnimate]); // Se ejecuta cada vez que `shouldAnimate` cambie

    return (
        <div className="cross-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg
            className={`crossmark ${animate ? "animate" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
        >
            {/* Línea diagonal 1 */}
            <path
                className={`crossmark-line ${animate ? "" : "static"}`}
                fill="none"
                d="M16 16L36 36"
            />
            {/* Línea diagonal 2 */}
            <path
                className={`crossmark-line ${animate ? "" : "static"}`}
                fill="none"
                d="M36 16L16 36"
            />
        </svg>
    </div>
    );
};

export default CrossAnimation;
