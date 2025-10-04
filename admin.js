// Admin Management System
class AdminManager {
    constructor() {
        this.session = null;
        this.products = [];
        this.checkSession();
        this.loadProducts();
    }

    // Check admin session
    checkSession() {
        const sessionData = localStorage.getItem('adminSession');
        if (sessionData) {
            this.session = JSON.parse(sessionData);
            const loginTime = new Date(this.session.loginTime);
            const now = new Date();
            const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

            if (hoursSinceLogin > 24) {
                this.logout();
                return false;
            }
            return true;
        }
        return false;
    }

    // Login admin
    login(email, password, rememberMe = false) {
        // Demo credentials - in production, this would be an API call
        const validCredentials = [
            { email: 'admin@moderninventory.com', password: 'admin123' },
            { email: 'demo@admin.com', password: 'demo123' }
        ];

        const isValid = validCredentials.some(cred => 
            cred.email === email && cred.password === password
        );

        if (isValid) {
            this.session = {
                email: email,
                loginTime: new Date().toISOString(),
                rememberMe: rememberMe
            };

            localStorage.setItem('adminSession', JSON.stringify(this.session));
            
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            }

            return { success: true, message: 'Login successful' };
        }

        return { success: false, message: 'Invalid email or password' };
    }

    // Logout admin
    logout() {
        this.session = null;
        localStorage.removeItem('adminSession');
        return { success: true, message: 'Logged out successfully' };
    }

    // Load products from localStorage
    loadProducts() {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            this.products = JSON.parse(storedProducts);
        } else {
            // Initialize with sample products if none exist
            this.initializeSampleProducts();
        }
    }

    // Initialize sample products
    initializeSampleProducts() {
        this.products = [
            {
                id: 1,
                name: "Wireless Headphones Pro",
                category: "Electronics",
                price: 299.99,
                quantity: 15,
                image: "https://picsum.photos/seed/headphones/400/300"
            },
            {
                id: 2,
                name: "Smart Watch Ultra",
                category: "Electronics",
                price: 449.99,
                quantity: 8,
                image: "https://picsum.photos/seed/smartwatch/400/300"
            },
            {
                id: 3,
                name: "Premium Leather Jacket",
                category: "Clothing",
                price: 599.99,
                quantity: 12,
                image: "https://picsum.photos/seed/jacket/400/300"
            },
            {
                id: 4,
                name: "JavaScript: The Complete Guide",
                category: "Books",
                price: 49.99,
                quantity: 25,
                image: "https://picsum.photos/seed/jsbook/400/300"
            },
            {
                id: 5,
                name: "Smart Home Hub",
                category: "Electronics",
                price: 199.99,
                quantity: 20,
                image: "https://picsum.photos/seed/smarthome/400/300"
            },
            {
                id: 6,
                name: "Yoga Mat Premium",
                category: "Sports",
                price: 79.99,
                quantity: 30,
                image: "https://picsum.photos/seed/yogamat/400/300"
            }
        ];
        this.saveProducts();
    }

    // Save products to localStorage
    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }

    // Add new product
    addProduct(productData) {
        const newProduct = {
            id: Date.now(),
            ...productData,
            createdAt: new Date().toISOString()
        };

        this.products.push(newProduct);
        this.saveProducts();
        return { success: true, product: newProduct };
    }

    // Update existing product
    updateProduct(productId, productData) {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...productData,
                updatedAt: new Date().toISOString()
            };
            this.saveProducts();
            return { success: true, product: this.products[index] };
        }
        return { success: false, message: 'Product not found' };
    }

    // Delete product
    deleteProduct(productId) {
        const index = this.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            const deletedProduct = this.products[index];
            this.products.splice(index, 1);
            this.saveProducts();
            return { success: true, product: deletedProduct };
        }
        return { success: false, message: 'Product not found' };
    }

    // Get product by ID
    getProduct(productId) {
        return this.products.find(p => p.id === productId);
    }

    // Get all products
    getAllProducts() {
        return [...this.products];
    }

    // Filter products
    filterProducts(searchTerm = '', category = '') {
        return this.products.filter(product => {
            const matchesSearch = !searchTerm || 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = !category || product.category === category;
            
            return matchesSearch && matchesCategory;
        });
    }

    // Get dashboard statistics
    getStats() {
        const totalProducts = this.products.length;
        const totalStock = this.products.reduce((sum, p) => sum + p.quantity, 0);
        const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
        const lowStockItems = this.products.filter(p => p.quantity < 10).length;

        // Group by category
        const categoryStats = {};
        this.products.forEach(product => {
            if (!categoryStats[product.category]) {
                categoryStats[product.category] = {
                    count: 0,
                    totalValue: 0,
                    totalStock: 0
                };
            }
            categoryStats[product.category].count++;
            categoryStats[product.category].totalValue += product.price * product.quantity;
            categoryStats[product.category].totalStock += product.quantity;
        });

        return {
            totalProducts,
            totalStock,
            totalValue,
            lowStockItems,
            categoryStats
        };
    }

    // Export products data
    exportProducts() {
        const dataStr = JSON.stringify(this.products, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `products_export_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        return { success: true, message: 'Products exported successfully' };
    }

    // Import products data
    importProducts(fileData) {
        try {
            const importedProducts = JSON.parse(fileData);
            
            // Validate data structure
            if (!Array.isArray(importedProducts)) {
                throw new Error('Invalid data format');
            }

            // Validate each product
            const validProducts = importedProducts.filter(product => {
                return product.name && product.category && product.price && product.quantity;
            });

            if (validProducts.length === 0) {
                throw new Error('No valid products found');
            }

            // Add imported products with new IDs
            validProducts.forEach(product => {
                product.id = Date.now() + Math.random();
                product.createdAt = new Date().toISOString();
                this.products.push(product);
            });

            this.saveProducts();
            return { success: true, message: `Successfully imported ${validProducts.length} products` };
        } catch (error) {
            return { success: false, message: 'Import failed: ' + error.message };
        }
    }

    // Validate product data
    validateProductData(productData) {
        const errors = [];

        if (!productData.name || productData.name.trim() === '') {
            errors.push('Product name is required');
        }

        if (!productData.category || productData.category.trim() === '') {
            errors.push('Category is required');
        }

        if (!productData.price || productData.price <= 0) {
            errors.push('Price must be greater than 0');
        }

        if (!productData.quantity || productData.quantity < 0) {
            errors.push('Quantity must be 0 or greater');
        }

        if (productData.name && productData.name.length > 100) {
            errors.push('Product name must be less than 100 characters');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Get low stock alerts
    getLowStockAlerts(threshold = 10) {
        return this.products.filter(product => product.quantity <= threshold);
    }

    // Search products with advanced filters
    advancedSearch(filters) {
        return this.products.filter(product => {
            let matches = true;

            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                matches = matches && (
                    product.name.toLowerCase().includes(searchLower) ||
                    product.category.toLowerCase().includes(searchLower)
                );
            }

            if (filters.category) {
                matches = matches && product.category === filters.category;
            }

            if (filters.minPrice) {
                matches = matches && product.price >= parseFloat(filters.minPrice);
            }

            if (filters.maxPrice) {
                matches = matches && product.price <= parseFloat(filters.maxPrice);
            }

            if (filters.minStock) {
                matches = matches && product.quantity >= parseInt(filters.minStock);
            }

            if (filters.maxStock) {
                matches = matches && product.quantity <= parseInt(filters.maxStock);
            }

            if (filters.lowStock) {
                matches = matches && product.quantity <= 10;
            }

            return matches;
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminManager;
} else {
    window.AdminManager = AdminManager;
}