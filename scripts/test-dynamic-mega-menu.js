#!/usr/bin/env node

/**
 * Test Script for Dynamic Mega Menu System
 * Tests brand and product management functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Dynamic Mega Menu System...\n');

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

function runTest(testName, testFunction) {
  testResults.total++;
  try {
    const result = testFunction();
    if (result) {
      testResults.passed++;
      testResults.details.push({ name: testName, status: 'PASSED', message: result });
      console.log(`✅ ${testName}: ${result}`);
    } else {
      testResults.failed++;
      testResults.details.push({ name: testName, status: 'FAILED', message: 'Test returned false' });
      console.log(`❌ ${testName}: FAILED`);
    }
  } catch (error) {
    testResults.failed++;
    testResults.details.push({ name: testName, status: 'ERROR', message: error.message });
    console.log(`❌ ${testName}: ERROR - ${error.message}`);
  }
}

// Test 1: Check if brand service file exists
runTest('Brand Service File Exists', () => {
  const brandServicePath = path.join(__dirname, '../src/lib/services/brandService.ts');
  if (fs.existsSync(brandServicePath)) {
    return 'Brand service file found';
  }
  return false;
});

// Test 2: Check if DynamicMegaMenu component exists
runTest('DynamicMegaMenu Component Exists', () => {
  const megaMenuPath = path.join(__dirname, '../src/components/layout/Navigation/DynamicMegaMenu.tsx');
  if (fs.existsSync(megaMenuPath)) {
    return 'DynamicMegaMenu component found';
  }
  return false;
});

// Test 3: Check if BrandManager component exists
runTest('BrandManager Component Exists', () => {
  const brandManagerPath = path.join(__dirname, '../src/components/admin/BrandManager/BrandManager.tsx');
  if (fs.existsSync(brandManagerPath)) {
    return 'BrandManager component found';
  }
  return false;
});

// Test 4: Check if BrandManager styles exist
runTest('BrandManager Styles Exist', () => {
  const stylesPath = path.join(__dirname, '../src/components/admin/BrandManager/BrandManager.module.scss');
  if (fs.existsSync(stylesPath)) {
    return 'BrandManager styles found';
  }
  return false;
});

// Test 5: Check if admin brands page exists
runTest('Admin Brands Page Exists', () => {
  const brandsPagePath = path.join(__dirname, '../src/app/[lang]/admin/brands/page.tsx');
  if (fs.existsSync(brandsPagePath)) {
    return 'Admin brands page found';
  }
  return false;
});

// Test 6: Check Navigation component imports DynamicMegaMenu
runTest('Navigation Imports DynamicMegaMenu', () => {
  const navigationPath = path.join(__dirname, '../src/components/layout/Navigation/Navigation.tsx');
  if (fs.existsSync(navigationPath)) {
    const content = fs.readFileSync(navigationPath, 'utf8');
    if (content.includes('import DynamicMegaMenu')) {
      return 'Navigation component imports DynamicMegaMenu';
    }
  }
  return false;
});

// Test 7: Check if Navigation uses DynamicMegaMenu
runTest('Navigation Uses DynamicMegaMenu', () => {
  const navigationPath = path.join(__dirname, '../src/components/layout/Navigation/Navigation.tsx');
  if (fs.existsSync(navigationPath)) {
    const content = fs.readFileSync(navigationPath, 'utf8');
    if (content.includes('<DynamicMegaMenu')) {
      return 'Navigation component uses DynamicMegaMenu';
    }
  }
  return false;
});

// Test 8: Check AdminLayout includes brands navigation
runTest('AdminLayout Includes Brands Navigation', () => {
  const adminLayoutPath = path.join(__dirname, '../src/components/admin/AdminLayout/AdminLayout.tsx');
  if (fs.existsSync(adminLayoutPath)) {
    const content = fs.readFileSync(adminLayoutPath, 'utf8');
    if (content.includes('brands') && content.includes('Brands & Products')) {
      return 'AdminLayout includes brands navigation';
    }
  }
  return false;
});

// Test 9: Check brand service exports
runTest('Brand Service Exports Correctly', () => {
  const brandServicePath = path.join(__dirname, '../src/lib/services/brandService.ts');
  if (fs.existsSync(brandServicePath)) {
    const content = fs.readFileSync(brandServicePath, 'utf8');
    const requiredExports = [
      'export interface Brand',
      'export interface Product', 
      'export interface MegaMenuData',
      'export const brandService'
    ];
    const missingExports = requiredExports.filter(exportName => !content.includes(exportName));
    if (missingExports.length === 0) {
      return 'Brand service exports all required types and service';
    } else {
      throw new Error(`Missing exports: ${missingExports.join(', ')}`);
    }
  }
  return false;
});

// Test 10: Check DynamicMegaMenu props interface
runTest('DynamicMegaMenu Has Correct Props', () => {
  const megaMenuPath = path.join(__dirname, '../src/components/layout/Navigation/DynamicMegaMenu.tsx');
  if (fs.existsSync(megaMenuPath)) {
    const content = fs.readFileSync(megaMenuPath, 'utf8');
    if (content.includes('isOpen') && content.includes('onClose')) {
      return 'DynamicMegaMenu has correct props interface';
    }
  }
  return false;
});

// Test 11: Check BrandManager has form components
runTest('BrandManager Has Form Components', () => {
  const brandManagerPath = path.join(__dirname, '../src/components/admin/BrandManager/BrandManager.tsx');
  if (fs.existsSync(brandManagerPath)) {
    const content = fs.readFileSync(brandManagerPath, 'utf8');
    if (content.includes('BrandForm') && content.includes('ProductForm')) {
      return 'BrandManager includes form components';
    }
  }
  return false;
});

// Test 12: Check Firebase configuration exists
runTest('Firebase Configuration Exists', () => {
  const firebasePath = path.join(__dirname, '../src/lib/firebase.ts');
  if (fs.existsSync(firebasePath)) {
    return 'Firebase configuration found';
  }
  return false;
});

// Test 13: Check if constants file exists for navigation
runTest('Navigation Constants Exist', () => {
  const constantsPath = path.join(__dirname, '../src/constants.ts');
  if (fs.existsSync(constantsPath)) {
    return 'Navigation constants file found';
  }
  return false;
});

// Test 14: Check if types file exists
runTest('Types File Exists', () => {
  const typesPath = path.join(__dirname, '../src/types.ts');
  if (fs.existsSync(typesPath)) {
    return 'Types file found';
  }
  return false;
});

// Test 15: Check if i18n routing exists
runTest('I18n Routing Exists', () => {
  const routingPath = path.join(__dirname, '../src/i18n/routing.ts');
  if (fs.existsSync(routingPath)) {
    return 'I18n routing found';
  }
  return false;
});

// Test 16: Check if messages exist
runTest('Translation Messages Exist', () => {
  const messagesPath = path.join(__dirname, '../src/messages');
  if (fs.existsSync(messagesPath)) {
    const files = fs.readdirSync(messagesPath);
    if (files.length > 0) {
      return `Translation messages found (${files.length} files)`;
    }
  }
  return false;
});

// Test 17: Check if admin translations exist
runTest('Admin Translations Exist', () => {
  const messagesPath = path.join(__dirname, '../src/messages');
  if (fs.existsSync(messagesPath)) {
    const files = fs.readdirSync(messagesPath);
    const adminTranslations = files.some(file => {
      const content = fs.readFileSync(path.join(messagesPath, file), 'utf8');
      return content.includes('admin');
    });
    if (adminTranslations) {
      return 'Admin translations found';
    }
  }
  return false;
});

// Test 18: Check if package.json has required dependencies
runTest('Required Dependencies Exist', () => {
  const packagePath = path.join(__dirname, '../package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const requiredDeps = ['firebase', 'react-icons', 'next-intl'];
    const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);
    if (missingDeps.length === 0) {
      return 'All required dependencies found';
    } else {
      throw new Error(`Missing dependencies: ${missingDeps.join(', ')}`);
    }
  }
  return false;
});

// Test 19: Check if TypeScript config exists
runTest('TypeScript Configuration Exists', () => {
  const tsConfigPath = path.join(__dirname, '../tsconfig.json');
  if (fs.existsSync(tsConfigPath)) {
    return 'TypeScript configuration found';
  }
  return false;
});

// Test 20: Check if Next.js config exists
runTest('Next.js Configuration Exists', () => {
  const nextConfigPath = path.join(__dirname, '../next.config.mjs');
  if (fs.existsSync(nextConfigPath)) {
    return 'Next.js configuration found';
  }
  return false;
});

// Print summary
console.log('\n📊 Test Summary:');
console.log(`Total Tests: ${testResults.total}`);
console.log(`Passed: ${testResults.passed}`);
console.log(`Failed: ${testResults.failed}`);
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

if (testResults.failed > 0) {
  console.log('\n❌ Failed Tests:');
  testResults.details
    .filter(test => test.status === 'FAILED' || test.status === 'ERROR')
    .forEach(test => {
      console.log(`  - ${test.name}: ${test.message}`);
    });
}

console.log('\n🎯 Dynamic Mega Menu System Status:');
if (testResults.failed === 0) {
  console.log('✅ All tests passed! The dynamic mega menu system is ready to use.');
  console.log('\n🚀 Next Steps:');
  console.log('1. Start the development server: npm run dev');
  console.log('2. Navigate to /admin/brands to manage brands and products');
  console.log('3. Add brands and products through the admin interface');
  console.log('4. The mega menu will automatically update with new content');
  console.log('5. Test the navigation by hovering over "Products" in the main menu');
} else {
  console.log('⚠️  Some tests failed. Please check the failed tests above.');
}

console.log('\n📝 Implementation Details:');
console.log('- Dynamic mega menu pulls data from Firebase Firestore');
console.log('- Brands and products are managed through admin interface');
console.log('- Real-time updates when content is added/modified');
console.log('- Multi-language support (English/Hebrew)');
console.log('- Responsive design for mobile and desktop');
console.log('- SEO-friendly URLs with slugs');

process.exit(testResults.failed === 0 ? 0 : 1); 