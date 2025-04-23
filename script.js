// Constantes e Variáveis Globais
const MAX_ITEMS = 10;
let cart = [];

// Elementos do DOM
const elements = {
    cartIcon: document.getElementById('cartIcon'),
    cartCount: document.getElementById('cartCount'),
    cartOverlay: document.getElementById('cartOverlay'),
    closeCart: document.getElementById('closeCart'),
    cartItems: document.getElementById('cartItems'),
    cartTotal: document.getElementById('cartTotal'),
    addToCartButtons: document.querySelectorAll('.add-to-cart'),
    checkoutBtn: document.getElementById('checkoutBtn'),
    continueShoppingBtn: document.getElementById('continueShoppingBtn'),
    modalOverlay: document.getElementById('modalOverlay'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    heroBtn: document.getElementById('heroBtn'),
    logo: document.getElementById('logo'),
    navLinks: document.querySelectorAll('.nav-link'),
    limitCounter: document.getElementById('limitCounter'),
    limitProgressBar: document.getElementById('limitProgressBar'),
    cartFullMessage: document.getElementById('cartFullMessage')
};

// Carrossel automático
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function showSlide(n) {
    // Remove a classe 'active' de todos os slides e dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Atualiza o índice do slide atual
    currentSlide = (n + slides.length) % slides.length;
    
    // Adiciona a classe 'active' ao slide e dot atual
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function startCarousel() {
    slideInterval = setInterval(nextSlide, 3000); // Muda a cada 3 segundos
}

// Inicia o carrossel
startCarousel();

// Pausa o carrossel quando o mouse está sobre ele
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

// Retoma o carrossel quando o mouse sai
carouselContainer.addEventListener('mouseleave', startCarousel);

// Navegação pelos dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        startCarousel();
    });
});

// Event Listeners
function setupEventListeners() {
    // Carrinho
    elements.cartIcon.addEventListener('click', toggleCart);
    elements.closeCart.addEventListener('click', closeCart);
    elements.continueShoppingBtn.addEventListener('click', closeCart);
    
    // Produtos
    elements.addToCartButtons.forEach(button => {
        button.addEventListener('click', () => addToCart(
            button.getAttribute('data-id'),
            button.getAttribute('data-name'),
            parseFloat(button.getAttribute('data-price')),
            button.getAttribute('data-image'),
            button
        ));
    });
    
    // Finalização
    elements.checkoutBtn.addEventListener('click', checkout);
    elements.closeModalBtn.addEventListener('click', closeModal);
    
    // Navegação
    elements.heroBtn.addEventListener('click', () => scrollToSection('novidades'));
    elements.logo.addEventListener('click', scrollToTop);
    
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToSection(link.getAttribute('data-section'));
        });
    });
    
    // Carrossel automático
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const dots = document.querySelectorAll('.dot');
let slideInterval;

function showSlide(n) {
    // Remove a classe 'active' de todos os slides e dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Atualiza o índice do slide atual
    currentSlide = (n + slides.length) % slides.length;
    
    // Adiciona a classe 'active' ao slide e dot atual
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function startCarousel() {
    slideInterval = setInterval(nextSlide, 3000); // Muda a cada 3 segundos
}

// Inicia o carrossel
startCarousel();

// Pausa o carrossel quando o mouse está sobre ele
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

// Retoma o carrossel quando o mouse sai
carouselContainer.addEventListener('mouseleave', startCarousel);

// Navegação pelos dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        startCarousel();
    });
});

// Renderização
function renderCart() {
    if (cart.length === 0) {
        elements.cartItems.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
        elements.cartTotal.textContent = 'R$ 0,00';
        return;
    }
    
    elements.cartItems.innerHTML = '';
    let total = 0;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-price">R$ ${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${item.id}" ${totalItems >= MAX_ITEMS ? 'disabled' : ''}>+</button>
                </div>
                <p class="cart-item-price">R$ ${itemTotal.toFixed(2)}</p>
                <button class="cart-item-remove" data-id="${item.id}">Remover</button>
            </div>
        `;
        
        elements.cartItems.appendChild(cartItemElement);
    });
    
    // Adicionar eventos dinâmicos
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', () => removeFromCart(button.getAttribute('data-id')));
    });
    
    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', () => updateQuantity(button.getAttribute('data-id'), -1));
    });
    
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', () => updateQuantity(button.getAttribute('data-id'), 1));
    });
    
    elements.cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Atualização de Estado
function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Atualizar contador
    elements.cartCount.textContent = totalItems;
    elements.limitCounter.textContent = `${totalItems}/${MAX_ITEMS}`;
    
    // Atualizar barra de progresso
    const progressWidth = (totalItems / MAX_ITEMS) * 100;
    elements.limitProgressBar.style.width = `${progressWidth}%`;
    elements.limitProgressBar.style.backgroundColor = progressWidth > 80 ? '#ff5a5f' : '#111';
    
    // Atualizar botão de finalizar
    elements.checkoutBtn.disabled = cart.length === 0;
    elements.checkoutBtn.classList.toggle('btn-disabled', cart.length === 0);
    
    // Salvar no localStorage
    localStorage.setItem('nikeCart', JSON.stringify(cart));
}

// Funções de UI
function toggleCart() {
    elements.cartOverlay.style.display = 'flex';
    renderCart();
}

function closeCart() {
    elements.cartOverlay.style.display = 'none';
}

function checkout() {
    if (cart.length === 0) return;
    
    elements.modalOverlay.style.display = 'flex';
    cart = [];
    updateCart();
    renderCart();
    closeCart();
}

function closeModal() {
    elements.modalOverlay.style.display = 'none';
}

function showAddedFeedback(button) {
    button.textContent = 'Adicionado!';
    setTimeout(() => {
        button.textContent = 'Adicionar ao Carrinho';
    }, 1000);
}

function showLimitMessage() {
    elements.cartFullMessage.style.display = 'block';
    setTimeout(() => {
        elements.cartFullMessage.style.display = 'none';
    }, 3000);
}

// Navegação
function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Persistência
function loadCart() {
    const savedCart = localStorage.getItem('nikeCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', init);
