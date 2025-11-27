import { Variants } from 'framer-motion';

// Orchestration
export const StaggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

// 3D Fold Effect for Text
export const FoldInOut: Variants = {
    hidden: {
        opacity: 0,
        y: 50,
        rotateX: -45,
        transformPerspective: 1000,
    },
    visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100,
            mass: 0.8
        }
    },
    exit: {
        opacity: 0,
        y: -50,
        rotateX: 45,
        transition: { duration: 0.3 }
    }
};

// Scale Reveal for Cards/Images
export const ScaleReveal: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 25,
            stiffness: 120
        }
    }
};

// Slide In Directional
export const SlideInFromLeft: Variants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", damping: 25, stiffness: 100 }
    }
};

export const SlideInFromRight: Variants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", damping: 25, stiffness: 100 }
    }
};

// Simple Fade Up
export const FadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};
