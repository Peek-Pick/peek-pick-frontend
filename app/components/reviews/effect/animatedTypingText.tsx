import { motion } from "framer-motion";

export const TranslatingLoader = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl shadow-md"
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="text-lg"
            >
                🤖
            </motion.div>
            Translating the review...
        </motion.div>
    );
};