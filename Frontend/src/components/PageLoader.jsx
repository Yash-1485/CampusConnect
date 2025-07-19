import { motion } from "motion/react";
import useTheme from "../store/useTheme";
import { Loader } from "lucide-react";
const PageLoader = () => {
    const { theme } = useTheme();
    const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${bgColor}`}
        >
            {/* Animated Logo/Icon */}
            <motion.div
                animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="mb-4"
            >
                <Loader className="text-primary size-12"/>
            </motion.div>
        </motion.div>
    );
};

export default PageLoader;