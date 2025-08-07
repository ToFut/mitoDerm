const { getAllProducts } = require('./src/lib/services/productService');

async function testMegaMenu() {
  try {
    console.log('🔍 Testing Mega Menu Products...');
    
    const products = await getAllProducts();
    console.log(`📦 Found ${products.length} products`);
    
    if (products.length === 0) {
      console.log('❌ No products found in database');
      return;
    }
    
    console.log('\n📋 Products with slugs:');
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Slug: ${product.slug || 'MISSING SLUG'}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Featured: ${product.featured}`);
      console.log(`   Active: ${product.isActive}`);
      console.log('---');
    });
    
    // Test URL generation
    console.log('\n🔗 Testing URL generation:');
    products.slice(0, 3).forEach(product => {
      const url = `/${product.slug || 'no-slug'}`;
      console.log(`${product.name}: ${url}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing mega menu:', error);
  }
}

testMegaMenu(); 