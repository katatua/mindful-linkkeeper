
export interface ChartDataset {
  label?: string;
  data: number[] | Array<{x: number, y: number}>;
  backgroundColor?: string | string[];
  borderColor?: string;
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
