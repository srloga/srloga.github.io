// Menu toggle para dispositivos móveis
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('show');
            }
        });
    });

    // Form submission
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
                alert('Por favor, preencha todos os campos obrigatórios.');
                return;
            }
            
            // Envio do formulário
            const formData = new FormData(this);
            
            fetch('send.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                if (data === 'success') {
                    window.location.href = 'sucesso.html';
                } else {
                    alert('Erro ao enviar mensagem. Tente novamente.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Erro ao enviar mensagem. Tente novamente.');
            });
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
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Adicionar classe active aos itens do menu quando estiverem na viewport
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav a');
    
    function setActiveMenu() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 100)) {
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
        const elements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .timeline-item, .education-card, .certification-card');
        
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
    const animatedElements = document.querySelectorAll('.skill-card, .project-card, .contact-item, .timeline-item, .education-card, .certification-card');
    animatedElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(20px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    window.addEventListener('scroll', animateOnScroll);
    
    // Executar uma vez no carregamento para elementos já visíveis
    setTimeout(animateOnScroll, 100);
});

// Fechar menu ao clicar fora (para mobile)
document.addEventListener('click', function(e) {
    const navMenu = document.getElementById('navMenu');
    const menuToggle = document.getElementById('menuToggle');
    
    if (navMenu && navMenu.classList.contains('show') && 
        !navMenu.contains(e.target) && 
        menuToggle && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('show');
    }
});

console.log('Portfólio Lucas Ramos carregado com sucesso!');