import React, { useState, useEffect } from "react";
import "./CheckAnimation.css";

const CheckAnimation = ({ shouldAnimate = false }) => {
    const [animate, setAnimate] = useState(shouldAnimate);

    useEffect(() => {
        if (shouldAnimate) {
            setAnimate(true); // Activa la animación si se solicita
        } else {
            setAnimate(false); // Asegura que no se anime si `shouldAnimate` es falso
        }
    }, [shouldAnimate]); // Se ejecuta cada vez que `shouldAnimate` cambie

    return (
        <div className="check-container absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg
                className={`checkmark ${animate ? "animate" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 50 52"
            >
                <path
                    className={`checkmark-check ${animate ? "" : "static"}`}
                    fill="none"
                    d="M14 26l8 8 16-16"
                />
            </svg>
        </div>
    );
};

export default CheckAnimation;
