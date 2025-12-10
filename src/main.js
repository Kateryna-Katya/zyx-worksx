document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. ИНИЦИАЛИЗАЦИЯ ИКОНОК (LUCIDE)
    // ==========================================
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ==========================================
    // 2. МОБИЛЬНОЕ МЕНЮ
    // ==========================================
    const burgerBtn = document.querySelector('.header__burger');
    const closeBtn = document.querySelector('.mobile-menu__close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuLinks = document.querySelectorAll('.mobile-menu__link');

    function toggleMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.toggle('active');
        // Блокируем скролл фона при открытом меню
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    if(burgerBtn) burgerBtn.addEventListener('click', toggleMenu);
    if(closeBtn) closeBtn.addEventListener('click', toggleMenu);
    
    // Закрываем меню при клике на любую ссылку
    menuLinks.forEach(link => link.addEventListener('click', () => {
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    }));

    // ==========================================
    // 3. АНИМАЦИИ (AOS & GSAP)
    // ==========================================
    
    // Инициализация AOS (анимация при скролле для блоков)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            disable: 'mobile' // Опционально: отключить на совсем старых телефонах
        });
    }

    // GSAP Hero Animation (Последовательное появление)
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const tl = gsap.timeline();
        
        tl.from('.hero__badge', { y: -20, opacity: 0, duration: 0.5, delay: 0.2 })
          .from('.hero__title', { y: 30, opacity: 0, duration: 0.8 }, "-=0.3")
          .from('.hero__desc', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
          .from('.hero__actions', { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
          .from('.hero__image-wrapper', { scale: 0.95, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.6")
          .from('.hero__stats', { opacity: 0, duration: 0.8 }, "-=0.8");
    }

    // ==========================================
    // 4. СЛАЙДЕР (SWIPER)
    // ==========================================
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper('.innovations-slider', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            grabCursor: true, // Курсор "рука"
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    }

    // ==========================================
    // 5. КОНТАКТНАЯ ФОРМА (ВАЛИДАЦИЯ + КАПЧА)
    // ==========================================
    const form = document.getElementById('contactForm');
    
    if (form) {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const consentCheckbox = document.getElementById('consent');
        const checkboxGroup = document.querySelector('.checkbox-group');
        const successMsg = document.getElementById('formSuccess');
        
        const captchaQ = document.getElementById('captchaQuestion');
        const captchaA = document.getElementById('captchaAnswer');

        // Генерация капчи (случайные числа 1-10)
        let num1 = Math.floor(Math.random() * 10) + 1;
        let num2 = Math.floor(Math.random() * 10) + 1;
        if(captchaQ) captchaQ.textContent = `${num1} + ${num2} = ?`;

        // Маска телефона (запрет ввода букв)
        if(phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // 1. Сброс предыдущих ошибок
            const allInputs = document.querySelectorAll('.form__input');
            allInputs.forEach(input => input.classList.remove('error'));
            if(checkboxGroup) checkboxGroup.classList.remove('error');

            // 2. Проверка пустых полей
            [nameInput, emailInput, phoneInput, captchaA].forEach(input => {
                if(!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                }
            });

            // 3. Проверка Email (Regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value && !emailRegex.test(emailInput.value)) {
                emailInput.classList.add('error');
                isValid = false;
            }

            // 4. Проверка Капчи
            if (captchaA.value && parseInt(captchaA.value) !== num1 + num2) {
                captchaA.classList.add('error');
                alert('Неверное решение примера'); 
                isValid = false;
            }

            // 5. СТРОГАЯ ПРОВЕРКА ЧЕКБОКСА
            if (!consentCheckbox.checked) {
                if(checkboxGroup) checkboxGroup.classList.add('error');
                isValid = false;
                // Не отправляем форму, если чекбокс пуст
            }

            // 6. Отправка (Имитация)
            if (isValid) {
                const btn = form.querySelector('button[type="submit"]');
                const btnText = btn.textContent;
                
                btn.textContent = 'Отправка...';
                btn.disabled = true;

                // Имитация AJAX-запроса
                setTimeout(() => {
                    form.reset();
                    btn.textContent = btnText;
                    btn.disabled = false;
                    btn.style.display = 'none'; // Скрываем кнопку
                    if(successMsg) successMsg.style.display = 'block'; // Показываем "Спасибо"
                    
                    // Обновляем капчу на случай повторной отправки (если сброс формы не полный перезагруз)
                    num1 = Math.floor(Math.random() * 10) + 1;
                    num2 = Math.floor(Math.random() * 10) + 1;
                    if(captchaQ) captchaQ.textContent = `${num1} + ${num2} = ?`;
                }, 1500);
            }
        });
    }

    // ==========================================
    // 6. COOKIE POPUP
    // ==========================================
    const cookiePopup = document.getElementById('cookiePopup');
    const acceptCookie = document.getElementById('acceptCookie');

    if (cookiePopup && acceptCookie) {
        // Проверяем localStorage
        if (!localStorage.getItem('cookiesAccepted')) {
            // Показываем с задержкой 2 секунды
            setTimeout(() => {
                cookiePopup.style.display = 'block';
                // Анимация появления (если GSAP подключен)
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(cookiePopup, 
                        { y: 50, opacity: 0 }, 
                        { y: 0, opacity: 1, duration: 0.5 }
                    );
                }
            }, 2000);
        }

        acceptCookie.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            
            // Анимация исчезновения
            if (typeof gsap !== 'undefined') {
                gsap.to(cookiePopup, { 
                    y: 20, 
                    opacity: 0, 
                    duration: 0.4, 
                    onComplete: () => {
                        cookiePopup.style.display = 'none';
                    }
                });
            } else {
                cookiePopup.style.display = 'none';
            }
        });
    }
});