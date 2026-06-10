// Sample product data
const products = [
    {
        id: 1,
        title: 'Wireless Headphones',
        category: 'electronics',
        price: 79.99,
        emoji: '🎧',
        description: 'Premium wireless headphones with noise cancellation'
    },
    {
        id: 2,
        title: 'Smart Watch',
        category: 'electronics',
        price: 199.99,
        emoji: '⌚',
        description: 'Track your fitness and stay connected'
    },
    {
        id: 3,
        title: 'T-Shirt',
        category: 'fashion',
        price: 29.99,
        emoji: '👕',
        description: 'Comfortable cotton t-shirt in various colors'
    },
    {
        id: 4,
        title: 'Sneakers',
        category: 'fashion',
        price: 89.99,
        emoji: '👟',
        description: 'Stylish and comfortable athletic sneakers'
    },
    {
        id: 5,
        title: 'JavaScript Guide',
        category: 'books',
        price: 34.99,
        emoji: '📖',
        description: 'Complete guide to mastering JavaScript'
    },
    {
        id: 6,
        title: 'Web Design Book',
        category: 'books',
        price: 44.99,
        emoji: '📚',
        description: 'Learn modern web design principles'
    },
    {
        id: 7,
        title: 'USB-C Cable',
        category: 'electronics',
        price: 14.99,
        emoji: '🔌',
        description: 'Fast charging USB-C cable - 2 pack'
    },
    {
        id: 8,
        title: 'Jeans',
        category: 'fashion',
        price: 59.99,
        emoji: '👖',
        description: 'Classic denim jeans with perfect fit'
    }
];

// Shopping cart
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts('all');
    updateCartCount();
    loadCartFromStorage();
});

// Display products based on category
function displayProducts(category) {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-title">${product.title}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-description">${product.description}</div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Filter products
function filterProducts(category) {
    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    displayProducts(category);
}

// Add item to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCartToStorage();
    updateCartCount();
    showNotification(`${product.title} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    displayCart();
}

// Display cart items
function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty</p>';
        cartTotalSpan.textContent = '0.00';
        return;
    }

    cartItemsDiv.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsDiv.appendChild(cartItem);
    });

    cartTotalSpan.textContent = total.toFixed(2);
}

// Update cart count badge
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Open cart modal
document.querySelector('.cart-icon').addEventListener('click', () => {
    displayCart();
    document.getElementById('cartModal').style.display = 'block';
});

// Close cart modal
function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
    
    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCartCount();
    closeCart();
    displayProducts('all');
}

// Contact form handler
function handleContactForm(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    showNotification('Message sent successfully! We will get back to you soon.');
    event.target.reset();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Local storage functions
function saveCartToStorage() {
    localStorage.setItem('shophub-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shophub-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}
