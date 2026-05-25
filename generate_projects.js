const fs = require('fs');

const dataProjects = [
  {
    name: 'Dự Án The Felix',
    description: 'Dự án này không chỉ là một nơi để sống, mà còn là nơi để gắn bó và xây dựng cộng đồng.',
    loc: 'Bình Dương',
    category: 'can-ho',
    classification: 'Căn hộ',
    price: 'Liên hệ',
    status: 'selling',
    growth: '+16.2%',
    profitRate: '11.8%/năm',
    img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
  },
  {
    name: 'Dự Án The Infinity Dĩ An',
    description: 'The Infinity Dĩ An sở hữu vị trí vàng kết nối TP.HCM – Bình Dương – Đồng Nai',
    loc: 'Bình Dương',
    category: 'can-ho',
    classification: 'Căn hộ',
    price: 'Liên hệ',
    status: 'selling',
    growth: '+18.5%',
    profitRate: '12.4%/năm',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
  },
  {
    name: 'Gold Coast Vũng Tàu',
    description: 'Gold Coast nơi hội tụ tiềm năng kinh tế và hạ tầng giao thông đồng bộ',
    loc: 'Vũng Tàu',
    category: 'nghi-duong',
    classification: 'Biệt thự - Shophouse',
    price: 'Liên hệ',
    status: 'coming',
    growth: '+20.1%',
    profitRate: '13.2%/năm',
    img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
  },
  {
    name: 'Lan Anh AVENUE',
    description: 'Lan Anh Avenue – Là tọa lạc tại một vị trí "vàng" giữa lòng thủ phủ công nghiệp Bình Dương.',
    loc: 'Bình Dương',
    category: 'nha-pho',
    classification: 'Nhà phố thương mại',
    price: 'Liên hệ',
    status: 'selling',
    growth: '+15.7%',
    profitRate: '11.2%/năm',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
  },
  {
    name: 'Dự Án Gia Khải Luxury',
    description: 'Vị trí dự án Gia Khải Luxury thuận tiện với trục Hùng Vương & Đại Lộ Bình Dương',
    loc: 'TP Bến Cát',
    category: 'nha-pho',
    classification: 'Nhà phố',
    price: '2.8 Tỷ',
    status: 'preparing',
    growth: '+17.4%',
    profitRate: '12.0%/năm',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
  }
];

const existingProjects = JSON.parse(fs.readFileSync('projects/pti-user/src/assets/data/projects.json', 'utf8'));

// Enrich existing projects with required fields
const enriched = existingProjects.map(p => {
  let category = 'can-ho';
  let status = 'selling';
  let description = 'Dự án nổi bật với vị trí đắc địa và nhiều tiện ích đẳng cấp.';
  let profitRate = '12.5%/năm';
  let classification = 'Căn hộ cao cấp';

  if (p.name.includes('Global') || p.name.includes('Aqua')) {
    category = 'nha-pho';
    classification = 'Nhà phố thương mại';
  } else if (p.name.includes('Seahorse')) {
    category = 'dat-nen';
    classification = 'Đất nền';
    description = 'Sự xuất hiện của Khu dân cư trung tâm hành chính Bombo';
    profitRate = '10.5%/năm';
  } else if (p.name.includes('Masteri') || p.name.includes('Lumière') || p.name.includes('Beverly')) {
    category = 'can-ho';
    classification = 'Căn hộ';
  }

  return {
    ...p,
    description,
    category,
    classification,
    status,
    profitRate
  };
});

// Avoid duplicate Seahorse
const finalEnriched = enriched.filter(p => p.name !== 'The SeaHorse Central Bình Phước');

const merged = [...finalEnriched, ...dataProjects];
fs.writeFileSync('projects/pti-user/src/assets/data/projects.json', JSON.stringify(merged, null, 4));
