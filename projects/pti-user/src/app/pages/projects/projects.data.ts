export type ProjectCategory = 'all' | 'can-ho' | 'dat-nen' | 'nha-pho' | 'nghi-duong';
export type ProjectStatus = 'selling' | 'coming' | 'preparing' | 'delivered';

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  location: string;
  category: Exclude<ProjectCategory, 'all'>;
  classification: string;
  price: string;
  status: ProjectStatus;
  growthPotential: string;
  profitRate: string;
  image: string;
}

export const PROJECT_STATS = [
  { icon: 'building', label: 'Tổng dự án', value: '6 Dự án' },
  { icon: 'map', label: 'Đang mở bán', value: '4 Dự án' },
  { icon: 'chart', label: 'Tỷ suất lợi nhuận TB', value: '12.4%/năm' },
  { icon: 'users', label: 'Khách hàng tin tưởng', value: '8,450+ Khách hàng' },
  { icon: 'star', label: 'Đánh giá hài lòng', value: '4.9/5 Điểm đánh giá' },
] as const;

export const CATEGORY_TABS: { id: ProjectCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'Tất cả', icon: 'grid' },
  { id: 'can-ho', label: 'Căn hộ', icon: 'building' },
  { id: 'dat-nen', label: 'Đất nền', icon: 'land' },
  { id: 'nha-pho', label: 'Nhà phố', icon: 'house' },
  { id: 'nghi-duong', label: 'Nghỉ dưỡng', icon: 'resort' },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'the-felix',
    name: 'Dự Án The Felix',
    description:
      'Dự án này không chỉ là một nơi để sống, mà còn là nơi để gắn bó và xây dựng cộng đồng.',
    location: 'Bình Dương',
    category: 'can-ho',
    classification: 'Căn hộ',
    price: 'Liên hệ',
    status: 'selling',
    growthPotential: '+16.2%',
    profitRate: '11.8%/năm',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
  },
  {
    id: 'the-infinity-di-an',
    name: 'Dự Án The Infinity Dĩ An',
    description:
      'The Infinity Dĩ An sở hữu vị trí vàng kết nối TP.HCM – Bình Dương – Đồng Nai',
    location: 'Bình Dương',
    category: 'can-ho',
    classification: 'Căn hộ',
    price: 'Liên hệ',
    status: 'selling',
    growthPotential: '+18.5%',
    profitRate: '12.4%/năm',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
  },
  {
    id: 'seahorse-central',
    name: 'The SeaHorse Central Bình Phước',
    description:
      'Sự xuất hiện của Khu dân cư trung tâm hành chính Bombo (The Seahorse Central Binh Phuoc)',
    location: 'Bình Phước',
    category: 'dat-nen',
    classification: 'Nhà phố thương mại',
    price: '790 Triệu',
    status: 'selling',
    growthPotential: '+14.3%',
    profitRate: '10.5%/năm',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
  },
  {
    id: 'gold-coast-vung-tau',
    name: 'Gold Coast Vũng Tàu',
    description:
      'Gold Coast nơi hội tụ tiềm năng kinh tế và hạ tầng giao thông đồng bộ',
    location: 'Vũng Tàu',
    category: 'nghi-duong',
    classification: 'Biệt thự - Shophouse',
    price: 'Liên hệ',
    status: 'coming',
    growthPotential: '+20.1%',
    profitRate: '13.2%/năm',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
  },
  {
    id: 'lan-anh-avenue',
    name: 'Lan Anh AVENUE',
    description:
      'Lan Anh Avenue – Là tọa lạc tại một vị trí "vàng" giữa lòng thủ phủ công nghiệp Bình Dương.',
    location: 'Bình Dương',
    category: 'nha-pho',
    classification: 'Nhà phố thương mại',
    price: 'Liên hệ',
    status: 'selling',
    growthPotential: '+15.7%',
    profitRate: '11.2%/năm',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
  },
  {
    id: 'gia-khai-luxury',
    name: 'Dự Án Gia Khải Luxury',
    description:
      'Vị trí dự án Gia Khải Luxury thuận tiện với trục Hùng Vương & Đại Lộ Bình Dương',
    location: 'TP Bến Cát',
    category: 'nha-pho',
    classification: 'Nhà phố',
    price: '2,8 Tỷ',
    status: 'preparing',
    growthPotential: '+17.4%',
    profitRate: '12.0%/năm',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
  },
  {
    id: 'vinhomes-grand-park',
    name: 'Vinhomes Grand Park',
    description: 'Đại đô thị thông minh đẳng cấp quốc tế tại trung tâm TP. Thủ Đức, TP. Hồ Chí Minh.',
    location: 'TP. Hồ Chí Minh',
    category: 'can-ho',
    classification: 'Căn hộ - Nhà phố - Biệt thự',
    price: 'Từ 2.1 tỷ',
    status: 'selling',
    growthPotential: '+22.4%',
    profitRate: '13.5%/năm',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
  },
  {
    id: 'khanh-binh',
    name: 'Dự Án Khánh Bình',
    description: 'Khu dân cư hiện đại tọa lạc tại Tân Uyên, Bình Dương với hạ tầng đồng bộ.',
    location: 'Bình Dương',
    category: 'dat-nen',
    classification: 'Đất nền - Nhà phố',
    price: 'Liên hệ',
    status: 'selling',
    growthPotential: '+15.2%',
    profitRate: '10.8%/năm',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
  },
];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  selling: 'Đang mở bán',
  coming: 'Sắp mở bán',
  preparing: 'Chuẩn bị mở bán',
  delivered: 'Đã bàn giao',
};
