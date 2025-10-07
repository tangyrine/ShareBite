// ShareBite JavaScript - Interactive Food Waste Reduction Platform

class ShareBite {
    constructor() {
        this.currentRole = 'donor';
        this.foodListings = [];
        this.filteredListings = [];
        this.currentFilter = 'all';
        this.isAuthenticated = false;
        this.userData = null;
        
        this.initAuth();
    }

    async initAuth() {
        await this.checkAuthentication();
        this.updateUIForAuthentication(); 
        this.init();
        this.initTheme();
    }

    async checkAuthentication() {
    try {
        console.log('=== Checking authentication ===');
        const res = await fetch('http://localhost:3000/api/current-user', {
            credentials: 'include'
        });
        
        console.log('Response status:', res.status);
        
        if (res.ok) {
            this.userData = await res.json();
            this.isAuthenticated = true;
            this.currentRole = this.userData.role;
            console.log('✓ User authenticated:', this.userData);
        } else {
            this.isAuthenticated = false;
            this.userData = null;
            this.currentRole = 'donor';
            console.log('✗ User not authenticated');
        }
    } catch (err) {
        console.error('Auth check error:', err);
        this.isAuthenticated = false;
        this.userData = null;
        this.currentRole = 'donor';
    }
}
    updateUIForAuthentication() {
    const roleDisplay = document.getElementById('currentRole');
    const roleSwitch = document.getElementById('roleSwitch');
    let loginBtn = document.querySelector('.login-btn'); 
    
    console.log('Updating UI. Authenticated:', this.isAuthenticated, 'User:', this.userData);
    
    if (this.isAuthenticated && this.userData) {
        
        if (roleDisplay) {
            roleDisplay.textContent = this.capitalizeFirst(this.userData.role);
        }
        

        if (roleSwitch) {
            roleSwitch.style.cursor = 'not-allowed';
            roleSwitch.style.opacity = '0.7';
            roleSwitch.title = 'Role is set based on your account';
            
            
            const newRoleSwitch = roleSwitch.cloneNode(true);
            roleSwitch.parentNode.replaceChild(newRoleSwitch, roleSwitch);
            
           
            newRoleSwitch.classList.add('disabled');
        }
        
        
        if (loginBtn) {
            console.log('Changing button to Logout');
            
            
            const newLoginBtn = loginBtn.cloneNode(true);
            newLoginBtn.textContent = 'Logout';
            newLoginBtn.removeAttribute('onclick');
            loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);
            
            loginBtn = document.querySelector('.login-btn');
            
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Logout clicked');
                    this.handleLogout();
                });
            }
        }
        
        this.updateUIForRole();
    } else {
        console.log('User not authenticated - showing Login button');
        
        if (roleDisplay) {
            roleDisplay.textContent = 'Donor';
        }
        
        
        if (loginBtn) {
            console.log('Changing button to Login');
            
            
            const newLoginBtn = loginBtn.cloneNode(true);
            newLoginBtn.textContent = 'Login';
            newLoginBtn.removeAttribute('onclick');
            loginBtn.parentNode.replaceChild(newLoginBtn, loginBtn);
            
            
            loginBtn = document.querySelector('.login-btn');
            
           
            if (loginBtn) {
                loginBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'login.html';
                });
            }
        }
        
        if (roleSwitch) {
            roleSwitch.style.cursor = 'pointer';
            roleSwitch.style.opacity = '1';
            roleSwitch.classList.remove('disabled');
        }
    }
}

    async handleLogout() {
    try {
        const res = await fetch('http://localhost:3000/logout', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (res.ok) {
            this.isAuthenticated = false;
            this.userData = null;
            this.currentRole = 'donor';
            
            this.showToast('Logged out successfully', 'success');
            
            setTimeout(async () => {
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(k => caches.delete(k)));
                    console.log('[ShareBite] All caches cleared on logout');
                }
                
                window.location.href = 'http://localhost:3000/';
            }, 1000);
        } else {
            throw new Error('Logout failed');
        }
    } catch (err) {
        console.error('Logout error:', err);
        this.showToast('Error logging out', 'error');
    }
}

    init() {
        this.setupEventListeners();
        this.generateSampleListings();
        this.renderFoodListings();
        this.startAnimations();
        this.hideLoadingOverlay();
    }

    initTheme() {
        const stored = localStorage.getItem('sharebite-theme');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = stored || (prefersDark ? 'dark' : 'light');
        this.applyTheme(theme);
        this.setupThemeToggle();
    }

    setupThemeToggle() {
        const btn = document.getElementById('themeToggle');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
            this.applyTheme(newTheme);
            localStorage.setItem('sharebite-theme', newTheme);
        });
    }

    applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            const icon = document.querySelector('#themeToggle i');
            if (icon) { icon.classList.remove('fa-moon'); icon.classList.add('fa-sun'); }
        } else {
            root.classList.remove('dark');
            const icon = document.querySelector('#themeToggle i');
            if (icon) { icon.classList.remove('fa-sun'); icon.classList.add('fa-moon'); }
        }
    }

    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Role switching (only if not authenticated)
        if (!this.isAuthenticated) {
            this.setupRoleSwitch();
        }
        
        // Modal functionality
        this.setupModal();
        
        // Form handling
        this.setupFormHandling();
        
        // Filtering and search
        this.setupFilteringAndSearch();
        
        // Smooth scrolling
        this.setupSmoothScrolling();
        
        // Responsive navigation
        this.setupResponsiveNav();
        
        // Hero button interactions
        this.setupHeroButtons();
        
        // Statistics counter animation
        this.setupStatsAnimation();
        
        // Scroll effects
        this.setupScrollEffects();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    setupRoleSwitch() {
        const roleSwitch = document.getElementById('roleSwitch');
        const currentRoleSpan = document.getElementById('currentRole');
        
        if (!roleSwitch) return;
        
        roleSwitch.addEventListener('click', () => {
            // Only allow switching if not authenticated
            if (this.isAuthenticated) {
                this.showToast('Role is fixed based on your account', 'error');
                return;
            }
            
            this.currentRole = this.currentRole === 'donor' ? 'collector' : 'donor';
            currentRoleSpan.textContent = this.capitalizeFirst(this.currentRole);
            
            // Update UI based on role
            this.updateUIForRole();
        });
    }

    updateUIForRole() {
        const donateBtn = document.getElementById('donateFood');
        const findBtn = document.getElementById('findFood');
        const addListingBtn = document.getElementById('addListingBtn');
        
        if (this.currentRole === 'collector') {
            if (donateBtn) donateBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
            if (findBtn) findBtn.innerHTML = '<i class="fas fa-heart"></i> Help Others';
            if (addListingBtn) addListingBtn.style.display = 'none';
        } else {
            if (donateBtn) donateBtn.innerHTML = '<i class="fas fa-heart"></i> Donate Food';
            if (findBtn) findBtn.innerHTML = '<i class="fas fa-search"></i> Find Food';
            if (addListingBtn) addListingBtn.style.display = 'flex';
        }
    }

    setupModal() {
        const modal = document.getElementById('addListingModal');
        const addListingBtn = document.getElementById('addListingBtn');
        const closeModalBtn = document.querySelector('.close-modal');
        const cancelBtn = document.getElementById('cancelForm');

        this.currentStep = 1;
        this.totalSteps = 3;

        if (addListingBtn) {
            addListingBtn.addEventListener('click', () => {
                // Check authentication before opening modal
                if (!this.isAuthenticated) {
                    this.showToast('Please login to add a listing', 'error');
                    setTimeout(() => {
                        window.location.href = '/login.html';
                    }, 1500);
                    return;
                }
                
                // Check if user is a donor
                if (this.currentRole !== 'donor') {
                    this.showToast('Only donors can add listings', 'error');
                    return;
                }
                
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
                this.resetFormSteps();
            });
        }

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            this.resetForm();
            this.resetFormSteps();
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        this.setupFileUpload();
        this.setupFormNavigation();
    }

    setupFormNavigation() {
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const submitBtn = document.getElementById('submitForm');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.validateCurrentStep()) {
                    this.goToStep(this.currentStep + 1);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.goToStep(this.currentStep - 1);
            });
        }
    }

    goToStep(stepNumber) {
        if (stepNumber < 1 || stepNumber > this.totalSteps) return;

        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });

        const newStep = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (newStep) {
            newStep.classList.add('active');
        }

        this.updateProgress(stepNumber);
        this.updateNavigationButtons(stepNumber);
        this.currentStep = stepNumber;
    }

    updateProgress(stepNumber) {
        const steps = document.querySelectorAll('.progress-step');
        
        steps.forEach((step, index) => {
            const stepNum = index + 1;
            
            if (stepNum < stepNumber) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
    }

    updateNavigationButtons(stepNumber) {
        const nextBtn = document.getElementById('nextStep');
        const prevBtn = document.getElementById('prevStep');
        const submitBtn = document.getElementById('submitForm');

        if (prevBtn) prevBtn.style.display = stepNumber === 1 ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = stepNumber === this.totalSteps ? 'none' : 'flex';
        if (submitBtn) submitBtn.style.display = stepNumber === this.totalSteps ? 'flex' : 'none';
    }

    validateCurrentStep() {
        const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const requiredInputs = currentStepEl.querySelectorAll('[required]');
        
        for (let input of requiredInputs) {
            if (!input.value.trim()) {
                input.focus();
                this.showToast(`Please fill in the required field: ${input.previousElementSibling.textContent}`, 'error');
                return false;
            }
        }
        
        return true;
    }

    resetFormSteps() {
        this.currentStep = 1;
        this.goToStep(1);
    }

    setupFileUpload() {
        const fileInput = document.getElementById('photo');
        const uploadArea = document.getElementById('photoUpload');
        const imagePreview = document.getElementById('imagePreview');

        if (!uploadArea || !fileInput) return;

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                fileInput.files = files;
                this.handleFileSelect(files[0]);
            } else {
                this.showToast('Please upload a valid image file', 'error');
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });
    }

    handleFileSelect(file) {
        const imagePreview = document.getElementById('imagePreview');
        const uploadArea = document.getElementById('photoUpload');
        
        if (!file.type.startsWith('image/')) {
            this.showToast('Please select an image file', 'error');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showToast('Image size should be less than 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.innerHTML = `
                <img src="${e.target.result}" alt="Food preview">
                <button type="button" class="remove-image">
                    <i class="fas fa-times"></i>
                </button>
            `;
            imagePreview.classList.add('active');
            uploadArea.style.display = 'none';

            const removeBtn = imagePreview.querySelector('.remove-image');
            removeBtn.addEventListener('click', () => {
                imagePreview.innerHTML = '';
                imagePreview.classList.remove('active');
                uploadArea.style.display = 'block';
                document.getElementById('photo').value = '';
            });
        };
        reader.readAsDataURL(file);
    }

    setupFormHandling() {
        const form = document.getElementById('listingForm');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        const freshUntilInput = document.getElementById('freshUntil');
        if (freshUntilInput) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            freshUntilInput.min = now.toISOString().slice(0, 16);
        }
    }

    handleFormSubmission() {
        const formData = this.getFormData();
        
        if (this.validateFormData(formData)) {
            this.addNewListing(formData);
            this.showSuccessMessage();
            this.closeModalAndReset();
        }
    }

    getFormData() {
        return {
            id: Date.now(),
            foodType: document.getElementById('foodType').value,
            quantity: document.getElementById('quantity').value,
            category: document.getElementById('category').value,
            description: document.getElementById('description').value,
            freshUntil: document.getElementById('freshUntil').value,
            pickupTime: document.getElementById('pickupTime').value,
            location: document.getElementById('location').value,
            contact: document.getElementById('contact').value,
            photo: document.getElementById('photo').files[0],
            createdAt: new Date(),
            donor: this.userData ? this.userData.name : 'Current User'
        };
    }

    validateFormData(data) {
        const requiredFields = ['foodType', 'quantity', 'category', 'freshUntil', 'pickupTime', 'location', 'contact'];
        
        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showErrorMessage(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}.`);
                return false;
            }
        }
        
        const freshDate = new Date(data.freshUntil);
        if (freshDate <= new Date()) {
            this.showErrorMessage('Fresh until date must be in the future.');
            return false;
        }
        
        return true;
    }

    addNewListing(data) {
        this.foodListings.unshift(data);
        this.filterListings();
        this.renderFoodListings();
    }

    showSuccessMessage() {
        this.showToast('Food listing added successfully!', 'success');
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--primary-color)' : 'var(--secondary-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 3000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            box-shadow: var(--shadow-heavy);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    closeModalAndReset() {
        const modal = document.getElementById('addListingModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        this.resetForm();
    }

    resetForm() {
        const form = document.getElementById('listingForm');
        if (form) form.reset();
        
        const photoUpload = document.getElementById('photoUpload');
        if (photoUpload) {
            photoUpload.innerHTML = `
                <i class="fas fa-cloud-upload-alt"></i>
                <span>Drag & drop your image here or click to browse</span>
                <small>Supports: JPG, PNG, GIF (Max 5MB)</small>
            `;
        }
        
        const freshUntilInput = document.getElementById('freshUntil');
        if (freshUntilInput) {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            freshUntilInput.min = now.toISOString().slice(0, 16);
        }
    }

    setupFilteringAndSearch() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const searchInput = document.querySelector('.search-box input');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.currentFilter = btn.getAttribute('data-filter');
                this.filterListings();
                this.renderFoodListings();
            });
        });

        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value.toLowerCase();
                    this.filterListings();
                    this.renderFoodListings();
                }, 300);
            });
        }
    }

    filterListings() {
        this.filteredListings = this.foodListings.filter(listing => {
            const matchesFilter = this.currentFilter === 'all' || listing.category === this.currentFilter;
            const matchesSearch = !this.searchQuery || 
                listing.foodType.toLowerCase().includes(this.searchQuery) ||
                listing.location.toLowerCase().includes(this.searchQuery) ||
                listing.description.toLowerCase().includes(this.searchQuery);
            
            return matchesFilter && matchesSearch;
        });
    }

    setupSmoothScrolling() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const features = document.getElementById('features');
                if (features) {
                    features.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    setupResponsiveNav() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }
    }

    setupHeroButtons() {
        const donateBtn = document.getElementById('donateFood');
        const findBtn = document.getElementById('findFood');
        
        if (donateBtn) {
            donateBtn.addEventListener('click', () => {
                if (this.currentRole === 'donor') {
                    const modal = document.getElementById('addListingModal');
                    if (modal) {
                        // Check authentication
                        if (!this.isAuthenticated) {
                            this.showToast('Please login to add a listing', 'error');
                            setTimeout(() => {
                                window.location.href = '/login.html';
                            }, 1500);
                            return;
                        }
                        modal.style.display = 'block';
                        document.body.style.overflow = 'hidden';
                    }
                } else {
                    const listings = document.getElementById('listings');
                    if (listings) listings.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
        
        if (findBtn) {
            findBtn.addEventListener('click', () => {
                const listings = document.getElementById('listings');
                if (listings) listings.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }

    setupStatsAnimation() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            
            stat.style.cssText = `
                display: block !important;
                font-size: 2rem !important;
                font-weight: 700 !important;
                color: #FFC107 !important;
                animation: none !important;
                transform: none !important;
                transition: none !important;
            `;
            
            stat.textContent = target;
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (window.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = 'var(--shadow-light)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                    navbar.style.boxShadow = 'none';
                }
            }
        });
        
        this.setupScrollAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        const elementsToAnimate = document.querySelectorAll('.feature-card, .food-card, .impact-item');
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });
    }

    generateSampleListings() {
        const sampleListings = [
            {
                id: 1,
                foodType: "Fresh Pizza Margherita",
                quantity: "8 slices",
                category: "restaurant",
                description: "Freshly made pizza with mozzarella, tomato sauce, and basil. Perfect condition, just from lunch service.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "18:00",
                location: "Mario's Pizzeria, 123 Main Street",
                contact: "+1 234-567-8900",
                createdAt: new Date(Date.now() - 3600000),
                donor: "Mario's Pizzeria"
            },
            {
                id: 2,
                foodType: "Assorted Sandwiches",
                quantity: "15 sandwiches",
                category: "event",
                description: "Various sandwiches including turkey, ham, and vegetarian options from corporate catering event.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "16:30",
                location: "Downtown Conference Center",
                contact: "events@conference.com",
                createdAt: new Date(Date.now() - 7200000),
                donor: "Conference Center"
            },
            {
                id: 3,
                foodType: "Fresh Bread & Pastries",
                quantity: "20+ items",
                category: "bakery",
                description: "End-of-day fresh bread, croissants, and pastries. All baked today and still perfectly fresh.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "20:00",
                location: "Sunrise Bakery, Oak Avenue",
                contact: "+1 234-567-8901",
                createdAt: new Date(Date.now() - 1800000),
                donor: "Sunrise Bakery"
            },
            {
                id: 4,
                foodType: "Home-cooked Curry",
                quantity: "4-6 portions",
                category: "household",
                description: "Vegetarian curry with rice, made too much for family dinner. Spice level: medium.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "19:00",
                location: "Residential Area, Pine Street",
                contact: "+1 234-567-8902",
                createdAt: new Date(Date.now() - 900000),
                donor: "Local Family"
            },
            {
                id: 5,
                foodType: "Fruit & Vegetable Box",
                quantity: "1 large box",
                category: "restaurant",
                description: "Fresh produce that includes apples, oranges, carrots, and lettuce.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "17:00",
                location: "Green Garden Restaurant",
                contact: "+1 234-567-8903",
                createdAt: new Date(Date.now() - 5400000),
                donor: "Green Garden Restaurant"
            },
            {
                id: 6,
                foodType: "Grilled Chicken Meals",
                quantity: "12 complete meals",
                category: "restaurant",
                description: "Grilled chicken with rice and vegetables. Prepared for cancelled catering order.",
                freshUntil: this.getRandomFutureDate(),
                pickupTime: "18:30",
                location: "Healthy Eats Cafe, Market Square",
                contact: "+1 234-567-8904",
                createdAt: new Date(Date.now() - 2700000),
                donor: "Healthy Eats Cafe"
            }
        ];
        
        this.foodListings = sampleListings;
        this.filteredListings = sampleListings;
    }

    getRandomFutureDate() {
        const now = new Date();
        const hours = Math.floor(Math.random() * 48) + 2;
        const futureDate = new Date(now.getTime() + hours * 60 * 60 * 1000);
        return futureDate.toISOString().slice(0, 16);
    }

    renderFoodListings() {
        const foodGrid = document.getElementById('foodGrid');
        
        if (!foodGrid) return;
        
        if (this.filteredListings.length === 0) {
            foodGrid.innerHTML = `
                <div class="no-listings">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--medium-gray); margin-bottom: 1rem;"></i>
                    <h3>No listings found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }
        
        foodGrid.innerHTML = this.filteredListings.map(listing => this.createFoodCard(listing)).join('');
        this.setupFoodCardInteractions();
    }

    createFoodCard(listing) {
        const timeAgo = this.getTimeAgo(listing.createdAt);
        const freshUntil = this.formatDateTime(listing.freshUntil);
        const pickupTime = this.formatTime(listing.pickupTime);
        
        return `
            <div class="food-card" data-id="${listing.id}">
                <div class="food-image">
                    ${listing.photo ? `<img src="${URL.createObjectURL(listing.photo)}" alt="${listing.foodType}">` : `<i class="fas fa-${this.getFoodIcon(listing.category)}"></i>`}
                    <div class="food-category">${this.capitalizeFirst(listing.category)}</div>
                </div>
                <div class="food-details">
                    <h3 class="food-title">${listing.foodType}</h3>
                    <p class="food-description">${listing.description}</p>
                    <div class="food-meta">
                        <span class="quantity"><i class="fas fa-utensils"></i> ${listing.quantity}</span>
                        <span class="freshness"><i class="fas fa-clock"></i> ${freshUntil}</span>
                    </div>
                    <div class="food-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${listing.location}</span>
                    </div>
                    <div class="food-meta" style="margin-bottom: 1rem;">
                        <span style="color: var(--medium-gray); font-size: 0.9rem;">
                            <i class="fas fa-user"></i> ${listing.donor}
                        </span>
                        <span style="color: var(--medium-gray); font-size: 0.9rem;">
                            <i class="fas fa-clock"></i> ${timeAgo}
                        </span>
                    </div>
                    <div class="food-actions">
                        <button class="claim-btn" data-id="${listing.id}">
                            <i class="fas fa-hand-paper"></i> Claim Food
                        </button>
                        <button class="contact-btn" data-contact="${listing.contact}">
                            <i class="fas fa-phone"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupFoodCardInteractions() {
        const claimBtns = document.querySelectorAll('.claim-btn');
        claimBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const listingId = parseInt(btn.getAttribute('data-id'));
                this.handleClaimFood(listingId);
            });
        });
        
        const contactBtns = document.querySelectorAll('.contact-btn');
        contactBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contact = btn.getAttribute('data-contact');
                this.handleContactDonor(contact);
            });
        });
    }

    handleClaimFood(listingId) {
        // Check authentication
        if (!this.isAuthenticated) {
            this.showToast('Please login to claim food', 'error');
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 1500);
            return;
        }
        
        // Check if user is a collector
        if (this.currentRole !== 'collector') {
            this.showToast('Only collectors can claim food', 'error');
            return;
        }
        
        const listing = this.foodListings.find(l => l.id === listingId);
        if (!listing) return;
        
        const confirmed = confirm(`Claim "${listing.foodType}" from ${listing.donor}?\n\nPickup: ${listing.location}\nTime: ${this.formatTime(listing.pickupTime)}\nContact: ${listing.contact}`);
        
        if (confirmed) {
            this.foodListings = this.foodListings.filter(l => l.id !== listingId);
            this.filterListings();
            this.renderFoodListings();
            
            this.showToast(`Successfully claimed "${listing.foodType}"! Check your email for pickup details.`, 'success');
            
            const card = document.querySelector(`[data-id="${listingId}"]`);
            if (card) {
                card.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    this.renderFoodListings();
                }, 300);
            }
        }
    }

    handleContactDonor(contact) {
        navigator.clipboard.writeText(contact).then(() => {
            this.showToast('Contact information copied to clipboard!', 'success');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = contact;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Contact information copied to clipboard!', 'success');
        });
    }

    getFoodIcon(category) {
        const icons = {
            restaurant: 'store',
            household: 'home',
            bakery: 'bread-slice',
            event: 'calendar-alt'
        };
        return icons[category] || 'utensils';
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getTimeAgo(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        
        if (minutes < 60) {
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            const days = Math.floor(hours / 24);
            return `${days}d ago`;
        }
    }

    formatDateTime(dateTimeString) {
        const date = new Date(dateTimeString);
        const now = new Date();
        const diff = date - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 24) {
            return `${hours}h left`;
        } else {
            const days = Math.floor(hours / 24);
            return `${days}d left`;
        }
    }

    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const date = new Date();
        date.setHours(hours, minutes);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    startAnimations() {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
        });
        
        this.startFloatingAnimations();
        this.startButtonPulse();
    }

    startFloatingAnimations() {
        const floatingElements = document.querySelectorAll('.floating-card');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
        });
    }

    startButtonPulse() {
        const ctaButtons = document.querySelectorAll('.btn-primary');
        setInterval(() => {
            ctaButtons.forEach((btn, index) => {
                setTimeout(() => {
                    btn.style.animation = 'pulse 0.6s ease';
                    setTimeout(() => {
                        btn.style.animation = '';
                    }, 600);
                }, index * 200);
            });
        }, 10000);
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }, 1500);
        }
    }
}

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: scale(1);
            }
            to {
                opacity: 0;
                transform: scale(0.8);
            }
        }
        
        .animate-in {
            animation: slideInUp 0.6s ease forwards;
        }
        
        .no-listings {
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem 2rem;
            color: var(--medium-gray);
        }
        
        .no-listings h3 {
            margin-bottom: 0.5rem;
            color: var(--dark-gray);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
        
        .role-switch.disabled {
            pointer-events: none;
            cursor: not-allowed !important;
        }
        
        @media (max-width: 768px) {
            .nav-menu.active {
                display: flex;
                position: fixed;
                top: 70px;
                left: 0;
                width: 100%;
                height: calc(100vh - 70px);
                background: rgba(255, 255, 255, 0.98);
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                padding-top: 2rem;
                backdrop-filter: blur(10px);
                animation: slideInUp 0.3s ease;
            }
            
            .nav-menu.active .nav-link {
                margin: 1rem 0;
                font-size: 1.2rem;
            }
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
    addDynamicStyles();
    new ShareBite();
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

window.ShareBite = ShareBite;

window.clearShareBiteCaches = async function() {
    if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
        console.log('[ShareBite] All caches cleared');
    }
    if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage('SKIP_WAITING');
        console.log('[ShareBite] Sent SKIP_WAITING to service worker');
    }
};