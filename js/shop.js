// --- Begin effect-one logic (from cart.html) ---
// Image transition effect for all .shop-item elements
(function() {
  const config = {
    clipPathDirection: 'top-bottom',
    steps: 6,
    stepDuration: 0.35,
    stepInterval: 0.05,
    moverPauseBeforeExit: 0.14,
    rotationRange: 0,
    wobbleStrength: 0,
    panelRevealEase: 'sine.inOut',
    gridItemEase: 'sine',
    moverEnterEase: 'sine.in',
    moverExitEase: 'sine',
    panelRevealDurationFactor: 2,
    clickedItemDurationFactor: 2,
    gridItemStaggerFactor: 0.3,
    moverBlendMode: false,
    pathMotion: 'linear',
    sineAmplitude: 50,
    sineFrequency: Math.PI,
  };
  const lerp = (a, b, t) => a + (b - a) * t;
  const panel = document.querySelector('.shop-panel.effect-panel');
  const panelImg = document.querySelector('.shop-panel-img');
  const closeBtn = document.querySelector('.effect-panel-close');
  const panelInfo = document.querySelector('.shop-panel-info');
  let isAnimating = false;
  function getClipPathsForDirection(direction) {
    switch (direction) {
      case 'bottom-top':
        return { from: 'inset(0% 0% 100% 0%)', reveal: 'inset(0% 0% 0% 0%)', hide: 'inset(100% 0% 0% 0%)' };
      case 'left-right':
        return { from: 'inset(0% 100% 0% 0%)', reveal: 'inset(0% 0% 0% 0%)', hide: 'inset(0% 0% 0% 100%)' };
      case 'right-left':
        return { from: 'inset(0% 0% 0% 100%)', reveal: 'inset(0% 0% 0% 0%)', hide: 'inset(0% 100% 0% 0%)' };
      case 'top-bottom':
      default:
        return { from: 'inset(100% 0% 0% 0%)', reveal: 'inset(0% 0% 0% 0%)', hide: 'inset(0% 0% 100% 0%)' };
    }
  }
  function generateMotionPath(startRect, endRect, steps) {
    const path = [];
    const fullSteps = steps + 2;
    const startCenter = { x: startRect.left + startRect.width / 2, y: startRect.top + startRect.height / 2 };
    const endCenter = { x: endRect.left + endRect.width / 2, y: endRect.top + endRect.height / 2 };
    for (let i = 0; i < fullSteps; i++) {
      const t = i / (fullSteps - 1);
      const width = lerp(startRect.width, endRect.width, t);
      const height = lerp(startRect.height, endRect.height, t);
      const centerX = lerp(startCenter.x, endCenter.x, t);
      const centerY = lerp(startCenter.y, endCenter.y, t);
      path.push({ left: centerX - width / 2, top: centerY - height / 2, width, height });
    }
    return path.slice(1, -1);
  }
  function bindShopItemEffect() {
    document.querySelectorAll('.shop-item').forEach(box => {
      if (box._effectBound) return;
      box._effectBound = true;
      box.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) return;
        if (isAnimating) return;
        isAnimating = true;
        // Get image and info
        const imgEl = box.querySelector('img');
        const imgURL = imgEl ? imgEl.src : null;
        const title = box.dataset.title || box.querySelector('.shop-title')?.textContent || '';
        const price = box.dataset.price || box.querySelector('.shop-price')?.textContent || '';
        // Show panel (hidden for animation)
        panel.style.opacity = 0;
        panel.style.pointerEvents = 'auto';
        panel.classList.add('active');
        // Fill panel info
        panelImg.style.backgroundImage = imgURL ? `url('${imgURL}')` : '';
        panelImg.style.backgroundSize = 'cover';
        panelImg.style.backgroundPosition = 'center';
        panelInfo.querySelector('h2').textContent = title;
        panelInfo.querySelector('.shop-panel-price').textContent = price.toString().startsWith('₹') ? price : `₹${price}`;
        // Show artist, size, dimensions dynamically
        const artist = box.dataset.artist || '';
        const size = box.dataset.size || '';
        const dimensions = box.dataset.dimensions || '';
        // Replace panelInfo <p> and <ul> with dynamic info
        let infoHtml = '';
        if (artist) infoHtml += `<div><strong>Artist:</strong> ${artist}</div>`;
        if (size) infoHtml += `<div><strong>Size:</strong> ${size}</div>`;
        if (dimensions) infoHtml += `<div><strong>Dimensions:</strong> ${dimensions}</div>`;
        panelInfo.querySelector('p').innerHTML = infoHtml;
        // Optionally hide the <ul> if present
        const ul = panelInfo.querySelector('ul');
        if (ul) ul.style.display = 'none';
        // Animate box out
        gsap.to(box, {
          opacity: 0,
          scale: 0.8,
          duration: config.stepDuration * config.clickedItemDurationFactor,
          ease: config.gridItemEase,
        });
        // Animate movers with image background
        const startRect = box.getBoundingClientRect();
        const endRect = panelImg.getBoundingClientRect();
        const path = generateMotionPath(startRect, endRect, config.steps);
        const fragment = document.createDocumentFragment();
        const clipPaths = getClipPathsForDirection(config.clipPathDirection);
        path.forEach((step, index) => {
          const mover = document.createElement('div');
          mover.className = 'mover';
          Object.assign(mover.style, {
            backgroundImage: imgURL ? `url('${imgURL}')` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'fixed',
            left: step.left + 'px',
            top: step.top + 'px',
            width: step.width + 'px',
            height: step.height + 'px',
            clipPath: clipPaths.from,
            zIndex: 1000 + index,
            borderRadius: '10px',
          });
          fragment.appendChild(mover);
          const delay = index * config.stepInterval;
          gsap.timeline({ delay })
            .fromTo(mover, { opacity: 0.4, clipPath: clipPaths.hide }, {
              opacity: 1,
              clipPath: clipPaths.reveal,
              duration: config.stepDuration,
              ease: config.moverEnterEase,
            })
            .to(mover, {
              clipPath: clipPaths.from,
              duration: config.stepDuration,
              ease: config.moverExitEase,
            }, `+=${config.moverPauseBeforeExit}`);
        });
        document.body.appendChild(fragment);
        // Cleanup movers and show panel
        setTimeout(() => {
          document.querySelectorAll('.mover').forEach(m => m.remove());
          gsap.to(panel, {
            opacity: 1,
            duration: config.stepDuration * config.panelRevealDurationFactor,
            ease: config.panelRevealEase,
            onComplete: () => {
              isAnimating = false;
            }
          });
        }, config.steps * config.stepInterval * 1000 + config.stepDuration * 2000);
      });
    });
  }
  // Initial bind
  bindShopItemEffect();
  // Re-bind after products are loaded dynamically
  document.addEventListener('shop:productsLoaded', bindShopItemEffect);
  closeBtn.addEventListener('click', () => {
    gsap.to(panel, {
      opacity: 0,
      duration: 0.4,
      onComplete: () => {
        panel.classList.remove('active');
        panel.style.pointerEvents = 'none';
        document.querySelectorAll('.shop-item').forEach(box => {
          gsap.set(box, { opacity: 1, scale: 1 });
        });
      }
    });
  });
  // Add to cart button in effect panel adds to cart
  // document.querySelector('.shop-panel-buy').addEventListener('click', function() {
  //   const title = panelInfo.querySelector('h2').textContent;
  //   document.querySelectorAll('.shop-item').forEach(item => {
  //     if (item.querySelector('.shop-title').textContent === title) {
  //       item.querySelector('.add-to-cart').click();
  //     }
  //   });
  //});
  document.querySelector('.shop-panel-buy').addEventListener('click', function() {
    const title = panelInfo.querySelector('h2').textContent;
    const priceText = panelInfo.querySelector('.shop-panel-price').textContent;
    const price = parseFloat(priceText.replace(/[^\d.]/g, ''));
    const imgUrl = panelImg.style.backgroundImage.slice(5, -2); // strip url("...")
  
    if (!title || isNaN(price)) return;
  
    let existing = cart.find(i => i.title.toLowerCase() === title.toLowerCase());
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ title, price, img: imgUrl, qty: 1 });
    }
    updateCart();
  });

})();
// --- End effect-one logic ---
// Cart logic and animation



let cart = [];
const cartPanel = document.querySelector('.cart-panel');
const cartItemsEl = document.querySelector('.cart-items');
const cartCountEls = document.querySelectorAll('.cart-count');
const cartTotalEl = document.querySelector('.cart-total');

// Cart show/hide logic (robust for all devices)
const cartToggleBtn = document.querySelector('.cart-toggle-btn');
const cartCloseBtn = document.querySelector('.cart-close-btn');
if (cartToggleBtn && cartPanel) {
  cartToggleBtn.addEventListener('click', () => {
    cartPanel.style.display = 'block';
    cartPanel.focus && cartPanel.focus();
  });
}
if (cartCloseBtn && cartPanel) {
  cartCloseBtn.addEventListener('click', () => {
    cartPanel.style.display = 'none';
  });
}


function updateCart() {
  cartItemsEl.innerHTML = '';
  let total = 0;
  let count = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    count += item.qty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    // Robustly fix image path if needed (relative to html/shop.html)
    let imgSrc = item.img;
    if (imgSrc && !/^https?:/.test(imgSrc) && !imgSrc.startsWith('../')) {
      imgSrc = '../' + imgSrc.replace(/^\/?/, '');
    }
    el.innerHTML = `
      <img src="${imgSrc}" alt="${item.title}" class="cart-item-img">
      <span class="cart-item-title">${item.title}</span>
      <span>x${item.qty}</span>
      <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
      <button class="cart-item-remove" data-idx="${idx}">✕</button>
    `;
    cartItemsEl.appendChild(el);
  });
  cartCountEls.forEach(el => el.textContent = count);
  cartTotalEl.textContent = total.toFixed(2);
  // Remove logic
  cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.onclick = () => {
      cart.splice(btn.dataset.idx, 1);
      updateCart();
    };
  });
}

// Add to cart animation
function flyToCart(img, endEl, cb) {
  const rect = img.getBoundingClientRect();
  const endRect = endEl.getBoundingClientRect();
  const fly = img.cloneNode();
  fly.className = 'fly-img';
  Object.assign(fly.style, {
    left: rect.left + 'px',
    top: rect.top + 'px',
    width: rect.width + 'px',
    height: rect.height + 'px',
  });
  document.body.appendChild(fly);
  gsap.to(fly, {
    left: endRect.left + endRect.width/2 - rect.width/2,
    top: endRect.top + endRect.height/2 - rect.height/2,
    width: endRect.width + 'px',
    height: endRect.height + 'px',
    opacity: 0.5,
    duration: 0.7,
    ease: 'power1.in',
    onComplete: () => {
      fly.remove();
      cb && cb();
    }
  });
}

// Add to cart logic


function bindAddToCartButtons() {
  const addBtns = document.querySelectorAll('.add-to-cart');
  addBtns.forEach(btn => {
    if (btn._bound) return; // Prevent double-binding
    btn._bound = true;
    btn.addEventListener('click', e => {
      if (btn.disabled) return;
      const itemEl = btn.closest('.shop-item');
      const title = itemEl.dataset.title;
      const price = parseFloat(itemEl.dataset.price);
      const img = itemEl.dataset.img;
      // Always find by title (unique, case-insensitive)
      let foundIdx = cart.findIndex(i => i.title.toLowerCase() === title.toLowerCase());
      // Update cart immediately to prevent race condition
      if (foundIdx !== -1) {
        cart[foundIdx].qty++;
      } else {
        cart.push({ title, price, img, qty: 1 });
      }
      updateCart();
      // Animate to cart
      const cartIcon = document.querySelector('.cart-toggle-btn .cart-count') || document.querySelector('.cart-header .cart-count');
      let imgEl = itemEl.querySelector('img');
      if (!imgEl) {
        imgEl = document.createElement('img');
        imgEl.src = img;
        imgEl.style.position = 'absolute';
        imgEl.style.left = '-9999px';
        document.body.appendChild(imgEl);
      }
      btn.disabled = true;
      flyToCart(imgEl, cartIcon, () => {
        if (!itemEl.querySelector('img') && imgEl.parentNode === document.body) imgEl.remove();
        btn.disabled = false;
      });
    });
  });
}

// Initial bind (for static HTML or first load)
bindAddToCartButtons();

// Re-bind after products are loaded dynamically
document.addEventListener('shop:productsLoaded', bindAddToCartButtons);

// Checkout button
const checkoutBtn = document.querySelector('.checkout-btn');
checkoutBtn.onclick = () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Thank you for your purchase! (Demo only)');
  cart.length = 0;
  updateCart();
};

updateCart();
