import { motion } from "framer-motion";

interface TextRevealProps {
    text: string;
    delay?: number;
    className?: string;
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: (delay: number) => ({
        opacity: 1,
        transition: {
            delayChildren: delay,
            staggerChildren: 0.08,
        },
    }),
};

const wordVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        filter: "blur(8px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1],
        },
    },
};

const TextReveal = ({
    text,
    delay = 0,
    className = "",
    as: Tag = "h1",
}: TextRevealProps) => {
    const words = text.split(" ");

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            custom={delay}
            className={`flex flex-wrap justify-center gap-x-[0.3em] ${className}`}
        >
            {words.map((word, index) => (
                <motion.span
                    key={`${word}-${index}`}
                    variants={wordVariants}
                    className="inline-block"
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default TextReveal;
