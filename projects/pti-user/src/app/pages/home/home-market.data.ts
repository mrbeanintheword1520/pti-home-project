export interface MarketTrendPoint {
  label: string;
  value: number;
}

export interface PriceSeries {
  area: string;
  color: string;
  values: number[];
}

export interface PriceTrend {
  period: string;
  unit: string;
  labels: string[];
  series: PriceSeries[];
}

export interface GrowthArea {
  rank: number;
  name: string;
  growth: string;
}

export interface MetricCard {
  label: string;
  value: string;
  change: string;
}

export const MARKET_INDEX = {
  score: 78,
  maxScore: 100,
  label: 'Tích cực',
  weeklyChange: '+11 điểm',
  compareText: 'Tăng 11 điểm so với tuần trước',
  points: [
    { label: '20/04', value: 20 },
    { label: '27/04', value: 30 },
    { label: '04/05', value: 10 },
    { label: '11/05', value: 40 },
    { label: '18/05', value: 50 },
    { label: '25/05', value: 35 },
    { label: '01/06', value: 78 },
  ],
} as const;

export const PRICE_PERIODS = ['1M', '3M', '6M', '1Y'] as const;

export const PRICE_TRENDS: Record<(typeof PRICE_PERIODS)[number], PriceTrend> = {
  '1M': {
    period: '1M',
    unit: 'Triệu/m²',
    labels: ['20/04', '27/04', '04/05', '11/05', '18/05', '25/05', '01/06'],
    series: [
      { area: 'TP. Thủ Đức', color: '#f5222d', values: [50, 75, 105, 95, 120, 135, 150] },
      { area: 'Quận 7', color: '#fa8c16', values: [40, 60, 80, 90, 105, 120, 125] },
      { area: 'Bình Chánh', color: '#52c41a', values: [30, 45, 65, 75, 90, 95, 105] },
      { area: 'Nhà Bè', color: '#1890ff', values: [20, 30, 50, 60, 70, 80, 85] },
      { area: 'Dĩ An', color: '#722ed1', values: [15, 20, 30, 40, 45, 55, 60] },
    ],
  },
  '3M': {
    period: '3M',
    unit: 'Triệu/m²',
    labels: ['20/04', '27/04', '04/05', '11/05', '18/05', '25/05', '01/06'],
    series: [
      { area: 'TP. Thủ Đức', color: '#f5222d', values: [50, 75, 105, 95, 120, 135, 150] },
      { area: 'Quận 7', color: '#fa8c16', values: [40, 60, 80, 90, 105, 120, 125] },
      { area: 'Bình Chánh', color: '#52c41a', values: [30, 45, 65, 75, 90, 95, 105] },
      { area: 'Nhà Bè', color: '#1890ff', values: [20, 30, 50, 60, 70, 80, 85] },
      { area: 'Dĩ An', color: '#722ed1', values: [15, 20, 30, 40, 45, 55, 60] },
    ],
  },
  '6M': {
    period: '6M',
    unit: 'Triệu/m²',
    labels: ['20/04', '27/04', '04/05', '11/05', '18/05', '25/05', '01/06'],
    series: [
      { area: 'TP. Thủ Đức', color: '#f5222d', values: [50, 75, 105, 95, 120, 135, 150] },
      { area: 'Quận 7', color: '#fa8c16', values: [40, 60, 80, 90, 105, 120, 125] },
      { area: 'Bình Chánh', color: '#52c41a', values: [30, 45, 65, 75, 90, 95, 105] },
      { area: 'Nhà Bè', color: '#1890ff', values: [20, 30, 50, 60, 70, 80, 85] },
      { area: 'Dĩ An', color: '#722ed1', values: [15, 20, 30, 40, 45, 55, 60] },
    ],
  },
  '1Y': {
    period: '1Y',
    unit: 'Triệu/m²',
    labels: ['20/04', '27/04', '04/05', '11/05', '18/05', '25/05', '01/06'],
    series: [
      { area: 'TP. Thủ Đức', color: '#f5222d', values: [50, 75, 105, 95, 120, 135, 150] },
      { area: 'Quận 7', color: '#fa8c16', values: [40, 60, 80, 90, 105, 120, 125] },
      { area: 'Bình Chánh', color: '#52c41a', values: [30, 45, 65, 75, 90, 95, 105] },
      { area: 'Nhà Bè', color: '#1890ff', values: [20, 30, 50, 60, 70, 80, 85] },
      { area: 'Dĩ An', color: '#722ed1', values: [15, 20, 30, 40, 45, 55, 60] },
    ],
  },
};

export const TOP_GROWTH_AREAS: GrowthArea[] = [
  { rank: 1, name: 'Hóc Môn', growth: '+18.7%' },
  { rank: 2, name: 'Quận 7', growth: '+15.3%' },
  { rank: 3, name: 'Bình Chánh', growth: '+12.1%' },
  { rank: 4, name: 'Dĩ An (Bình Dương)', growth: '+9.8%' },
  { rank: 5, name: 'Nhơn Trạch (Đồng Nai)', growth: '+8.7%' },
];

export const MARKET_METRICS: MetricCard[] = [
  { label: 'Chỉ số quan tâm đầu tư', value: '124,215', change: '+18.7%' },
  { label: 'Lượt tìm kiếm', value: '32,658', change: '+24.5%' },
  { label: 'Nguồn cung mới', value: '2,450', change: '+12.3%' },
  { label: 'Tỷ suất LN TB', value: '12.4%', change: '+1.6%' },
];
