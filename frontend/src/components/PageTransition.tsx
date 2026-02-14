import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 12,
        filter: "blur(4px)",
    },
    animate: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.4,
            ease: [0.25, 0.4, 0.25, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -8,
        filter: "blur(4px)",
        transition: {
            duration: 0.25,
            ease: [0.25, 0.4, 0.25, 1],
        },
    },
};

const PageTransition = ({ children }: PageTransitionProps) => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
