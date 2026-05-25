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
  weeklyChange: '+2.4%',
  compareText: 'Tăng 8 điểm so với tuần trước',
  points: [
    { label: '01/06', value: 42 },
    { label: '05/06', value: 50 },
    { label: '08/06', value: 49 },
    { label: '12/06', value: 58 },
    { label: '15/06', value: 55 },
    { label: '18/06', value: 64 },
    { label: '22/06', value: 61 },
    { label: '25/06', value: 72 },
    { label: '29/06', value: 78 },
  ],
} as const;

export const PRICE_PERIODS = ['3M', '6M', '1Y', '2Y'] as const;

// Dữ liệu mẫu tạm thời để biểu đồ có hình trực quan.
// Khi có API, chỉ cần map dữ liệu backend về cùng shape PriceTrend bên dưới.
export const PRICE_TRENDS: Record<(typeof PRICE_PERIODS)[number], PriceTrend> = {
  '3M': {
    period: '3M',
    unit: 'Triệu/m²',
    labels: ['01/04', '15/04', '01/05', '15/05', '01/06', '15/06'],
    series: [
      { area: 'Thủ Đức', color: '#1F2937', values: [58, 70, 88, 94, 108, 120] },
      { area: 'Quận 7', color: '#7C3AED', values: [56, 64, 72, 81, 89, 97] },
      { area: 'Bình Chánh', color: '#F59E0B', values: [54, 60, 63, 66, 68, 72] },
      { area: 'Dĩ An', color: '#16A34A', values: [55, 63, 71, 78, 84, 92] },
      { area: 'Nhà Bè', color: '#DC2626', values: [53, 49, 42, 45, 39, 44] },
    ],
  },
  '6M': {
    period: '6M',
    unit: 'Triệu/m²',
    labels: ['01/01', '02/02', '03/03', '04/04', '05/05', '06/06'],
    series: [
      { area: 'Thủ Đức', color: '#1F2937', values: [52, 65, 76, 89, 96, 112] },
      { area: 'Quận 7', color: '#7C3AED', values: [50, 58, 69, 78, 86, 94] },
      { area: 'Bình Chánh', color: '#F59E0B', values: [48, 53, 56, 61, 65, 70] },
      { area: 'Dĩ An', color: '#16A34A', values: [47, 55, 63, 75, 80, 88] },
      { area: 'Nhà Bè', color: '#DC2626', values: [50, 48, 44, 46, 41, 45] },
    ],
  },
  '1Y': {
    period: '1Y',
    unit: 'Triệu/m²',
    labels: ['T1', 'T3', 'T5', 'T7', 'T9', 'T11'],
    series: [
      { area: 'Thủ Đức', color: '#1F2937', values: [48, 61, 73, 90, 103, 118] },
      { area: 'Quận 7', color: '#7C3AED', values: [47, 56, 66, 76, 84, 96] },
      { area: 'Bình Chánh', color: '#F59E0B', values: [45, 50, 55, 61, 66, 72] },
      { area: 'Dĩ An', color: '#16A34A', values: [46, 54, 61, 70, 79, 91] },
      { area: 'Nhà Bè', color: '#DC2626', values: [44, 42, 39, 45, 41, 46] },
    ],
  },
  '2Y': {
    period: '2Y',
    unit: 'Triệu/m²',
    labels: ['2023-Q1', '2023-Q3', '2024-Q1', '2024-Q3', '2025-Q1', '2025-Q2'],
    series: [
      { area: 'Thủ Đức', color: '#1F2937', values: [42, 58, 69, 85, 101, 124] },
      { area: 'Quận 7', color: '#7C3AED', values: [41, 51, 62, 72, 83, 99] },
      { area: 'Bình Chánh', color: '#F59E0B', values: [39, 46, 51, 57, 64, 74] },
      { area: 'Dĩ An', color: '#16A34A', values: [38, 49, 58, 69, 78, 93] },
      { area: 'Nhà Bè', color: '#DC2626', values: [40, 38, 42, 44, 39, 48] },
    ],
  },
};

export const TOP_GROWTH_AREAS: GrowthArea[] = [
  { rank: 1, name: 'TP. Thủ Đức', growth: '+15.2%' },
  { rank: 2, name: 'Nhà Bè', growth: '+12.8%' },
  { rank: 3, name: 'Quận 7', growth: '+9.7%' },
  { rank: 4, name: 'Bình Chánh', growth: '+8.4%' },
  { rank: 5, name: 'Dĩ An', growth: '+7.1%' },
];

export const MARKET_METRICS: MetricCard[] = [
  { label: 'Lãi suất đầu tư', value: '8.2%', change: '+0.3%' },
  { label: 'Lượt tìm kiếm', value: '24.5K', change: '+12.4%' },
  { label: 'Nguồn cung mới', value: '1,842', change: '+5.7%' },
  { label: 'Tỷ suất LN TB', value: '18.6%', change: '+2.1%' },
];
