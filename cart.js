// Cart Management System
class CartManager {
    constructor() {
        this.cart = [];
        this.loadCart();
    }

    // Load cart from localStorage
    loadCart() {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            this.cart = JSON.parse(storedCart);
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Check stock availability
            if (existingItem.quantity + quantity <= product.quantity) {
                existingItem.quantity += quantity;
                return { success: true, message: `${product.name} quantity updated` };
            } else {
                return { success: false, message: 'Maximum available quantity reached' };
            }
        } else {
            // Check if product has enough stock
            if (quantity <= product.quantity) {
                this.cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
                return { success: true, message: `${product.name} added to cart` };
            } else {
                return { success: false, message: 'Insufficient stock available' };
            }
        }
    }

    // Remove item from cart
    removeItem(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        if (index !== -1) {
            const removedItem = this.cart[index];
            this.cart.splice(index, 1);
            this.saveCart();
            return { success: true, item: removedItem };
        }
        return { success: false };
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                return this.removeItem(productId);
            }
            
            // Check stock availability
            const products = JSON.parse(localStorage.getItem('products')) || [];
            const product = products.find(p => p.id === productId);
            
            if (product && newQuantity <= product.quantity) {
                item.quantity = newQuantity;
                this.saveCart();
                return { success: true, message: 'Quantity updated' };
            } else {
                return { success: false, message: 'Insufficient stock available' };
            }
        }
        return { success: false };
    }

    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get cart item count
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear entire cart
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Get cart items
    getItems() {
        return [...this.cart];
    }

    // Check if cart is empty
    isEmpty() {
        return this.cart.length === 0;
    }

    // Apply discount
    applyDiscount(discountCode) {
        const discounts = {
            'SAVE10': 0.1,
            'SAVE20': 0.2,
            'WELCOME': 0.15,
            'SPECIAL': 0.25
        };

        if (discounts[discountCode.toUpperCase()]) {
            return discounts[discountCode.toUpperCase()];
        }
        return 0;
    }

    // Calculate shipping
    calculateShipping(subtotal) {
        return subtotal > 100 ? 0 : 9.99;
    }

    // Calculate tax
    calculateTax(subtotal) {
        return subtotal * 0.1; // 10% tax
    }

    // Get order summary
    getOrderSummary(discountCode = '') {
        const subtotal = this.getTotal();
        const tax = this.calculateTax(subtotal);
        const shipping = this.calculateShipping(subtotal);
        let discount = 0;

        if (discountCode) {
            discount = this.applyDiscount(discountCode);
        }

        const discountAmount = subtotal * discount;
        const total = subtotal + tax + shipping - discountAmount;

        return {
            subtotal,
            tax,
            shipping,
            discount: discountAmount,
            total,
            itemCount: this.getItemCount()
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
} else {
    window.CartManager = CartManager;
}