// shop-loader.js: Dynamically loads products from JSON and renders the shop-list
// Assumes the shop-list container is .shop-list and each product is rendered as a .shop-item

async function loadShopProducts() {
  const shopList = document.querySelector('.shop-list');
  if (!shopList) return;
  let products = [];
  try {
    const res = await fetch('../data/shopImg.json');
    products = await res.json();
  } catch (e) {
    console.error('Failed to load products:', e);
    return;
  }
  // Clear shop-list
  shopList.innerHTML = '';
  // Render products in a responsive grid (3-4 per row)
  products.forEach((prod, i) => {
    // Create product element
    const div = document.createElement('div');
    div.className = 'shop-item';
    div.dataset.title = prod.name;
    div.dataset.price = prod.price;
    div.dataset.img = prod.src;
    div.dataset.artist = prod.artist;
    div.dataset.size = prod.size;
    div.dataset.dimensions = prod.dimensions;
    // Fix image path for html/shop.html (relative to html/)
    let imgSrc = prod.src;
    if (!/^https?:/.test(imgSrc) && !imgSrc.startsWith('../')) {
      imgSrc = '../' + imgSrc.replace(/^\/?/, '');
    }
    div.innerHTML = `
      <img src="${imgSrc}" alt="${prod.name}" class="shop-img" style="width:100%;display:block;object-fit:cover;">
      <div class="shop-title">${prod.name}</div>
      <div class="shop-price">$${prod.price}</div>
      <button class="add-to-cart">Add to Cart</button>
    `;
    shopList.appendChild(div);
  });
  // Dispatch event so cart.js can re-bind add-to-cart buttons
  document.dispatchEvent(new CustomEvent('shop:productsLoaded'));
}

// Auto-load on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadShopProducts);
} else {
  loadShopProducts();
}
