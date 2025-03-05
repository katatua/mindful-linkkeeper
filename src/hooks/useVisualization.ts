
import { useState } from "react";

export const useVisualization = () => {
  const [showVisualization, setShowVisualization] = useState(false);
  const [visualizationData, setVisualizationData] = useState<any[]>([]);

  const handleVisualizationData = (data: any[] | undefined) => {
    if (data && data.length > 0) {
      setVisualizationData(data);
      setShowVisualization(true);
    }
  };

  return {
    showVisualization,
    setShowVisualization,
    visualizationData,
    setVisualizationData,
    handleVisualizationData
  };
};
