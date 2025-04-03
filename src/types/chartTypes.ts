
// Chart data types
export interface ChartDataset {
  label?: string;
  data: number[] | Array<{x: number, y: number}>;
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartData {
  type: string;
  data: {
    labels?: string[];
    datasets: ChartDataset[];
  };
  options?: any;
}

// Additional chart type definitions
export interface LegendItem {
  text: string;
  fillStyle?: string;
  hidden?: boolean;
  lineDash?: number[];
  lineDashOffset?: number;
  lineWidth?: number;
  strokeStyle?: string;
  pointStyle?: string;
}

export interface ChartTooltipItem {
  chart: any;
  dataIndex: number;
  dataset: ChartDataset;
  datasetIndex: number;
  element: any;
  label: string;
  value: string;
  x: number;
  y: number;
  xLabel: string;
  yLabel: string;
}

export interface ChartContext {
  chart: any;
  tooltip: any;
  tooltipItems: ChartTooltipItem[];
  label: string;
}
