import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface GlowCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: string;
}

const GlowCard = ({
    children,
    className = "",
    glowColor = "hsl(330, 94%, 73%)",
}: GlowCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`relative group ${className}`}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
        >
            {/* Animated gradient border */}
            <div
                className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `conic-gradient(from var(--glow-angle, 0deg), ${glowColor}00, ${glowColor}80, ${glowColor}00, ${glowColor}80, ${glowColor}00)`,
                    animation: isHovered ? "gradient-rotate 3s linear infinite" : "none",
                }}
            />
            {/* Mouse-tracking spotlight */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                    background: isHovered
                        ? `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}15, transparent 60%)`
                        : "none",
                }}
            />
            {/* Card content */}
            <div className="relative bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 h-full transition-all duration-300 group-hover:border-transparent">
                {children}
            </div>
        </motion.div>
    );
};

export default GlowCard;
