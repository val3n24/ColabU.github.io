
// Panel de Administración - ColabU
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin panel initializing...');
    
    if (!userManager.currentUser || userManager.currentUser.role !== 'admin') {
        alert('Acceso denegado. Esta página es solo para administradores.');
        window.location.href = 'login.html';
        return;
    }

    loadAdminDashboard();
});

function loadAdminDashboard() {
    updateAdminStats();
    loadUsersTable();
    loadGroupsTable();
    loadSystemReports();
}

function updateAdminStats() {
    const users = JSON.parse(localStorage.getItem('colabu_users') || '[]');
    const groups = JSON.parse(localStorage.getItem('colabu_groups') || '[]');
    
    const totalUsers = users.length;
    const teachers = users.filter(u => u.role === 'teacher').length;
    const students = users.filter(u => u.role === 'student').length;
    const totalGroups = groups.length;

    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalTeachers').textContent = teachers;
    document.getElementById('totalStudents').textContent = students;
    document.getElementById('totalGroups').textContent = totalGroups;
}

function loadUsersTable() {
    const users = JSON.parse(localStorage.getItem('colabu_users') || '[]');
    const container = document.getElementById('usersTableBody');
    
    if (!container) return;

    container.innerHTML = '';

    if (users.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <p>No hay usuarios registrados</p>
                    <p>Usa el botón "Agregar Usuario" para crear el primero</p>
                </td>
            </tr>
        `;
        return;
    }

    users.forEach(user => {
        const row = createUserTableRow(user);
        container.appendChild(row);
    });
}

function createUserTableRow(user) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <div style="display: flex; align-items: center; gap: 0.8rem;">
                <div class="user-avatar-small" style="width: 36px; height: 36px; background: #3498db; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.8rem;">
                    ${getUserInitials(user.full_name)}
                </div>
                <div>
                    <div style="font-weight: 600; color: #2c3e50;">${user.full_name}</div>
                    <div style="font-size: 0.8rem; color: #7f8c8d;">ID: ${user.id}</div>
                </div>
            </div>
        </td>
        <td>${user.email}</td>
        <td>
            <span class="role-badge ${user.role}">
                ${user.role === 'teacher' ? 'Docente' : 
                  user.role === 'student' ? 'Estudiante' : 
                  user.role === 'admin' ? 'Administrador' : user.role}
            </span>
        </td>
        <td>
            <span class="status-badge ${user.active !== false ? 'active' : 'inactive'}">
                ${user.active !== false ? 'Activo' : 'Inactivo'}
            </span>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-outline" onclick="editUser(${user.id})">
                    <span>✏️</span> Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deactivateUser(${user.id})">
                    <span>🚫</span> Baja
                </button>
            </div>
        </td>
    `;

    return row;
}

function loadGroupsTable() {
    const groups = JSON.parse(localStorage.getItem('colabu_groups') || '[]');
    const users = JSON.parse(localStorage.getItem('colabu_users') || '[]');
    const container = document.getElementById('groupsTableBody');
    
    if (!container) return;

    container.innerHTML = '';

    if (groups.length === 0) {
        container.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    <p>No hay grupos activos</p>
                    <p>Usa el botón "Crear Grupo" para crear el primero</p>
                </td>
            </tr>
        `;
        return;
    }

    groups.forEach(group => {
        const row = createGroupTableRow(group, users);
        container.appendChild(row);
    });
}

function createGroupTableRow(group, users) {
    const leader = group.members.find(m => m.role.includes('Líder'));
    const leaderUser = users.find(u => u.id === leader?.user_id);
    
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>
            <div style="font-weight: 600; color: #2c3e50;">${group.name}</div>
            <div style="font-size: 0.8rem; color: #7f8c8d;">ID: ${group.id}</div>
        </td>
        <td>${group.project_name}</td>
        <td>
            ${leaderUser ? `
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <div style="width: 32px; height: 32px; background: #3498db; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 0.7rem;">
                        ${getUserInitials(leaderUser.full_name)}
                    </div>
                    <span>${leaderUser.full_name}</span>
                </div>
            ` : 'No asignado'}
        </td>
        <td>
            <span style="font-weight: 600; color: #3498db;">${group.members.length} miembros</span>
        </td>
        <td>
            <div class="progress-display">
                <div class="progress-bar-small">
                    <div class="progress-fill" style="width: ${group.progress || 0}%"></div>
                </div>
                <span style="font-weight: 600; min-width: 40px;">${group.progress || 0}%</span>
            </div>
        </td>
        <td>
            <div class="action-buttons">
                <button class="btn btn-sm btn-outline" onclick="viewGroup(${group.id})">
                    <span>👁️</span> Ver
                </button>
                <button class="btn btn-sm btn-warning" onclick="editGroup(${group.id})">
                    <span>✏️</span> Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteGroup(${group.id})">
                    <span>🗑️</span> Eliminar
                </button>
            </div>
        </td>
    `;

    return row;
}

function loadSystemReports() {
    loadRecentActivity();
    loadUsageStats();
}

function loadRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;

    const activities = [
        {
            icon: '👤',
            text: 'Nuevo usuario registrado: Carlos López',
            time: 'Hace 2 horas'
        },
        {
            icon: '🎓',
            text: 'Docente Ana García creó nuevo grupo',
            time: 'Hace 4 horas'
        },
        {
            icon: '📊',
            text: 'Reporte del sistema generado',
            time: 'Hace 1 día'
        },
        {
            icon: '🔧',
            text: 'Configuración del sistema actualizada',
            time: 'Hace 2 días'
        }
    ];

    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">${activity.icon}</div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        </div>
    `).join('');
}

function loadUsageStats() {
    const container = document.getElementById('usageStats');
    if (!container) return;

    const users = JSON.parse(localStorage.getItem('colabu_users') || '[]');
    const groups = JSON.parse(localStorage.getItem('colabu_groups') || '[]');
    
    const stats = [
        { label: 'Usuarios activos', value: users.filter(u => u.active !== false).length },
        { label: 'Grupos activos', value: groups.length },
        { label: 'Tareas completadas', value: '24' },
        { label: 'Actividad hoy', value: '156' }
    ];

    container.innerHTML = stats.map(stat => `
        <div class="usage-item">
            <span class="usage-label">${stat.label}</span>
            <span class="usage-value">${stat.value}</span>
        </div>
    `).join('');
}

function showAddUserModal() {
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>➕ Agregar Nuevo Usuario</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addUserForm">
                        <div class="form-group">
                            <label for="newUserName">Nombre Completo *</label>
                            <input type="text" id="newUserName" required placeholder="Ej: Juan Pérez García">
                        </div>
                        <div class="form-group">
                            <label for="newUserEmail">Email Institucional *</label>
                            <input type="email" id="newUserEmail" required placeholder="usuario@universidad.edu">
                        </div>
                        <div class="form-group">
                            <label for="newUserRole">Rol *</label>
                            <select id="newUserRole" required>
                                <option value="">Seleccionar rol...</option>
                                <option value="student">Estudiante</option>
                                <option value="teacher">Docente</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="newUserPassword">Contraseña Temporal *</label>
                            <input type="password" id="newUserPassword" required placeholder="Mínimo 6 caracteres">
                            <small style="color: #7f8c8d; font-size: 0.8rem;">El usuario podrá cambiar su contraseña después</small>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="addNewUser()">Crear Usuario</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalEvents();
}

function showCreateGroupModal() {
    const users = JSON.parse(localStorage.getItem('colabu_users') || '[]');
    const teachers = users.filter(u => u.role === 'teacher');

    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>➕ Crear Nuevo Grupo</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="createGroupForm">
                        <div class="form-group">
                            <label for="groupName">Nombre del Grupo *</label>
                            <input type="text" id="groupName" required placeholder="Ej: Equipo Desarrollo Web">
                        </div>
                        <div class="form-group">
                            <label for="projectName">Nombre del Proyecto *</label>
                            <input type="text" id="projectName" required placeholder="Ej: Sistema de Gestión Académica">
                        </div>
                        <div class="form-group">
                            <label for="groupDescription">Descripción del Proyecto</label>
                            <textarea id="groupDescription" rows="3" placeholder="Describe los objetivos y alcance del proyecto..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="groupLeader">Líder del Grupo *</label>
                            <select id="groupLeader" required>
                                <option value="">Seleccionar docente...</option>
                                ${teachers.map(teacher => `
                                    <option value="${teacher.id}">${teacher.full_name} - ${teacher.email}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="groupDeadline">Fecha de Entrega Objetivo</label>
                            <input type="date" id="groupDeadline">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
                    <button class="btn btn-primary" onclick="createNewGroup()">Crear Grupo</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalEvents();
}

function addNewUser() {
    const name = document.getElementById('newUserName')?.value.trim();
    const email = document.getElementById('newUserEmail')?.value.trim();
    const role = document.getElementById('newUserRole')?.value;
    const password = document.getElementById('newUserPassword')?.value;

    if (!name || !email || !role || !password) {
        showAlert('Por favor completa todos los campos obligatorios', 'error');
        return;
    }

    if (password.length < 6) {
        showAlert('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('colabu_users') || '[]');
    
    // Verificar si el email ya existe
    if (users.some(u => u.email === email)) {
        showAlert('Este email ya está registrado en el sistema', 'error');
        return;
    }

    const newUser = {
        id: Date.now(),
        full_name: name,
        email: email,
        password: password,
        role: role,
        institution: 'universidad',
        active: true,
        created_by: 'admin',
        created_at: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('colabu_users', JSON.stringify(users));
    
    showAlert(`Usuario "${name}" creado exitosamente`, 'success');
    closeModal();
    loadUsersTable();
    updateAdminStats();
}

function createNewGroup() {
    const name = document.getElementById('groupName')?.value.trim();
    const projectName = document.getElementById('projectName')?.value.trim();
    const description = document.getElementById('groupDescription')?.value.trim();
    const leaderId = parseInt(document.getElementById('groupLeader')?.value);
    const deadline = document.getElementById('groupDeadline')?.value;

    if (!name || !projectName || !leaderId) {
        showAlert('Por favor completa los campos obligatorios', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('colabu_users') || '[]');
    const leaderUser = users.find(u => u.id === leaderId);
    
    if (!leaderUser) {
        showAlert('El docente seleccionado no existe', 'error');
        return;
    }

    const groups = JSON.parse(localStorage.getItem('colabu_groups') || '[]');
    
    const newGroup = {
        id: Date.now(),
        name: name,
        project_name: projectName,
        description: description || 'Sin descripción',
        deadline: deadline,
        created_by: leaderId,
        created_at: new Date().toISOString(),
        progress: 0,
        members: [
            {
                user_id: leaderId,
                name: leaderUser.full_name,
                role: 'Líder de proyecto',
                avatar: getUserInitials(leaderUser.full_name)
            }
        ]
    };

    groups.push(newGroup);
    localStorage.setItem('colabu_groups', JSON.stringify(groups));
    
    showAlert(`Grupo "${name}" creado exitosamente`, 'success');
    closeModal();
    loadGroupsTable();
    updateAdminStats();
}

function deactivateUser(userId) {
    if (!confirm('¿Estás seguro de que quieres dar de baja a este usuario? El usuario no podrá acceder al sistema.')) {
        return;
    }

    const users = JSON.parse(localStorage.getItem('colabu_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].active = false;
        users[userIndex].deactivated_at = new Date().toISOString();
        users[userIndex].deactivated_by = 'admin';
        localStorage.setItem('colabu_users', JSON.stringify(users));
        
        showAlert('Usuario dado de baja exitosamente', 'success');
        loadUsersTable();
        updateAdminStats();
    }
}

function deleteGroup(groupId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer y se perderán todos los datos del grupo.')) {
        return;
    }

    const groups = JSON.parse(localStorage.getItem('colabu_groups') || '[]');
    const filteredGroups = groups.filter(g => g.id !== groupId);
    
    localStorage.setItem('colabu_groups', JSON.stringify(filteredGroups));
    
    showAlert('Grupo eliminado exitosamente', 'success');
    loadGroupsTable();
    updateAdminStats();
}

function editUser(userId) {
    showAlert('Funcionalidad de edición en desarrollo', 'info');
}

function viewGroup(groupId) {
    showAlert('Funcionalidad de vista de grupo en desarrollo', 'info');
}

function editGroup(groupId) {
    showAlert('Funcionalidad de edición de grupo en desarrollo', 'info');
}

// Funciones auxiliares
function getUserInitials(name) {
    if (!name) return 'US';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function setupModalEvents() {
    const closeBtn = document.querySelector('.close-modal');
    const overlay = document.querySelector('.modal-overlay');
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

function showAlert(message, type) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#fff3cd'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#856404'};
        padding: 15px 20px;
        border-radius: 8px;
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#ffeaa7'};
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

// Hacer funciones globales
window.showAddUserModal = showAddUserModal;
window.showCreateGroupModal = showCreateGroupModal;
window.deactivateUser = deactivateUser;
window.deleteGroup = deleteGroup;
window.closeModal = closeModal;

console.log('Admin panel loaded successfully');
