import StageCard from "./StageCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Stage, STAGES } from "@/lib/constants";

interface StageNavigationProps {
  stages?: Stage[];
}

// المراحل المفعّلة للعرض (الابتدائي فقط حاليًا — أضف "middle"/"high" عند توفّر محتواهما)
const ENABLED_STAGES = ["primary"];
const defaultStages = Object.values(STAGES).filter((s) =>
  ENABLED_STAGES.includes(s.id),
);

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const StageNavigation = ({ stages = defaultStages }: StageNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
      >
        {stages.map((stage) => (
          <motion.div key={stage.id} variants={item} className="w-full">
            <StageCard
              title={stage.title}
              description={stage.description}
              icon={stage.icon}
              onClick={() => navigate(`/stage/${stage.id}`)}
              className="h-full"
              features={stage.features}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default StageNavigation;
