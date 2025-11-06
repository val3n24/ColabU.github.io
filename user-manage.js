
// Gestión de usuarios simplificada - ColabU
document.addEventListener('DOMContentLoaded', function() {
    console.log('User manager initializing...');
    initializeUserManager();
});

function initializeUserManager() {
    // No hacer nada en páginas de auth o index
    if (isAuthPage() || isIndexPage()) {
        console.log('En página de auth o index, no inicializando user manager');
        return;
    }

    // Verificar si el usuario está logueado
    const currentUser = getCurrentUser();
    if (!currentUser) {
        console.log('No hay usuario logueado, redirigiendo al login...');
        showAuthAlert('Por favor inicia sesión primero');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    console.log('Usuario logueado:', currentUser.email);
    // Actualizar la UI con la información del usuario
    updateUserUI(currentUser);
}

function getCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (e) {
            console.error('Error parsing user data:', e);
            return null;
        }
    }
    return null;
}

function isAuthPage() {
    const path = window.location.pathname;
    return path.includes('login.html') || path.includes('register.html');
}

function isIndexPage() {
    const path = window.location.pathname;
    return path.endsWith('index.html') || path.endsWith('/') || path.includes('index.html');
}

function updateUserUI(user) {
    console.log('Actualizando UI para usuario:', user.full_name);
    
    // Actualizar nombre de usuario
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = user.full_name || 'Usuario';
    }

    // Actualizar avatar
    const userAvatarElement = document.getElementById('userAvatar');
    if (userAvatarElement) {
        userAvatarElement.textContent = getUserInitials(user.full_name);
    }

    // Configurar logout
    setupLogout();
}

function getUserInitials(name) {
    if (!name) return 'US';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function setupLogout() {
    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
}

function logout() {
    console.log('Cerrando sesión...');
    localStorage.removeItem('currentUser');
    showAlert('Sesión cerrada correctamente', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function showAuthAlert(message) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        padding: 15px 20px;
        color: #856404;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}

function showAlert(message, type) {
    const alert = document.createElement('div');
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
    alert.textContent = message;
    document.body.appendChild(alert);

    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 3000);
}

console.log('User manager loaded successfully');