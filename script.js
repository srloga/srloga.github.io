// Menu toggle para dispositivos móveis
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('show');
            // Adiciona overlay quando menu está aberto
            if (navMenu.classList.contains('show')) {
                createOverlay();
            } else {
                removeOverlay();
            }
        });
    }

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('show')) {
                navMenu.classList.remove('show');
                removeOverlay();
            }
        });
    });

    // Form submission - VERSÃO FORMSPREE
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação básica
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !subject || !message) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // Envio do formulário via Formspree
            const formData = new FormData(this);
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Mostrar loading
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            // ENVIO FORMSPREE - Substitui o PHP
            fetch('https://formspree.io/f/mkgenwqa', {
                method: "POST",
                headers: { 
                    "Accept": "application/json"
                },
                body: formData
            })
            .then(response => {
                console.log('Status da resposta:', response.status);
                if (response.ok) {
                    // Formspree retorna 200 OK quando o formulário é aceito
                    return response.json();
                } else {
                    throw new Error('Erro no envio do formulário');
                }
            })
            .then(data => {
                console.log('Resposta do Formspree:', data);
                showNotification('Mensagem enviada com sucesso!', 'success');
                contactForm.reset();
                
                // Redirecionar para página de sucesso após 1.5 segundos
                setTimeout(() => {
                    window.location.href = 'sucesso.html';
                }, 1500);
            })
            .catch(error => {
                console.error('Erro completo:', error);
                showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
            })
            .finally(() => {
                // Restaurar botão
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });

            // CÓDIGO PHP ORIGINAL - MANTIDO COMENTADO PARA REFERÊNCIA
            /*
            fetch('send.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na rede');
                }
                return response.text();
            })
            .then(data => {
                if (data === 'success') {
                    showNotification('Mensagem enviada com sucesso!', 'success');
                    contactForm.reset();
                    // Redirecionar após sucesso
                    setTimeout(() => {
                        window.location.href = 'sucesso.html';
                    }, 1500);
                } else {
                    throw new Error(data);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Erro ao enviar mensagem. Tente novamente.', 'error');
            })
            .finally(() => {
                // Restaurar botão
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            });
            */
        });
    }

    // Scroll suave para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Fechar menu mobile se estiver aberto
                if (navMenu && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    removeOverlay();
                }
                
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Adicionar classe active aos itens do menu quando estiverem na viewport
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav a[href^="#"]');
    
    function setActiveMenu() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', setActiveMenu);
    
    // Animação de entrada dos elementos
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .timeline-item, .education-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Configurar estado inicial para animação
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .timeline-item, .education-card');
    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Executar uma vez no carregamento para elementos já visíveis
    setTimeout(animateOnScroll, 100);
    
    // Prevenir zoom em inputs no iOS
    disableIosZoom();
});

// Função para criar overlay quando menu está aberto
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'navOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        backdrop-filter: blur(2px);
    `;
    overlay.addEventListener('click', function() {
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.classList.remove('show');
        }
        removeOverlay();
    });
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
}

// Função para remover overlay
function removeOverlay() {
    const overlay = document.getElementById('navOverlay');
    if (overlay) {
        overlay.remove();
    }
    document.body.style.overflow = '';
}

// Fechar menu ao clicar fora (para mobile)
document.addEventListener('click', function(e) {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (navMenu && navMenu.classList.contains('show') && 
        !navMenu.contains(e.target) && 
        menuToggle && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('show');
        removeOverlay();
    }
});

// Função para mostrar notificações
function showNotification(message, type) {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        transform: translateX(400px);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #00b300, #008000)';
        notification.style.borderLeft = '4px solid #00ff00';
    } else {
        notification.style.background = 'linear-gradient(135deg, #ff3333, #cc0000)';
        notification.style.borderLeft = '4px solid #ff6666';
    }
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
    
    // Fechar ao clicar
    notification.addEventListener('click', function() {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    });
}

// Prevenir zoom em inputs no iOS
function disableIosZoom() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
}

// Melhorar performance do scroll
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(function() {
            scrollTimeout = null;
            // Atualizar menu ativo
            const setActiveMenu = window.setActiveMenu;
            if (setActiveMenu) setActiveMenu();
            
            // Atualizar animações
            const animateOnScroll = window.animateOnScroll;
            if (animateOnScroll) animateOnScroll();
        }, 100);
    }
});

// Suporte para touch events melhorado
document.addEventListener('touchstart', function() {}, { passive: true });

// Detectar redimensionamento da janela e ajustar layout
window.addEventListener('resize', function() {
    const navMenu = document.getElementById('navMenu');
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        removeOverlay();
    }
});

// Suporte para teclado - fechar menu com ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('show')) {
            navMenu.classList.remove('show');
            removeOverlay();
        }
    }
});

// Inicializar quando a página estiver completamente carregada
window.addEventListener('load', function() {
    // Forçar repaint para alguns elementos
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 50);
    
    // Verificar se é um dispositivo touch
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch-device');
    }
});

console.log('Portfólio Lucas Ramos carregado com sucesso!');
console.log('Formspree integrado: https://formspree.io/f/mkgenwqa');