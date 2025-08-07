const fs = require('fs');
const path = require('path');

// Create simple SVG placeholder images for team members
const teamMembers = [
  { name: 'rachel-green', color: '#48bb78' },
  { name: 'sarah-cohen', color: '#667eea' },
  { name: 'david-levy', color: '#f56565' }
];

const svgTemplate = (name, color) => `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="${color}22"/>
  <circle cx="100" cy="80" r="40" fill="${color}"/>
  <rect x="60" y="140" width="80" height="40" rx="20" fill="${color}"/>
  <text x="100" y="190" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#666">${name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</text>
</svg>
`;

teamMembers.forEach(member => {
  const svgContent = svgTemplate(member.name, member.color);
  const filePath = path.join(__dirname, '..', 'public', 'images', 'team', `${member.name}.jpg`);
  
  // Since we can't easily create actual JPG files, let's create SVG files instead
  const svgFilePath = path.join(__dirname, '..', 'public', 'images', 'team', `${member.name}.svg`);
  fs.writeFileSync(svgFilePath, svgContent);
  console.log(`Created ${member.name}.svg`);
});

console.log('Team placeholder images created successfully!'); 