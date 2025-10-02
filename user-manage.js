// user-manager.js - Gestión de usuario y sesión
document.addEventListener('DOMContentLoaded', function() {
    initializeUser();
});

function initializeUser() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) {
        // Si no hay usuario logueado, redirigir al login
        if (!isAuthPage()) {
            window.location.href = 'login.html';
        }
        return;
    }

    // Actualizar información del usuario en todas las páginas
    updateUserInfo(currentUser);
    setupLogout();
}

function updateUserInfo(user) {
    const userNameElement = document.getElementById('userName');
    const userAvatarElement = document.getElementById('userAvatar');
    
    if (userNameElement) {
        userNameElement.textContent = user.full_name || 'Usuario';
    }
    
    if (userAvatarElement) {
        userAvatarElement.textContent = getInitials(user.full_name || 'US');
    }
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function setupLogout() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function isAuthPage() {
    return window.location.pathname.includes('login.html') || 
           window.location.pathname.includes('register.html') ||
           window.location.pathname.endsWith('index.html');
}

// Hacer funciones globales
window.logout = logout;