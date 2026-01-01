import { motion, useMotionValue, useTransform } from "framer-motion";

function TiltedCards() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-80, 80], [10, -10]);
  const rotateY = useTransform(mouseX, [-80, 80], [-10, 10]);

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="relative h-[480px] [perspective:1000px]">
      {/* Back Card */}
      <motion.div
        className="absolute right-36 top-56 w-72 h-44 bg-gray-300 rounded-2xl shadow-lg rotate-[-30deg] opacity-70"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Middle Card */}
      <motion.div
        className="absolute right-20 top-48 w-80 h-48 bg-gray-400/80 rounded-2xl shadow-xl rotate-[-24deg]"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Front Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="absolute right-0 top-32 w-96 h-56 bg-lime-200 rounded-2xl shadow-2xl rotate-[-16deg] p-6"
      >
        <p className="text-base text-gray-500 mt-5">Total Expenses</p>
        <h2 className="text-3xl font-semibold text-gray-900 mt-3">
          ₹ 12,450
        </h2>
        <p className="text-xs text-green-600 text-left">
          (+12% this month)
        </p>
      </motion.div>
    </div>
  );
}

export default TiltedCards;
