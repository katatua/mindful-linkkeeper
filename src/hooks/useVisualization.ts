
import { useState } from "react";

export const useVisualization = () => {
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualizationData, setVisualizationData] = useState<any[]>([]);

  return {
    showVisualization,
    setShowVisualization,
    visualizationData,
    setVisualizationData
  };
};
