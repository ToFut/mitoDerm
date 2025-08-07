const fs = require('fs');
const path = require('path');

// Create placeholder images using SVG
const createPlaceholderSVG = (width, height, text, filename) => {
  const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#667eea"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">${text}</text>
</svg>`;

  const filePath = path.join(__dirname, '..', 'public', 'images', filename);
  fs.writeFileSync(filePath, svg);
  console.log(`Created: ${filename}`);
};

// Generate education video placeholders
const educationVideos = [
  { name: 'video1.jpg', text: 'V-Tech Intro' },
  { name: 'video2.jpg', text: 'Advanced Techniques' },
  { name: 'video3.jpg', text: 'Business Growth' },
  { name: 'video4.jpg', text: 'Before & After' },
  { name: 'video5.jpg', text: 'Product Advantages' }
];

// Generate product placeholders
const products = [
  { name: 'serum.jpg', text: 'V-Tech Serum' },
  { name: 'mask.jpg', text: 'Gel Mask' },
  { name: 'kit.jpg', text: 'Complete Kit' }
];

console.log('Generating placeholder images...');

// Create education video placeholders
educationVideos.forEach(video => {
  createPlaceholderSVG(300, 200, video.text, `education/${video.name}`);
});

// Create product placeholders
products.forEach(product => {
  createPlaceholderSVG(200, 200, product.text, `products/${product.name}`);
});

console.log('All placeholder images generated successfully!'); 