
// Sistema de autenticación - ColabU (Con prevención de autofill)
console.log('=== AUTH.JS CARGADO ===');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando auth...');
    initializeAuth();
});

function initializeAuth() {
    console.log('Inicializando sistema de autenticación...');
    
    if (isLoginPage()) {
        setupLoginPage();
    } else if (isRegisterPage()) {
        setupRegisterPage();
    }
}

function setupLoginPage() {
    console.log('Configurando página de login...');
    
    // PREVENIR AUTOFILL - Esto es crucial
    preventAutofill();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // Limpiar formulario completamente
        clearLoginForm();
        
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
        
        showDemoCredentials();
    }
}

function preventAutofill() {
    console.log('Preveniendo autofill...');
    
    // Truco para prevenir autofill - crear campos falsos
    const fakeFields = `
        <div style="display: none;">
            <input type="text" name="username" value="">
            <input type="password" name="password" value="">
        </div>
    `;
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.insertAdjacentHTML('afterbegin', fakeFields);
    }
    
    // Deshabilitar autocomplete en campos reales
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.setAttribute('autocomplete', 'new-email');
        emailInput.setAttribute('autocapitalize', 'off');
        emailInput.setAttribute('spellcheck', 'false');
    }
    
    if (passwordInput) {
        passwordInput.setAttribute('autocomplete', 'new-password');
    }
}

function clearLoginForm() {
    console.log('Limpiando formulario de login...');
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) {
        emailInput.value = '';
        emailInput.focus();
    }
    
    if (passwordInput) {
        passwordInput.value = '';
    }
    
    // Forzar limpieza del autofill del navegador
    setTimeout(() => {
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
    }, 100);
}

function setupRegisterPage() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
    }
}

function handleLogin() {
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value;

    console.log('Intentando login con:', email);

    if (!email || !password) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }

    // Usuarios demo predefinidos
    const demoUsers = {
        'admin@universidad.edu': { password: 'admin123', role: 'admin', name: 'Administrador Sistema' },
        'ana@universidad.edu': { password: '123456', role: 'teacher', name: 'Ana García' },
        'carlos@universidad.edu': { password: '123456', role: 'student', name: 'Carlos López' },
        'maria@universidad.edu': { password: '123456', role: 'student', name: 'María Rodríguez' }
    };

    const userCreds = demoUsers[email];
    
    if (userCreds && userCreds.password === password) {
        console.log('Credenciales válidas para:', email);
        
        // Crear objeto usuario
        const user = {
            id: email === 'admin@universidad.edu' ? 999 : Date.now(),
            full_name: userCreds.name,
            email: email,
            role: userCreds.role,
            institution: 'universidad',
            login_time: new Date().toISOString()
        };

        // Guardar en localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Usuario guardado en localStorage');
        
        showAlert(`¡Bienvenido ${user.full_name}!`, 'success');
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            redirectByRole(user.role);
        }, 1000);
    } else {
        console.log('Credenciales inválidas para:', email);
        showAlert('Credenciales incorrectas. Usa las credenciales demo proporcionadas.', 'error');
    }
}

function handleRegister() {
    const fullName = document.getElementById('fullName')?.value.trim();
    const email = document.getElementById('regEmail')?.value.trim();
    const password = document.getElementById('regPassword')?.value;
    const role = document.querySelector('input[name="role"]:checked')?.value;

    if (!fullName || !email || !password || !role) {
        showAlert('Por favor completa todos los campos', 'error');
        return;
    }

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

    // Crear nuevo usuario
    const newUser = {
        id: Date.now(),
        full_name: fullName,
        email: email,
        password: password,
        role: role,
        institution: 'universidad',
        created_at: new Date().toISOString()
    };

    // Guardar en la lista de usuarios
    const users = JSON.parse(localStorage.getItem('colabu_users') || '[]');
    users.push(newUser);
    localStorage.setItem('colabu_users', JSON.stringify(users));

    // También guardar como usuario actual
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    showAlert(`¡Cuenta creada exitosamente! Bienvenid@ ${fullName}`, 'success');
    
    setTimeout(() => {
        redirectByRole(role);
    }, 1500);
}

function showDemoCredentials() {
    if (!isLoginPage()) return;

    const demoHTML = `
        <div class="demo-credentials">
            <h4>👤 Usuarios de Prueba</h4>
            <div class="demo-account">
                <strong>Admin:</strong> admin@universidad.edu / admin123
            </div>
            <div class="demo-account">
                <strong>Docente:</strong> ana@universidad.edu / 123456
            </div>
            <div class="demo-account">
                <strong>Estudiante:</strong> carlos@universidad.edu / 123456
            </div>
            <div class="demo-buttons">
                <button type="button" class="auto-fill-btn" onclick="autoFillDemo('admin')">Admin</button>
                <button type="button" class="auto-fill-btn" onclick="autoFillDemo('teacher')">Docente</button>
                <button type="button" class="auto-fill-btn" onclick="autoFillDemo('student')">Estudiante</button>
            </div>
        </div>
    `;

    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        const existingDemo = formContainer.querySelector('.demo-credentials');
        if (existingDemo) {
            existingDemo.remove();
        }
        formContainer.insertAdjacentHTML('afterbegin', demoHTML);
    }
}

function autoFillDemo(role) {
    const credentials = {
        'admin': { email: 'admin@universidad.edu', password: 'admin123' },
        'teacher': { email: 'ana@universidad.edu', password: '123456' },
        'student': { email: 'carlos@universidad.edu', password: '123456' }
    };
    
    const creds = credentials[role];
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput && passwordInput) {
        emailInput.value = creds.email;
        passwordInput.value = creds.password;
        showAlert(`Credenciales de ${role} cargadas`, 'success');
    }
}

function isLoginPage() {
    return window.location.pathname.includes('login.html');
}

function isRegisterPage() {
    return window.location.pathname.includes('register.html');
}

function redirectByRole(role) {
    let targetPage = 'resumen.html';
    
    switch(role) {
        case 'teacher':
            targetPage = 'docente.html';
            break;
        case 'admin':
            targetPage = 'admin.html';
            break;
        case 'student':
        default:
            targetPage = 'resumen.html';
    }

    console.log('Redirigiendo a:', targetPage, 'para rol:', role);
    window.location.href = targetPage;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert-toast');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alert = document.createElement('div');
    alert.className = `alert-toast alert-${type}`;
    alert.innerHTML = `
        <div class="alert-content">
            <span class="alert-icon">${type === 'success' ? '✅' : '❌'}</span>
            <span class="alert-message">${message}</span>
        </div>
    `;

    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : '#f8d7da'};
        color: ${type === 'success' ? '#155724' : '#721c24'};
        padding: 15px 20px;
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'};
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(alert);

    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}

// Hacer funciones globales
window.autoFillDemo = autoFillDemo;

// Agregar estilos CSS
const authStyles = `
    <style>
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .demo-credentials {
            background: #e3f2fd;
            border: 2px solid #2196f3;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }

        .demo-credentials h4 {
            margin: 0 0 15px 0;
            color: #1976d2;
            font-size: 1.2rem;
        }

        .demo-account {
            background: white;
            border: 1px solid #bbdefb;
            border-radius: 8px;
            padding: 12px;
            margin: 8px 0;
            font-family: 'Courier New', monospace;
            font-weight: 600;
        }

        .demo-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 15px;
            flex-wrap: wrap;
        }

        .auto-fill-btn {
            background: #2196f3;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
        }

        .auto-fill-btn:hover {
            background: #1976d2;
            transform: translateY(-2px);
        }

        /* Prevenir estilos de autofill del navegador */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
            -webkit-text-fill-color: #2c3e50 !important;
            -webkit-box-shadow: 0 0 0px 1000px #f8f9fa inset !important;
            transition: background-color 5000s ease-in-out 0s;
        }
    </style>
`;

if (!document.querySelector('#auth-styles')) {
    document.head.insertAdjacentHTML('beforeend', authStyles);
}

console.log('Auth system loaded successfully');