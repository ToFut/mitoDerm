const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Product data for image generation
const products = [
  {
    name: 'V-Tech System',
    slug: 'vtech-system',
    category: 'clinic',
    color: '#FFD700',
    bgColor: '#1a1a1a'
  },
  {
    name: 'ExoSignal Hair',
    slug: 'exosignal-hair',
    category: 'clinic',
    color: '#FF6B6B',
    bgColor: '#2a2a2a'
  },
  {
    name: 'EXOTECH Gel',
    slug: 'exotech-gel',
    category: 'clinic',
    color: '#4ECDC4',
    bgColor: '#1a1a1a'
  },
  {
    name: 'ExoSignal Spray',
    slug: 'exosignal-spray',
    category: 'home',
    color: '#45B7D1',
    bgColor: '#2a2a2a'
  },
  {
    name: 'PDRN Serum',
    slug: 'pdrn-serum',
    category: 'clinic',
    color: '#96CEB4',
    bgColor: '#1a1a1a'
  },
  {
    name: 'Stem Cell Activator',
    slug: 'stem-cell-activator',
    category: 'clinic',
    color: '#FFEAA7',
    bgColor: '#2a2a2a'
  }
];

function createProductImage(product, type = 'main') {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = product.bgColor;
  ctx.fillRect(0, 0, 400, 400);
  
  // Gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, 400, 400);
  gradient.addColorStop(0, product.color + '20');
  gradient.addColorStop(1, product.color + '10');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 400);
  
  // Product circle
  const centerX = 200;
  const centerY = 200;
  const radius = 120;
  
  // Circle background
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.fillStyle = product.color + '30';
  ctx.fill();
  
  // Circle border
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = product.color;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Product icon/logo
  ctx.fillStyle = product.color;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Use first letter of product name
  const initial = product.name.charAt(0);
  ctx.fillText(initial, centerX, centerY - 20);
  
  // Product name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split name into lines if needed
  const words = product.name.split(' ');
  if (words.length > 1) {
    ctx.fillText(words[0], centerX, centerY + 40);
    ctx.fillText(words.slice(1).join(' '), centerX, centerY + 70);
  } else {
    ctx.fillText(product.name, centerX, centerY + 55);
  }
  
  // Category badge
  ctx.fillStyle = product.color;
  ctx.fillRect(20, 20, 80, 30);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(product.category.toUpperCase(), 60, 35);
  
  // Type indicator
  if (type !== 'main') {
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(300, 20, 80, 30);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(type.toUpperCase(), 340, 35);
  }
  
  return canvas;
}

function createDetailImage(product) {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = product.bgColor;
  ctx.fillRect(0, 0, 400, 400);
  
  // Product bottle/container
  const bottleX = 200;
  const bottleY = 200;
  const bottleWidth = 80;
  const bottleHeight = 120;
  
  // Bottle shadow
  ctx.fillStyle = '#00000020';
  ctx.fillRect(bottleX - 5, bottleY + 5, bottleWidth + 10, bottleHeight + 10);
  
  // Bottle body
  ctx.fillStyle = product.color + '40';
  ctx.fillRect(bottleX, bottleY, bottleWidth, bottleHeight);
  
  // Bottle border
  ctx.strokeStyle = product.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(bottleX, bottleY, bottleWidth, bottleHeight);
  
  // Bottle neck
  ctx.fillStyle = product.color + '60';
  ctx.fillRect(bottleX + 20, bottleY - 20, 40, 20);
  ctx.strokeRect(bottleX + 20, bottleY - 20, 40, 20);
  
  // Product details
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('DETAIL', 200, 100);
  
  // Technology indicator
  ctx.fillStyle = product.color;
  ctx.font = 'bold 14px Arial';
  ctx.fillText('ADVANCED', 200, 320);
  ctx.fillText('TECHNOLOGY', 200, 340);
  
  return canvas;
}

function createApplicationImage(product) {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');
  
  // Background
  ctx.fillStyle = product.bgColor;
  ctx.fillRect(0, 0, 400, 400);
  
  // Application illustration
  const centerX = 200;
  const centerY = 200;
  
  // Skin surface
  ctx.fillStyle = '#F5F5DC';
  ctx.fillRect(50, 150, 300, 100);
  
  // Application area
  ctx.fillStyle = product.color + '40';
  ctx.beginPath();
  ctx.arc(centerX, centerY, 60, 0, 2 * Math.PI);
  ctx.fill();
  
  // Application lines
  ctx.strokeStyle = product.color;
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    const x1 = centerX + Math.cos(angle) * 40;
    const y1 = centerY + Math.sin(angle) * 40;
    const x2 = centerX + Math.cos(angle) * 80;
    const y2 = centerY + Math.sin(angle) * 80;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  
  // Application text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('APPLICATION', 200, 100);
  
  // Before/After indicator
  ctx.fillStyle = product.color;
  ctx.font = 'bold 16px Arial';
  ctx.fillText('BEFORE', 120, 320);
  ctx.fillText('AFTER', 280, 320);
  
  return canvas;
}

async function generateProductImages() {
  console.log('Generating product images...');
  
  const productsDir = path.join(__dirname, '..', 'public', 'images', 'products');
  
  // Ensure directory exists
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }
  
  for (const product of products) {
    console.log(`Generating images for ${product.name}...`);
    
    // Create main image
    const mainCanvas = createProductImage(product, 'main');
    const mainBuffer = mainCanvas.toBuffer('image/jpeg');
    fs.writeFileSync(path.join(productsDir, `${product.slug}-main.jpg`), mainBuffer);
    
    // Create detail image
    const detailCanvas = createDetailImage(product);
    const detailBuffer = detailCanvas.toBuffer('image/jpeg');
    fs.writeFileSync(path.join(productsDir, `${product.slug}-detail.jpg`), detailBuffer);
    
    // Create application image
    const appCanvas = createApplicationImage(product);
    const appBuffer = appCanvas.toBuffer('image/jpeg');
    fs.writeFileSync(path.join(productsDir, `${product.slug}-application.jpg`), appBuffer);
    
    console.log(`Generated images for ${product.name}`);
  }
  
  console.log('All product images generated successfully!');
}

// Run the image generation
generateProductImages().catch(console.error); 