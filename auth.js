// Sistema de autenticación simple para pruebas
document.addEventListener('DOMContentLoaded', function() {
    // Usuario de ejemplo
    const demoUser = {
        id: 1,
        full_name: 'Ana García',
        email: 'ana@universidad.edu',
        password: '123456',
        role: 'teacher',
        institution: 'universidad'
    };

    // Verificar si ya está logueado
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser && !isAuthPage()) {
        window.location.href = 'grupos.html';
        return;
    }

    // Formulario de Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Mostrar credenciales de ejemplo
        showDemoCredentials();
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

     // En auth.js, en el login
if (email === demoUser.email && password === demoUser.password) {
    // Asegurarnos de guardar todos los datos necesarios
    const userToSave = {
        id: demoUser.id,
        full_name: demoUser.full_name,
        email: demoUser.email,
        role: demoUser.role,
        institution: demoUser.institution
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userToSave));
    showAlert('¡Bienvenid@!', 'success');
    
    setTimeout(() => {
        window.location.href = 'grupos.html';
    }, 1000);

            } else {
                showAlert('Credenciales incorrectas. Usa: ana@universidad.edu / 123456', 'error');
            }
        });
    }

    // Formulario de Registro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const role = document.querySelector('input[name="role"]:checked').value;

            // Validaciones básicas
            if (fullName.length < 3) {
                showAlert('El nombre debe tener al menos 3 caracteres', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showAlert('Por favor ingresa un correo válido', 'error');
                return;
            }

            if (password.length < 6) {
                showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }

            // Registrar usuario (simulado)
            const newUser = {
                id: Date.now(),
                full_name: fullName,
                email: email,
                password: password,
                role: role,
                institution: 'universidad',
                created_at: new Date().toISOString()
            };

            // Guardar en localStorage
            const existingUsers = JSON.parse(localStorage.getItem('colabu_users') || '[]');
            existingUsers.push(newUser);
            localStorage.setItem('colabu_users', JSON.stringify(existingUsers));

            showAlert(`¡Cuenta creada exitosamente! Rol: ${role === 'teacher' ? 'Docente' : 'Estudiante'}`, 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        });
    }

    function showDemoCredentials() {
        // Solo mostrar en login, no en registro
        if (window.location.pathname.includes('login.html')) {
            const demoInfo = document.createElement('div');
            demoInfo.className = 'demo-credentials';
            demoInfo.innerHTML = `
                <h4>👤 Usuario de Prueba</h4>
                <div class="demo-email">ana@universidad.edu</div>
                <div class="demo-password">123456</div>
                <button class="auto-fill-btn" onclick="autoFill()">Autocompletar</button>
            `;
            
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                formContainer.insertBefore(demoInfo, formContainer.firstChild);
            }
        }
    }

    function isAuthPage() {
        return window.location.pathname.includes('login.html') || 
               window.location.pathname.includes('register.html') ||
               window.location.pathname.endsWith('index.html');
    }
});

// Función global para autocompletar login (solo para login)
function autoFill() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && passwordInput) {
        emailInput.value = 'ana@universidad.edu';
        passwordInput.value = '123456';
        showAlert('Credenciales cargadas. Haz clic en "Iniciar Sesión"', 'success');
    }
}

// Función para mostrar alertas
function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        alert.style.background = '#28a745';
    } else if (type === 'error') {
        alert.style.background = '#dc3545';
    } else if (type === 'info') {
        alert.style.background = '#17a2b8';
    }
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 4000);
}

// Función para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Añadir estilos CSS para la animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);