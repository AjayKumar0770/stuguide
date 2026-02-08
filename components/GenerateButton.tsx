"use client"
import React from 'react';
import styles from './GenerateButton.module.css';

interface GenerateButtonProps {
    onClick?: () => void;
    loading?: boolean;
    label?: string;
    loadingLabel?: string;
    className?: string;
    disabled?: boolean;
}

export function GenerateButton({
    onClick,
    loading = false,
    label = "Generate",
    loadingLabel = "Generating",
    className = "",
    disabled = false
}: GenerateButtonProps) {
    const letters = label.split("");
    const loadingLetters = (loadingLabel || label).split("");

    return (
        <div className={`${styles.btnWrapper} ${className}`}>
            <button
                className={`${styles.btn} ${loading ? styles.isLoading : ''}`}
                onClick={onClick}
                disabled={disabled || loading}
            >
                <svg className={styles.btnSvg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                <div className={styles.txtWrapper}>
                    <div className={`${styles.txt1} ${loading ? styles.fadeOut : ''}`}>
                        {letters.map((char, i) => (
                            <span key={i} className={styles.btnLetter} style={{ animationDelay: `${i * 0.08}s` }}>
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </div>
                    <div className={`${styles.txt2} ${loading ? styles.fadeIn : ''}`}>
                        {loadingLetters.map((char, i) => (
                            <span key={i} className={styles.btnLetter} style={{ animationDelay: `${i * 0.08}s` }}>
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </div>
                </div>
            </button>
        </div>
    );
}
