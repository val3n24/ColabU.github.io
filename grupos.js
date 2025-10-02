// Gestión de Grupos - ColabU
document.addEventListener('DOMContentLoaded', function() {
    console.log('Grupos inicializando...');
    initializeGroups();
});

function initializeGroups() {
    // Verificar autenticación básica
    // Verificar autenticación al inicio de cada archivo JS principal
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que el usuario esté logueado
    if (!localStorage.getItem('currentUser')) {
        alert('Por favor inicia sesión primero');
        window.location.href = 'login.html';
        return;
    }
    
});
    // Inicializar datos demo
    initDemoData();
    
    // Cargar grupos
    loadUserGroups();
    
    console.log('Grupos listo!');
}

function initDemoData() {
    // Solo inicializar si no existen datos
    if (!localStorage.getItem('colabu_groups')) {
        const demoGroups = [
            {
                id: 1,
                name: 'Equipo Alpha',
                project_name: 'Sistema de Gestión Biblioteca',
                description: 'Desarrollo de sistema de gestión para biblioteca universitaria',
                deadline: '2024-12-14',
                created_by: 1,
                created_at: new Date().toISOString(),
                members: [
                    { user_id: 1, name: 'Ana García', role: 'Líder de proyecto', avatar: 'AG' },
                    { user_id: 2, name: 'Carlos López', role: 'Desarrollador Backend', avatar: 'CL' },
                    { user_id: 3, name: 'María Rodríguez', role: 'Diseñadora UX/UI', avatar: 'MR' }
                ],
                progress: 75
            },
            {
                id: 2,
                name: 'Equipo Beta',
                project_name: 'App de Movilidad Urbana',
                description: 'Aplicación móvil para optimización de rutas de transporte público',
                deadline: '2024-11-29',
                created_by: 4,
                created_at: new Date().toISOString(),
                members: [
                    { user_id: 4, name: 'Pedro Martín', role: 'Líder de proyecto', avatar: 'PM' },
                    { user_id: 5, name: 'Laura Sánchez', role: 'Desarrolladora Frontend', avatar: 'LS' },
                    { user_id: 1, name: 'Ana García', role: 'Arquitecta de Software', avatar: 'AG' }
                ],
                progress: 60
            },
            {
                id: 3,
                name: 'Planificación',
                project_name: 'Prototipo de API',
                description: 'Desarrollo del prototipo inicial del sistema de planificación',
                deadline: '2025-09-22',
                created_by: 1,
                created_at: new Date().toISOString(),
                members: [
                    { user_id: 1, name: 'Ana García', role: 'Coordinadora', avatar: 'AG' },
                    { user_id: 2, name: 'Carlos López', role: 'Desarrollador Fullstack', avatar: 'CL' },
                    { user_id: 4, name: 'Pedro Martín', role: 'Consultor Técnico', avatar: 'PM' }
                ],
                progress: 30
            }
        ];
        localStorage.setItem('colabu_groups', JSON.stringify(demoGroups));
    }

    if (!localStorage.getItem('colabu_users')) {
        const demoUsers = [
            { id: 1, full_name: 'Ana García', email: 'ana@universidad.edu', role: 'teacher' },
            { id: 2, full_name: 'Carlos López', email: 'carlos@universidad.edu', role: 'student' },
            { id: 3, full_name: 'María Rodríguez', email: 'maria@universidad.edu', role: 'student' },
            { id: 4, full_name: 'Pedro Martín', email: 'pedro@universidad.edu', role: 'teacher' },
            { id: 5, full_name: 'Laura Sánchez', email: 'laura@universidad.edu', role: 'student' },
            { id: 6, full_name: 'David Chen', email: 'david@universidad.edu', role: 'student' },
            { id: 7, full_name: 'Elena Morales', email: 'elena@universidad.edu', role: 'student' }
        ];
        localStorage.setItem('colabu_users', JSON.stringify(demoUsers));
    }
}

function getGroups() {
    return JSON.parse(localStorage.getItem('colabu_groups') || '[]');
}

function getUsers() {
    return JSON.parse(localStorage.getItem('colabu_users') || '[]');
}

function loadUserGroups() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const allGroups = getGroups();
    const userGroups = allGroups.filter(group => 
        group.members.some(member => member.user_id === currentUser.id)
    );

    console.log('Grupos del usuario:', userGroups);
    displayGroups(userGroups);
}

function displayGroups(groups) {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) {
        console.error('No se encontró el contenedor de grupos');
        return;
    }

    contentGrid.innerHTML = '';

    if (groups.length === 0) {
        contentGrid.innerHTML = `
            <div class="no-groups">
                <h3>No tienes grupos aún</h3>
                <p>Crea tu primer grupo para empezar a colaborar</p>
                <button class="btn btn-primary" onclick="showCreateGroupModal()">Crear Primer Grupo</button>
            </div>
        `;
        return;
    }

    groups.forEach(group => {
        const groupElement = createGroupElement(group);
        contentGrid.appendChild(groupElement);
    });

    // Agregar card para crear nuevo grupo
    const createGroupCard = createCreateGroupCard();
    contentGrid.appendChild(createGroupCard);
}

function createGroupElement(group) {
    const groupCard = document.createElement('div');
    groupCard.className = 'group-card';
    groupCard.innerHTML = `
        <div class="group-header">
            <h3>${group.name}</h3>
            <span class="project-tag">${group.project_name}</span>
        </div>
        <p class="group-description">${group.description}</p>
        
        <div class="group-details">
            <div class="detail-item">
                <span class="detail-label">Entrega:</span>
                <span class="detail-value">${formatDate(group.deadline)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Miembros:</span>
                <span class="detail-value">${group.members.length} personas</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Progreso:</span>
                <span class="detail-value">${group.progress}%</span>
            </div>
        </div>

        <div class="progress-section">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${group.progress}%"></div>
            </div>
            <span class="progress-text">${group.progress}%</span>
        </div>

        <div class="members-preview">
            <div class="members-title">Miembros del equipo:</div>
            <div class="avatars-container">
                ${group.members.map(member => `
                    <div class="member-avatar-small" title="${member.name} - ${member.role}">
                        ${member.avatar}
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="group-actions">
            <button class="btn btn-outline ver-detalles" data-group-id="${group.id}">
                Ver Detalles
            </button>
            <button class="btn btn-primary ir-chat" data-group-id="${group.id}">
                Ir al Chat
            </button>
        </div>
    `;

    // Agregar event listeners a los botones
    groupCard.querySelector('.ver-detalles').addEventListener('click', function() {
        showGroupDetails(group.id);
    });

    groupCard.querySelector('.ir-chat').addEventListener('click', function() {
        openGroupChat(group.id);
    });

    return groupCard;
}

function createCreateGroupCard() {
    const createCard = document.createElement('div');
    createCard.className = 'group-card create-group';
    createCard.innerHTML = `
        <div class="create-group-content">
            <div class="create-icon">+</div>
            <h3>Crear Nuevo Grupo</h3>
            <p>Inicia un nuevo proyecto colaborativo</p>
        </div>
    `;

    createCard.addEventListener('click', showCreateGroupModal);
    return createCard;
}

function showGroupDetails(groupId) {
    const groups = getGroups();
    const group = groups.find(g => g.id == groupId);
    
    if (!group) return;

    const modalHTML = `
        <div class="group-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${group.name}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="group-detail-section">
                        <h4>Informacion del Proyecto</h4>
                        <div class="detail-grid">
                            <div class="detail-item">
                                <strong>Proyecto:</strong> ${group.project_name}
                            </div>
                            <div class="detail-item">
                                <strong>Descripcion:</strong> ${group.description}
                            </div>
                            <div class="detail-item">
                                <strong>Fecha de Entrega:</strong> ${formatDate(group.deadline)}
                            </div>
                            <div class="detail-item">
                                <strong>Progreso General:</strong> 
                                <div class="progress-bar-small">
                                    <div class="progress-fill" style="width: ${group.progress}%"></div>
                                </div>
                                <span class="progress-text">${group.progress}%</span>
                            </div>
                            <div class="detail-item">
                                <strong>Creado por:</strong> ${getUserName(group.created_by)}
                            </div>
                            <div class="detail-item">
                                <strong>Fecha creacion:</strong> ${formatDateTime(group.created_at)}
                            </div>
                        </div>
                    </div>

                    <div class="group-detail-section">
                        <h4>Miembros del Equipo (${group.members.length})</h4>
                        <div class="members-detailed-list">
                            ${group.members.map(member => `
                                <div class="detailed-member">
                                    <div class="member-avatar-large">${member.avatar}</div>
                                    <div class="member-details">
                                        <span class="member-name">${member.name}</span>
                                        <span class="member-role">${member.role}</span>
                                        <span class="member-email">${getUserEmail(member.user_id)}</span>
                                        <span class="member-type">${getUserType(member.user_id)}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="group-detail-section">
                        <h4>Acciones Rapidas</h4>
                        <div class="action-buttons">
                            <button class="btn btn-primary" onclick="openGroupChat(${group.id})">
                                Ir al Chat del Grupo
                            </button>
                            <button class="btn btn-secondary" onclick="viewGroupTasks(${group.id})">
                                Ver Tareas
                            </button>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeGroupModal()">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalEvents();
}

function showCreateGroupModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const availableUsers = getUsers().filter(user => user.id !== currentUser.id);

    const modalHTML = `
        <div class="group-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Crear Nuevo Grupo</h3>
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
                            <input type="text" id="projectName" required placeholder="Ej: Sistema de Gestion Academica">
                        </div>

                        <div class="form-group">
                            <label for="groupDescription">Descripcion del Proyecto</label>
                            <textarea id="groupDescription" rows="3" placeholder="Describe los objetivos, alcance y caracteristicas principales del proyecto..."></textarea>
                        </div>

                        <div class="form-group">
                            <label for="groupDeadline">Fecha de Entrega Objetivo</label>
                            <input type="date" id="groupDeadline">
                        </div>

                        <div class="form-group">
                            <label>Agregar Miembros al Equipo</label>
                            <div class="members-selection-container">
                                <div class="selection-info">
                                    <small>Selecciona los miembros y asigna sus roles en el proyecto</small>
                                </div>
                                <div class="members-selection">
                                    ${availableUsers.map(user => `
                                        <div class="user-selection-item">
                                            <div class="user-selection-header">
                                                <label class="user-checkbox">
                                                    <input type="checkbox" name="members" value="${user.id}">
                                                    <span class="checkmark"></span>
                                                    <div class="user-info">
                                                        <span class="user-name">${user.full_name}</span>
                                                        <span class="user-type">${user.role === 'teacher' ? 'Docente' : 'Estudiante'}</span>
                                                        <span class="user-email">${user.email}</span>
                                                    </div>
                                                </label>
                                            </div>
                                            <div class="role-selection">
                                                <label>Rol en el proyecto:</label>
                                                <select class="member-role-select" data-user-id="${user.id}">
                                                    <option value="">Seleccionar rol...</option>
                                                    <option value="Lider de proyecto">Lider de proyecto</option>
                                                    <option value="Desarrollador Frontend">Desarrollador Frontend</option>
                                                    <option value="Desarrollador Backend">Desarrollador Backend</option>
                                                    <option value="Desarrollador Fullstack">Desarrollador Fullstack</option>
                                                    <option value="Disenador UX/UI">Disenador UX/UI</option>
                                                    <option value="Arquitecto de Software">Arquitecto de Software</option>
                                                    <option value="Administrador de BD">Administrador de BD</option>
                                                    <option value="Tester QA">Tester QA</option>
                                                    <option value="Documentador">Documentador</option>
                                                    <option value="Investigador">Investigador</option>
                                                    <option value="Coordinador">Coordinador</option>
                                                    <option value="Consultor Tecnico">Consultor Tecnico</option>
                                                    <option value="Colaborador General">Colaborador General</option>
                                                </select>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeGroupModal()">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="createNewGroup()">Crear Grupo</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalEvents();
    setupMemberSelectionEvents();
}

function setupMemberSelectionEvents() {
    const checkboxes = document.querySelectorAll('input[name="members"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const userId = this.value;
            const roleSelect = document.querySelector(`.member-role-select[data-user-id="${userId}"]`);
            const userSelectionItem = this.closest('.user-selection-item');
            
            if (roleSelect && userSelectionItem) {
                if (this.checked) {
                    userSelectionItem.classList.add('selected');
                    roleSelect.disabled = false;
                } else {
                    userSelectionItem.classList.remove('selected');
                    roleSelect.disabled = true;
                    roleSelect.value = '';
                }
            }
        });
    });
}

function setupModalEvents() {
    const closeBtn = document.querySelector('.close-modal');
    const modal = document.querySelector('.group-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeGroupModal);
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeGroupModal();
            }
        });
    }
}

function closeGroupModal() {
    const modal = document.querySelector('.group-modal');
    if (modal) {
        modal.remove();
    }
}

function createNewGroup() {
    const groupName = document.getElementById('groupName').value.trim();
    const projectName = document.getElementById('projectName').value.trim();
    const description = document.getElementById('groupDescription').value.trim();
    const deadline = document.getElementById('groupDeadline').value;

    if (!groupName || !projectName) {
        showAlert('Por favor completa los campos obligatorios', 'error');
        return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Validar miembros seleccionados
    const checkboxes = document.querySelectorAll('input[name="members"]:checked');
    const selectedMembers = [];
    let hasErrors = false;

    checkboxes.forEach(checkbox => {
        const userId = parseInt(checkbox.value);
        const roleSelect = document.querySelector(`.member-role-select[data-user-id="${userId}"]`);
        const role = roleSelect ? roleSelect.value : '';
        
        if (!role) {
            hasErrors = true;
            roleSelect.style.borderColor = '#e74c3c';
            showAlert('Por favor asigna un rol a todos los miembros seleccionados', 'error');
            return;
        }

        selectedMembers.push({
            userId: userId,
            role: role
        });
    });

    if (hasErrors) return;

    // Crear nuevo grupo
    const groups = getGroups();
    const newGroup = {
        id: Date.now(),
        name: groupName,
        project_name: projectName,
        description: description || 'Sin descripcion',
        deadline: deadline,
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
        progress: 0,
        members: [
            {
                user_id: currentUser.id,
                name: currentUser.full_name,
                role: 'Lider de proyecto',
                avatar: getInitials(currentUser.full_name)
            }
        ]
    };

    // Agregar miembros seleccionados con sus roles específicos
    const users = getUsers();
    selectedMembers.forEach(({ userId, role }) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            newGroup.members.push({
                user_id: user.id,
                name: user.full_name,
                role: role,
                avatar: getInitials(user.full_name)
            });
        }
    });

    groups.push(newGroup);
    localStorage.setItem('colabu_groups', JSON.stringify(groups));

    showAlert('Grupo "' + groupName + '" creado exitosamente', 'success');
    closeGroupModal();
    loadUserGroups();
}

// Funciones auxiliares
function formatDate(dateString) {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getUserEmail(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    return user ? user.email : 'Email no disponible';
}

function getUserName(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    return user ? user.full_name : 'Usuario desconocido';
}

function getUserType(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    return user ? (user.role === 'teacher' ? 'Docente' : 'Estudiante') : 'Tipo desconocido';
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-' + type;
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
        alert.style.background = '#27ae60';
    } else if (type === 'error') {
        alert.style.background = '#e74c3c';
    } else if (type === 'info') {
        alert.style.background = '#3498db';
    }
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 4000);
}

// Funciones globales
window.openGroupChat = function(groupId) {
    // Redirigir al chat con el grupo seleccionado
    window.location.href = 'chat.html?group=' + groupId;
};

window.viewGroupTasks = function(groupId) {
    // Redirigir a tareas filtradas por grupo
    window.location.href = 'tareas.html?group=' + groupId;
};

window.editGroup = function(groupId) {
    showAlert('Editar grupo - Funcionalidad completa en desarrollo', 'info');
};

// Agregar CSS dinámico
const groupsStyles = `
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

    .content-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 2rem;
        margin-top: 2rem;
    }

    .group-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
        border-left: 4px solid #3498db;
        display: flex;
        flex-direction: column;
    }
    
    .group-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 15px rgba(0,0,0,0.15);
    }
    
    .create-group {
        background: linear-gradient(135deg, #2c3e50, #3498db);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border: 2px dashed rgba(255,255,255,0.3);
        min-height: 200px;
        border-left: 4px solid transparent;
    }
    
    .create-group-content {
        text-align: center;
    }
    
    .create-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
        font-weight: 300;
    }
    
    .group-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .group-header h3 {
        color: #2c3e50;
        font-size: 1.3rem;
        margin-right: 1rem;
    }
    
    .project-tag {
        background: #ecf0f1;
        color: #2c3e50;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
        white-space: nowrap;
    }
    
    .group-description {
        color: #333;
        margin-bottom: 1.5rem;
        line-height: 1.5;
        flex: 1;
    }
    
    .group-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .detail-item {
        display: flex;
        flex-direction: column;
    }
    
    .detail-label {
        font-size: 0.9rem;
        color: #7f8c8d;
        margin-bottom: 0.3rem;
    }
    
    .detail-value {
        font-weight: 600;
        color: #2c3e50;
    }
    
    .progress-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .progress-bar {
        flex: 1;
        height: 8px;
        background: #ecf0f1;
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3498db, #2ecc71);
        border-radius: 4px;
        transition: width 0.3s ease;
    }
    
    .progress-text {
        font-weight: 600;
        color: #2c3e50;
        min-width: 40px;
        text-align: right;
    }

    .members-preview {
        margin-bottom: 1.5rem;
    }

    .members-title {
        font-size: 0.9rem;
        color: #7f8c8d;
        margin-bottom: 0.5rem;
    }

    .avatars-container {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }

    .member-avatar-small {
        width: 35px;
        height: 35px;
        background: #3498db;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.8rem;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .group-actions {
        display: flex;
        gap: 0.8rem;
        margin-top: auto;
    }

    .group-actions .btn {
        flex: 1;
        padding: 10px 16px;
        font-size: 0.9rem;
    }
    
    /* Modal Styles */
    .group-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .group-modal .modal-content {
        background: white;
        border-radius: 12px;
        padding: 0;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    
    .modal-header {
        padding: 1.5rem;
        border-bottom: 1px solid #ecf0f1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
        border-radius: 12px 12px 0 0;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #2c3e50;
    }
    
    .close-modal {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #7f8c8d;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .close-modal:hover {
        color: #e74c3c;
        background: #f8f9fa;
        border-radius: 50%;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .group-detail-section {
        margin-bottom: 2rem;
    }
    
    .group-detail-section h4 {
        color: #2c3e50;
        margin-bottom: 1rem;
        font-size: 1.1rem;
        border-bottom: 2px solid #3498db;
        padding-bottom: 0.5rem;
    }
    
    .detail-grid {
        display: grid;
        gap: 1rem;
    }
    
    .detail-grid .detail-item {
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 6px;
        border-left: 4px solid #3498db;
    }
    
    .progress-bar-small {
        width: 100px;
        height: 6px;
        background: #ecf0f1;
        border-radius: 3px;
        overflow: hidden;
        display: inline-block;
        margin: 0 8px;
        vertical-align: middle;
    }
    
    .members-detailed-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .detailed-member {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #3498db;
    }
    
    .member-avatar-large {
        width: 50px;
        height: 50px;
        background: #3498db;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 1.1rem;
        flex-shrink: 0;
    }
    
    .member-details {
        flex: 1;
    }
    
    .member-name {
        font-weight: 600;
        color: #2c3e50;
        display: block;
    }
    
    .member-role {
        color: #3498db;
        font-weight: 500;
        display: block;
        margin: 0.2rem 0;
    }
    
    .member-email {
        color: #7f8c8d;
        font-size: 0.9rem;
        display: block;
    }
    
    .member-type {
        color: #95a5a6;
        font-size: 0.8rem;
        display: block;
        margin-top: 0.2rem;
    }
    
    .action-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .modal-footer {
        padding: 1.5rem;
        border-top: 1px solid #ecf0f1;
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
    }
    
    /* Form Styles */
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: #2c3e50;
        font-weight: 600;
    }
    
    .form-group input,
    .form-group textarea,
    .form-group select {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
    }
    
    .members-selection-container {
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        padding: 1rem;
    }
    
    .selection-info {
        margin-bottom: 1rem;
    }
    
    .selection-info small {
        color: #7f8c8d;
    }
    
    .members-selection {
        max-height: 300px;
        overflow-y: auto;
    }
    
    .user-selection-item {
        padding: 1rem;
        border: 1px solid #ecf0f1;
        border-radius: 8px;
        margin-bottom: 0.8rem;
        transition: all 0.3s ease;
    }
    
    .user-selection-item.selected {
        border-color: #3498db;
        background: #f8f9fa;
    }
    
    .user-selection-item:hover {
        border-color: #bdc3c7;
    }
    
    .user-checkbox {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin: 0;
        font-weight: normal;
    }
    
    .user-checkbox input[type="checkbox"] {
        display: none;
    }
    
    .checkmark {
        width: 20px;
        height: 20px;
        border: 2px solid #bdc3c7;
        border-radius: 4px;
        margin-right: 0.8rem;
        position: relative;
        transition: all 0.3s ease;
        flex-shrink: 0;
    }
    
    .user-checkbox input[type="checkbox"]:checked + .checkmark {
        background: #3498db;
        border-color: #3498db;
    }
    
    .user-checkbox input[type="checkbox"]:checked + .checkmark::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
    }
    
    .user-info {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    
    .user-name {
        font-weight: 600;
        color: #2c3e50;
    }
    
    .user-type {
        font-size: 0.9rem;
        color: #7f8c8d;
    }
    
    .user-email {
        font-size: 0.8rem;
        color: #95a5a6;
    }
    
    .role-selection {
        margin-top: 0.8rem;
        padding-left: 28px;
    }
    
    .role-selection label {
        display: block;
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
        color: #7f8c8d;
    }
    
    .member-role-select {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }

    .member-role-select:disabled {
        background: #f8f9fa;
        color: #bdc3c7;
        cursor: not-allowed;
    }
    
    .no-groups {
        text-align: center;
        padding: 3rem;
        grid-column: 1 / -1;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    .no-groups h3 {
        color: #2c3e50;
        margin-bottom: 1rem;
    }
    
    .no-groups p {
        color: #7f8c8d;
        margin-bottom: 2rem;
    }
    
    .btn {
        display: inline-block;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        text-decoration: none;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .btn-primary {
        background: #3498db;
        color: white;
    }
    
    .btn-primary:hover {
        background: #2980b9;
    }
    
    .btn-secondary {
        background: #95a5a6;
        color: white;
    }
    
    .btn-secondary:hover {
        background: #7f8c8d;
    }
    
    .btn-outline {
        background: transparent;
        color: #3498db;
        border: 2px solid #3498db;
    }
    
    .btn-outline:hover {
        background: #3498db;
        color: white;
    }
    
    .btn-full {
        width: 100%;
    }
`;

// Injectar estilos
if (!document.querySelector('#groups-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'groups-styles';
    styleElement.textContent = groupsStyles;
    document.head.appendChild(styleElement);
}

console.log('Grupos.js cargado correctamente');

    // Tu código existente aquí...
    initializeGroups();