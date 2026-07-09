const PRODUCTS = [
    {
        id: 'crochet-1',
        title: 'Cozy Crochet Bear Plushie',
        category: 'crochet',
        price: 24.99,
        image: 'assets/crochet.png',
        description: 'An adorable, handmade crochet teddy bear crafted from high-quality soft cream wool, wearing a cozy brown scarf.'
    },
    {
        id: 'sticker-5pack',
        title: '5 Pack Stickers',
        category: 'stickers',
        price: 3.00,
        image: 'assets/sticker.png',
        description: 'A handpicked collection of 5 aesthetic, waterproof vinyl stickers in cozy pastel designs.'
    },
    {
        id: 'sticker-10pack',
        title: '10 Pack Stickers',
        category: 'stickers',
        price: 5.50,
        image: 'assets/sticker.png',
        description: 'A handpicked collection of 10 aesthetic, waterproof vinyl stickers in cozy pastel designs.'
    },
    {
        id: 'crochet-2',
        title: 'Handmade Coaster Set',
        category: 'crochet',
        price: 15.00,
        image: 'assets/hero.png',
        description: 'Set of 4 hand-knit granny square flower coasters in beige, dusty rose, and mustard yellow.'
    },
    // The 10 Bracelets requested
    {
        id: 'bracelet-1',
        title: 'Blue Waves Bracelet',
        category: 'bracelets',
        price: 2.00,
        image: 'assets/bracelet-blue-waves.jpg',
        description: 'A beautiful stack of royal blue, sky blue, and light baby blue clay disc beads representing ocean waves.'
    },
    {
        id: 'bracelet-2',
        title: 'Thoughtful Nights Bracelet',
        category: 'bracelets',
        price: 2.00,
        image: 'assets/bracelet-thoughtful-nights.png',
        description: 'A beautiful handmade bracelet with alternating soft pink and matte grey clay beads, centered with a lovely pink heart.'
    },
    {
        id: 'bracelet-3',
        title: 'Peach Story Bracelet',
        category: 'bracelets',
        price: 2.00,
        image: 'assets/bracelet-peach-story.png',
        description: 'A beautiful, minimalist stack of soft creamy-peach clay disc beads for a clean, sweet daily accessory.'
    },
    {
        id: 'bracelet-4',
        title: 'Candy World Bracelet',
        category: 'bracelets',
        price: 2.00,
        image: 'assets/bracelet-candy-world.jpg',
        description: 'A playful stack featuring pastel pink, white, and light blue clay disc beads, centered with a cute white smiley face accent bead.'
    },
    {
        id: 'bracelet-5',
        title: 'Dragonfruit Illusion Bracelet',
        category: 'bracelets',
        price: 2.00,
        image: 'assets/bracelet-dragonfruit-illusion.jpg',
        description: 'A vivid stack of pink, black, and white clay disc beads, featuring a cute dragon fruit slice accent bead.'
    },
    {
        id: 'bracelet-6',
        title: 'Dull Days Bracelet',
        category: 'bracelets',
        price: 2.00,
        image: 'assets/bracelet-dull-days.png',
        description: 'A beautiful, minimalist handmade stack of alternating black, white, and grey clay disc beads.'
    },

    {
        id: 'bracelet-8',
        title: 'Strawberry Bliss Bracelet',
        category: 'bracelets',
        price: 2.00,
        image: 'assets/bracelet-strawberry-bliss.png',
        description: 'A delicious stack of red, pink, and white clay disc beads, featuring a sweet strawberry slice accent bead in the center.'
    },
    {
        id: 'bracelet-9',
        title: 'Blue Bonnet Bracelet',
        category: 'bracelets',
        price: 2.00,
        image: 'assets/bracelet-blue-bonnet.png',
        description: 'A beautiful stack of light blue and white clay disc beads, featuring a lovely blue flower slice accent bead.'
    },
    {
        id: 'bracelet-10',
        title: 'Cloudy Sky Bracelet',
        category: 'bracelets',
        price: 2.00,
        image: 'assets/bracelet-cloudy-sky.jpg',
        description: 'A calming mix of soft white and light blue clay disc beads separated by elegant metallic gold spacers.'
    }
];

// Cart State (Initialized from LocalStorage if available)
let cart = JSON.parse(localStorage.getItem('sugar_krafts_cart')) || [];

// DOM Elements
const pages = document.querySelectorAll('.page-section');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuBtn = document.querySelector('.mobile-nav-toggle');
const navContainer = document.querySelector('.nav-links');
const headerLogo = document.getElementById('header-logo');

const featuredContainer = document.getElementById('featured-products-container');
const shopContainer = document.getElementById('shop-products-container');
const filterButtons = document.querySelectorAll('.filter-btn');

const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalEl = document.getElementById('cart-subtotal');
const cartTotalEl = document.getElementById('cart-total');
const cartNavCountEl = document.querySelector('.cart-count');
const checkoutButton = document.getElementById('checkout-button');

const customOrderForm = document.getElementById('custom-order-form');
const successModal = document.getElementById('success-modal');
const modalCloseBtn = document.querySelector('.modal-close');
const modalBtn = document.querySelector('.modal-btn');
const toastNotification = document.getElementById('toast-notification');

// Checkout Page elements
const checkoutPage = document.getElementById('checkout-page');
const checkoutForm = document.getElementById('checkout-form');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupRouting();
    setupMobileNav();
    renderProducts();
    updateCartUI();
    setupCartListeners();
    setupOrderForm();
    setupModal();
    setupCheckoutPage();
}

// --- Routing / SPA Engine ---
function setupRouting() {
    const handleRoute = () => {
        const hash = window.location.hash || '#home';
        const targetPageId = hash.substring(1) + '-page';
        
        // Hide all sections, show active
        let pageFound = false;
        pages.forEach(page => {
            if (page.id === targetPageId) {
                page.classList.add('active');
                pageFound = true;
            } else {
                page.classList.remove('active');
            }
        });

        if (!pageFound) {
            // Fallback to home
            document.getElementById('home-page').classList.add('active');
        }

        // Update nav links active states
        navLinks.forEach(link => {
            const pageAttr = link.getAttribute('data-page');
            if (hash === `#${pageAttr}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Close mobile nav on transition
        navContainer.classList.remove('open');
        mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        
        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleRoute);
    // Initial route load
    handleRoute();
}

// Mobile Menu Toggle
function setupMobileNav() {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = navContainer.classList.toggle('open');
        mobileMenuBtn.innerHTML = isOpen 
            ? '<i class="fa-solid fa-xmark"></i>' 
            : '<i class="fa-solid fa-bars"></i>';
    });
}

// --- Product Catalog Rendering ---
function renderProducts() {
    // 1. Render Featured Collection on Home (first 3 products)
    if (featuredContainer) {
        featuredContainer.innerHTML = PRODUCTS.slice(0, 3)
            .map(product => createProductCardHTML(product))
            .join('');
    }

    // 2. Render Shop Page Catalog
    if (shopContainer) {
        renderShopCatalog('all');
    }

    // Set up filter click events
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const category = e.currentTarget.getAttribute('data-filter');
            renderShopCatalog(category);
        });
    });
}

function renderShopCatalog(filterCategory) {
    if (!shopContainer) return;

    const filtered = filterCategory === 'all'
        ? PRODUCTS
        : PRODUCTS.filter(p => p.category === filterCategory);

    if (filtered.length === 0) {
        shopContainer.innerHTML = `<p class="no-products">No items found in this category.</p>`;
        return;
    }

    shopContainer.innerHTML = filtered
        .map(product => createProductCardHTML(product))
        .join('');

    // Rebind add to cart click handlers
    const addToCartBtns = shopContainer.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', handleAddToCartClick);
    });

    // Also bind home page featured add to cart if exists
    if (featuredContainer) {
        const featuredCartBtns = featuredContainer.querySelectorAll('.add-to-cart-btn');
        featuredCartBtns.forEach(btn => {
            btn.addEventListener('click', handleAddToCartClick);
        });
    }
}

function createProductCardHTML(product) {
    return `
        <article class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
                <span class="product-tag">${product.category}</span>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-meta">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Add to cart">
                        <i class="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

// --- Cart Operations & Storage ---
function handleAddToCartClick(e) {
    const id = e.currentTarget.getAttribute('data-id');
    addToCart(id);
}

function addToCart(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === id);
    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`Added "${product.title}" to cart!`);
}

function saveCart() {
    localStorage.setItem('sugar_krafts_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update navigation counts
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartNavCountEl.textContent = totalCount;

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fa-solid fa-basket-shopping"></i>
                <h3>Your cart is empty</h3>
                <p>Add some aesthetic goodies to start filling it up!</p>
                <a href="#shop" class="btn btn-secondary">Go to Shop</a>
            </div>
        `;
        cartSubtotalEl.textContent = '$0.00';
        cartTotalEl.textContent = '$0.00';
        checkoutButton.disabled = true;
        return;
    }

    checkoutButton.disabled = false;
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-img-container">
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.title}</h4>
                <span class="cart-item-category">${item.category}</span>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controller">
                    <button class="quantity-btn decrease-btn" data-id="${item.id}">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn increase-btn" data-id="${item.id}">+</button>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove item">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Calculate Totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    cartTotalEl.textContent = `$${subtotal.toFixed(2)}`;
}

function setupCartListeners() {
    if (!cartItemsContainer) return;

    cartItemsContainer.addEventListener('click', (e) => {
        const target = e.target;
        const btn = target.closest('button');
        if (!btn) return;

        const id = btn.getAttribute('data-id');

        if (btn.classList.contains('increase-btn')) {
            updateQuantity(id, 1);
        } else if (btn.classList.contains('decrease-btn')) {
            updateQuantity(id, -1);
        } else if (btn.classList.contains('cart-item-remove')) {
            removeFromCart(id);
        }
    });

    checkoutButton.addEventListener('click', () => {
        window.location.hash = '#checkout';
    });
}

function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += change;

    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
    showToast('Removed item from cart.');
}

// Toast notification helper
function showToast(message) {
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
        toastNotification.classList.remove('show');
    }, 3000);
}

// --- Custom Order Form Handling ---
function setupOrderForm() {
    if (!customOrderForm) return;

    customOrderForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name    = document.getElementById('order-name').value.trim();
        const email   = document.getElementById('order-email').value.trim();
        const details = document.getElementById('order-details').value.trim();
        const address = document.getElementById('order-address').value.trim();

        const submitBtn = customOrderForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, details, address })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Success — show clean confirmation modal
                const modalTitle    = successModal.querySelector('h2');
                const modalText     = successModal.querySelector('p');
                const modalCopyBtn  = document.getElementById('modal-copy-btn');
                const modalTextarea = document.getElementById('modal-copy-text');

                if (modalTitle)    modalTitle.textContent = '✓ Order Request Sent!';
                if (modalText)     modalText.textContent  = `Thank you for choosing sugar.krafts! Your custom order request has been sent to our team. We'll get back to you at ${email} as soon as possible! 💕`;
                if (modalCopyBtn)  modalCopyBtn.style.display  = 'none';
                if (modalTextarea) modalTextarea.style.display = 'none';

                customOrderForm.reset();
                successModal.classList.add('show');
                showToast('Order request sent successfully!');
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Send error:', err);
            showToast('Something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Submit Custom Request</span><i class="fa-solid fa-paper-plane"></i>';
        }
    });
}

// --- Modal Helper Dialogs ---
function setupModal() {
    if (!successModal) return;

    const closeModal = () => successModal.classList.remove('show');
    const copyBtn = document.getElementById('modal-copy-btn');
    const continueBtn = document.getElementById('modal-continue-btn');

    modalCloseBtn.addEventListener('click', closeModal);
    
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            closeModal();
            window.location.hash = '#shop'; // Navigate to shop
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const copyText = document.getElementById('modal-copy-text');
            if (copyText) {
                copyText.select();
                copyText.setSelectionRange(0, 99999); // For mobile devices
                
                navigator.clipboard.writeText(copyText.value)
                    .then(() => {
                        showToast('Order details copied to clipboard!');
                        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                        setTimeout(() => {
                            copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Order Details';
                        }, 2000);
                    })
                    .catch(() => {
                        showToast('Failed to copy. Please copy manually.');
                    });
            }
        });
    }

    // Close when clicking outside of contents
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) closeModal();
    });
}

function setupCheckoutPage() {
    if (!checkoutForm) return;

    // Populate cart summary when visiting the checkout page
    window.addEventListener('hashchange', renderCheckoutSummary);
    renderCheckoutSummary();

    // Delivery toggle: adjust address label
    const deliverySelect = document.getElementById('checkout-delivery');
    const addressLabel   = document.querySelector('label[for="checkout-address"]');
    const addressField   = document.getElementById('checkout-address');
    if (deliverySelect && addressLabel && addressField) {
        deliverySelect.addEventListener('change', () => {
            if (deliverySelect.value === 'pickup') {
                addressLabel.textContent = 'Contact Number / Notes (Optional)';
                addressField.required = false;
                addressField.placeholder = 'Enter your phone number or notes...';
            } else {
                addressLabel.textContent = 'Shipping Address';
                addressField.required = true;
                addressField.placeholder = 'Enter your full address in Texas...';
            }
        });
    }

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name     = document.getElementById('checkout-name').value.trim();
        const email    = document.getElementById('checkout-email').value.trim();
        const delivery = document.getElementById('checkout-delivery').value;
        const address  = document.getElementById('checkout-address').value.trim();

        const submitBtn = checkoutForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, delivery, address, cart })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Clear cart and go back to shop
                checkoutForm.reset();
                cart = [];
                saveCart();
                updateCartUI();

                // Show success modal
                const modalTitle   = successModal.querySelector('h2');
                const modalText    = successModal.querySelector('p');
                const modalCopyBtn = document.getElementById('modal-copy-btn');
                const modalTA      = document.getElementById('modal-copy-text');
                if (modalTitle)   modalTitle.textContent = '✓ Order Placed!';
                if (modalText)    modalText.textContent  = `Thank you for shopping at sugar.krafts! Your order has been sent to our team. We'll reach out to you at ${email} for shipping/pickup details. 💕`;
                if (modalCopyBtn) modalCopyBtn.style.display = 'none';
                if (modalTA)      modalTA.style.display      = 'none';

                window.location.hash = '#home';
                successModal.classList.add('show');
                showToast('Order submitted successfully!');
            } else {
                throw new Error(result.error || 'Unknown error');
            }
        } catch (err) {
            console.error('Checkout error:', err);
            showToast('Something went wrong. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Order Request</span><i class="fa-solid fa-paper-plane"></i>';
        }
    });
}

function renderCheckoutSummary() {
    const summaryEl = document.getElementById('checkout-cart-summary');
    if (!summaryEl) return;
    if (window.location.hash !== '#checkout') return;

    if (cart.length === 0) {
        summaryEl.innerHTML = '<p style="color:var(--color-text-muted); text-align:center;">Your cart is empty. <a href="#shop">Go back to shop</a>.</p>';
        return;
    }

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const rows  = cart.map(i => `
        <div style="display:flex; justify-content:space-between; padding:0.4rem 0; border-bottom:1px solid var(--color-border); font-size:0.95rem;">
            <span><strong>${i.title}</strong> × ${i.quantity}</span>
            <span>$${(i.price * i.quantity).toFixed(2)}</span>
        </div>`).join('');

    summaryEl.innerHTML = `
        <h4 style="margin:0 0 0.8rem; color:var(--color-primary-dark); font-family:var(--font-heading);">🛒 Your Order</h4>
        ${rows}
        <div style="display:flex; justify-content:space-between; padding:0.6rem 0 0; font-weight:bold; font-size:1rem; color:var(--color-primary-dark);">
            <span>Total</span><span>$${total.toFixed(2)}</span>
        </div>`;
}
