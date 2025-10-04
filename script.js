// Main Application Script
class ModernInventoryApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.setupNavigation();
        this.setupToasts();
        this.loadInitialData();
        this.setupAnimations();
    }

    // Theme Management
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const htmlElement = document.documentElement;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        htmlElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = htmlElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                this.updateThemeIcon(newTheme);
                
                // Add transition effect
                htmlElement.style.transition = 'all 0.3s ease';
            });
        }
    }

    updateThemeIcon(theme) {
        const sunIcon = document.querySelector('.sun-icon');
        const moonIcon = document.querySelector('.moon-icon');
        
        if (sunIcon && moonIcon) {
            if (theme === 'dark') {
                sunIcon.style.display = 'none';
                moonIcon.style.display = 'block';
            } else {
                sunIcon.style.display = 'block';
                moonIcon.style.display = 'none';
            }
        }
    }

    // Navigation Setup
    setupNavigation() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Active navigation highlighting
        this.updateActiveNavigation();
    }

    updateActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath.split('/').pop()) {
                link.style.background = 'var(--glass-bg)';
                link.style.borderRadius = '10px';
            }
        });
    }

    // Toast System
    setupToasts() {
        this.createToastContainer();
    }

    createToastContainer() {
        if (!document.getElementById('toastContainer')) {
            const container = document.createElement('div');
            container.id = 'toastContainer';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
            `;
            document.body.appendChild(container);
        }
    }

    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <style>
                .toast {
                    background: var(--glass-bg);
                    backdrop-filter: blur(15px);
                    border: 1px solid var(--glass-border);
                    border-radius: 12px;
                    padding: 1rem 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--text-light);
                    box-shadow: var(--shadow-glass);
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 300px;
                    word-wrap: break-word;
                }
                .toast.show {
                    transform: translateX(0);
                }
                .toast.success {
                    border-left: 4px solid var(--success);
                }
                .toast.error {
                    border-left: 4px solid var(--danger);
                }
                .toast.warning {
                    border-left: 4px solid var(--warning);
                }
                .toast.info {
                    border-left: 4px solid var(--accent);
                }
            </style>
            ${message}
        `;
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Load Initial Data
    loadInitialData() {
        this.updateCartCount();
        this.setupSampleDataIfNeeded();
    }

    setupSampleDataIfNeeded() {
        // Check if products exist, if not create sample data
        const products = localStorage.getItem('products');
        if (!products) {
            const sampleProducts = [
                {
                    id: 1,
                    name: "Wireless Headphones Pro",
                    category: "Electronics",
                    price: 299.99,
                    quantity: 15,
                    image: "https://picsum.photos/seed/headphones/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: "Smart Watch Ultra",
                    category: "Electronics",
                    price: 449.99,
                    quantity: 8,
                    image: "https://picsum.photos/seed/smartwatch/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: "Premium Leather Jacket",
                    category: "Clothing",
                    price: 599.99,
                    quantity: 12,
                    image: "https://picsum.photos/seed/jacket/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: "JavaScript: The Complete Guide",
                    category: "Books",
                    price: 49.99,
                    quantity: 25,
                    image: "https://picsum.photos/seed/jsbook/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: "Smart Home Hub",
                    category: "Electronics",
                    price: 199.99,
                    quantity: 20,
                    image: "https://picsum.photos/seed/smarthome/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 6,
                    name: "Yoga Mat Premium",
                    category: "Sports",
                    price: 79.99,
                    quantity: 30,
                    image: "https://picsum.photos/seed/yogamat/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 7,
                    name: "Ceramic Plant Pot Set",
                    category: "Home",
                    price: 39.99,
                    quantity: 18,
                    image: "https://picsum.photos/seed/plantpot/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 8,
                    name: "Building Blocks Deluxe",
                    category: "Toys",
                    price: 89.99,
                    quantity: 22,
                    image: "https://picsum.photos/seed/blocks/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 9,
                    name: "Running Shoes Pro",
                    category: "Sports",
                    price: 159.99,
                    quantity: 14,
                    image: "https://picsum.photos/seed/shoes/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 10,
                    name: "Designer Sunglasses",
                    category: "Clothing",
                    price: 249.99,
                    quantity: 10,
                    image: "https://picsum.photos/seed/sunglasses/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 11,
                    name: "Coffee Maker Deluxe",
                    category: "Home",
                    price: 129.99,
                    quantity: 16,
                    image: "https://picsum.photos/seed/coffee/400/300",
                    createdAt: new Date().toISOString()
                },
                {
                    id: 12,
                    name: "Tablet Pro 12\"",
                    category: "Electronics",
                    price: 899.99,
                    quantity: 6,
                    image: "https://picsum.photos/seed/tablet/400/300",
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('products', JSON.stringify(sampleProducts));
        }
    }

    // Cart Management
    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('#cartCount');
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            if (totalItems > 0) {
                element.style.color = 'var(--accent)';
                element.style.fontWeight = 'bold';
            }
        });
    }

    // Animation Setup
    setupAnimations() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements with fade-in class
        document.querySelectorAll('.fade-in').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupHoverEffects() {
        // Enhanced hover effects for interactive elements
        document.querySelectorAll('.btn, .product-card, .glass-card').forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.transition = 'transform 0.3s ease';
            });

            element.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    setupLoadingAnimations() {
        // Add loading states to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function() {
                if (!this.disabled) {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<span class="spinner"></span> Loading...';
                    this.disabled = true;
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 1000);
                }
            });
        });
    }

    // Utility Functions
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Error Handling
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        this.showToast('An unexpected error occurred. Please try again.', 'error');
    }

    // Performance Monitoring
    logPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            });
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ModernInventoryApp();
    window.app.logPerformance();
});

// Global utility functions
function updateCartCount() {
    if (window.app) {
        window.app.updateCartCount();
    }
}

function showToast(message, type = 'info', duration = 3000) {
    if (window.app) {
        window.app.showToast(message, type, duration);
    }
}

function formatCurrency(amount) {
    if (window.app) {
        return window.app.formatCurrency(amount);
    }
    return `$${amount.toFixed(2)}`;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernInventoryApp;
}