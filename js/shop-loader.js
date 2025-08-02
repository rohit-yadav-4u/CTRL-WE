// shop-loader.js: Dynamically loads products from JSON and renders the shop-list
// Assumes the shop-list container is .shop-list and each product is rendered as a .shop-item

// async function loadShopProducts() {
//   const shopList = document.querySelector(".shop-list");
//   if (!shopList) return;
//   let products = [];
//   try {
//     const res = await fetch("../data/shopImg.json");
//     products = await res.json();
//   } catch (e) {
//     console.error("Failed to load products:", e);
//     return;
//   }
//   // Clear shop-list
//   shopList.innerHTML = "";
//   // Render products in a responsive grid (3-4 per row)
//   products.forEach((prod, i) => {
//     // Create product element
//     const div = document.createElement("div");
//     div.className = "shop-item";
//     div.dataset.title = prod.name;
//     div.dataset.price = prod.price;
//     div.dataset.img = prod.src;
//     div.dataset.artist = prod.artist;
//     div.dataset.size = prod.size;
//     div.dataset.dimensions = prod.dimensions;
//     // Fix image path for html/shop.html (relative to html/)
//     let imgSrc = prod.src;
//     if (!/^https?:/.test(imgSrc) && !imgSrc.startsWith("../")) {
//       imgSrc = "../" + imgSrc.replace(/^\/?/, "");
//     }
//     div.innerHTML = `
//       <img src="${imgSrc}" alt="${prod.name}" class="shop-img" style="width:100%;display:block;object-fit:cover;">
//       <div class="shop-title">${prod.name}</div>
//       <div class="spacer"></div>
//       <div class="shop-price">₹${prod.price}</div>

//       `;//<button class="add-to-cart">Add to Cart</button>
//     shopList.appendChild(div);
//   });
//   //The <div class="spacer"></div> helps balance out variable title heights.
//   // Dispatch event so cart.js can re-bind add-to-cart buttons
//   document.dispatchEvent(new CustomEvent("shop:productsLoaded"));
// }

async function loadShopProducts() {
  const shopList = document.querySelector(".shop-list");
  if (!shopList) return;
  let products = [];
  try {
    const res = await fetch("../data/shopImg.json");
    products = await res.json();
  } catch (e) {
    console.error("Failed to load products:", e);
    return;
  }

  // Handle Product of the Day (PoD)
  let podIndex = parseInt(localStorage.getItem("podIndex"));
  let podRefreshes = parseInt(localStorage.getItem("podRefreshes")) || 0;

  if (isNaN(podIndex) || podRefreshes >= 99) {
    podIndex = Math.floor(Math.random() * products.length);
    podRefreshes = 0;
  }

  localStorage.setItem("podIndex", podIndex);
  localStorage.setItem("podRefreshes", podRefreshes + 1);

  const pod = products[podIndex];

  const productElements = [];

  products.forEach((prod, i) => {
    const div = document.createElement("div");
    div.className = "shop-item";
    div.dataset.title = prod.name;
    div.dataset.price = prod.price;
    div.dataset.img = prod.src;
    div.dataset.artist = prod.artist;
    div.dataset.size = prod.size;
    div.dataset.dimensions = prod.dimensions;

    let imgSrc = prod.src;
    if (!/^https?:/.test(imgSrc) && !imgSrc.startsWith("../")) {
      imgSrc = "../" + imgSrc.replace(/^\/?/, "");
    }

    div.innerHTML = `
      <img src="${imgSrc}" alt="${prod.name}" class="shop-img">
      <div class="shop-title">${prod.name}</div>
      <div class="spacer"></div>
      <div class="shop-price">₹${prod.price}</div>
    `;

    productElements.push(div);
  });

  shopList.innerHTML = ""; // Clear existing

  // Insert all items into DOM and inject PoD after second row (after 8 items)
  const insertAtIndex = 8;
  productElements.forEach((item, index) => {
    if (index === insertAtIndex) {
      const podBanner = document.createElement("div");
      podBanner.className = "shop-item product-of-day-horizontal";
      podBanner.dataset.title = pod.name;
      podBanner.dataset.price = pod.price;
      podBanner.dataset.img = pod.src;
      podBanner.dataset.artist = pod.artist;
      podBanner.dataset.size = pod.size;
      podBanner.dataset.dimensions = pod.dimensions;

      podBanner.innerHTML = `
  <div class="pod-image">
    <img src="../${pod.src}" alt="${pod.name}" />
  </div>
  <div class="pod-info">
    <h3>🌟 Product of the Day</h3>
    <div class="shop-title">${pod.name}</div>
    <div class="shop-price">
      <span class="old-price">₹${(pod.price * 2).toFixed(2)}</span>
      <span class="new-price">₹${pod.price}</span><br>
      <button class="shop-panel-buy add-to-cart">Add to cart</button>
    </div>
  </div>
  <div class="special-offer-badge">50% OFF</div>
  <div class="pod-rating">⭐⭐⭐⭐☆</div>
`;

      shopList.appendChild(podBanner);
    }

    // Skip re-adding PoD in grid if it was already inserted as banner
    if (index !== podIndex) {
      shopList.appendChild(item);
    }
  });

  document.dispatchEvent(new CustomEvent("shop:productsLoaded"));
}

// Auto-load on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadShopProducts);
} else {
  loadShopProducts();
}
