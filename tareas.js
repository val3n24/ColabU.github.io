// Verificar autenticación al inicio de cada archivo JS principal
document.addEventListener('DOMContentLoaded', function() {
    // Verificar que el usuario esté logueado
    if (!localStorage.getItem('currentUser')) {
        alert('Por favor inicia sesión primero');
        window.location.href = 'login.html';
        return;
    }
    
    // Tu código existente aquí...
    initializeTasks();
});
function initializeTasks() {
    // Verificar autenticación
    if (!localStorage.getItem('currentUser')) {
        alert('Por favor inicia sesión primero');
        window.location.href = 'login.html';
        return;
    }

    // Inicializar datos demo si no existen
    initDemoTasks();
    
    // Cargar tareas
    loadUserTasks();
    
    // Configurar event listeners
    setupTaskListeners();
}

function initDemoTasks() {
    if (!localStorage.getItem('colabu_tasks')) {
        const demoTasks = [
            {
                id: 1,
                title: 'Diseño de base de datos',
                description: 'Crear el esquema de base de datos para el sistema de biblioteca',
                assigned_to: 1,
                project_id: 1,
                deadline: '2024-10-14',
                status: 'in-progress',
                progress: 75,
                completed: false,
                created_at: new Date().toISOString(),
                submissions: [
                    {
                        user_id: 1,
                        user_name: 'Ana García',
                        files: ['esquema_bd.pdf'],
                        submitted_at: '2024-10-10T10:00:00Z',
                        comment: 'Esquema inicial completado'
                    }
                ],
                assigned_members: [1, 2, 3]
            },
            {
                id: 2,
                title: 'Prototipo de interfaz',
                description: 'Desarrollar wireframes y mockups de la interfaz principal',
                assigned_to: 3,
                project_id: 1,
                deadline: '2024-10-19',
                status: 'pending',
                progress: 30,
                completed: false,
                created_at: new Date().toISOString(),
                submissions: [],
                assigned_members: [1, 3]
            },
            {
                id: 3,
                title: 'Investigación de APIs',
                description: 'Investigar APIs disponibles para integración con transporte público',
                assigned_to: 4,
                project_id: 2,
                deadline: '2024-10-09',
                status: 'completed',
                progress: 100,
                completed: true,
                created_at: new Date().toISOString(),
                submissions: [
                    {
                        user_id: 4,
                        user_name: 'Pedro Martín',
                        files: ['investigacion_apis.docx', 'comparativa_apis.pdf'],
                        submitted_at: '2024-10-08T15:30:00Z',
                        comment: 'Investigación completada con 5 APIs analizadas'
                    },
                    {
                        user_id: 5,
                        user_name: 'Laura Sánchez',
                        files: ['analisis_tecnico.pdf'],
                        submitted_at: '2024-10-08T16:45:00Z',
                        comment: 'Análisis técnico de las APIs seleccionadas'
                    }
                ],
                assigned_members: [4, 5]
            }
        ];
        localStorage.setItem('colabu_tasks', JSON.stringify(demoTasks));
    }
}

function getTasks() {
    return JSON.parse(localStorage.getItem('colabu_tasks') || '[]');
}

function getUsers() {
    return JSON.parse(localStorage.getItem('colabu_users') || '[]');
}

function getGroups() {
    return JSON.parse(localStorage.getItem('colabu_groups') || '[]');
}

function loadUserTasks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const allTasks = getTasks();
    const userGroups = getGroups().filter(group => 
        group.members.some(member => member.user_id === currentUser.id)
    );

    // Mostrar tareas de los grupos del usuario
    const userTasks = allTasks.filter(task => 
        userGroups.some(group => group.id === task.project_id)
    );

    displayTasks(userTasks);
}

function displayTasks(tasks) {
    const tasksContainer = document.querySelector('.tasks-container');
    if (!tasksContainer) return;

    tasksContainer.innerHTML = '';

    tasks.forEach(task => {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
    });

    // Agregar card para crear nueva tarea
    const createTaskCard = createCreateTaskCard();
    tasksContainer.appendChild(createTaskCard);
}

function createTaskElement(task) {
    const users = getUsers();
    const groups = getGroups();
    const assignedUser = users.find(user => user.id === task.assigned_to);
    const project = groups.find(group => group.id === task.project_id);

    const isOverdue = new Date(task.deadline) < new Date() && !task.completed;
    const statusText = task.completed ? 'Completada' : 
                      task.status === 'in-progress' ? 'En progreso' : 'Pendiente';

    // Calcular progreso basado en entregas
    const submissionProgress = calculateSubmissionProgress(task);
    
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${isOverdue ? 'overdue' : ''} ${task.completed ? 'completed' : ''}`;
    taskCard.innerHTML = `
        <div class="task-header">
            <label class="checkbox-container">
                <input type="checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
                <span class="checkmark"></span>
            </label>
            <h3 class="task-title">${task.title}</h3>
        </div>
        <p class="task-description">${task.description}</p>
        
        <div class="task-details">
            <div class="task-assignment">
                <span class="assigned-to">Asignada a: ${assignedUser ? assignedUser.full_name : 'Sin asignar'}</span>
                <span class="task-project">Proyecto: ${project ? project.name : 'Sin proyecto'}</span>
            </div>
            
            <div class="progress-section">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                </div>
                <span class="progress-text">${task.progress}%</span>
            </div>

            <div class="submission-status">
                <div class="submission-progress">
                    <span class="submission-label">Entregas: ${task.submissions.length}/${task.assigned_members ? task.assigned_members.length : 1}</span>
                    <div class="submission-bar">
                        <div class="submission-fill" style="width: ${submissionProgress}%"></div>
                    </div>
                    <span class="submission-percent">${submissionProgress}%</span>
                </div>
            </div>
            
            <div class="task-deadline ${isOverdue ? 'overdue' : ''}">
                <span class="deadline-date">${formatDate(task.deadline)} ${isOverdue ? '(Vencida)' : ''}</span>
                <span class="task-status ${task.completed ? 'completed' : ''}">Estado: ${statusText}</span>
            </div>

            <div class="task-actions">
                <button class="btn btn-small btn-outline update-progress" data-task-id="${task.id}">
                    Actualizar Progreso
                </button>
                <button class="btn btn-small btn-primary submit-work" data-task-id="${task.id}">
                    Entregar Trabajo
                </button>
                <button class="btn btn-small btn-secondary view-submissions" data-task-id="${task.id}">
                    Ver Entregas
                </button>
            </div>
        </div>
    `;

    return taskCard;
}

function calculateSubmissionProgress(task) {
    if (!task.assigned_members || task.assigned_members.length === 0) {
        return task.submissions.length > 0 ? 100 : 0;
    }
    
    const uniqueSubmitters = [...new Set(task.submissions.map(sub => sub.user_id))];
    return Math.round((uniqueSubmitters.length / task.assigned_members.length) * 100);
}

function createCreateTaskCard() {
    const createCard = document.createElement('div');
    createCard.className = 'task-card new-task';
    createCard.innerHTML = `
        <div class="new-task-content">
            <div class="add-icon">+</div>
            <h3>Crear Nueva Tarea</h3>
            <p>Agregar nueva tarea al proyecto</p>
        </div>
    `;

    createCard.addEventListener('click', showCreateTaskModal);
    return createCard;
}

function setupTaskListeners() {
    // Delegación de eventos para checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox' && e.target.hasAttribute('data-task-id')) {
            const taskId = parseInt(e.target.getAttribute('data-task-id'));
            const completed = e.target.checked;
            updateTaskCompletion(taskId, completed);
        }
    });

    // Delegación de eventos para botones
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('update-progress')) {
            const taskId = parseInt(e.target.getAttribute('data-task-id'));
            showProgressModal(taskId);
        }
        
        if (e.target.classList.contains('submit-work')) {
            const taskId = parseInt(e.target.getAttribute('data-task-id'));
            showSubmitWorkModal(taskId);
        }
        
        if (e.target.classList.contains('view-submissions')) {
            const taskId = parseInt(e.target.getAttribute('data-task-id'));
            showSubmissionsModal(taskId);
        }
    });
}

function updateTaskCompletion(taskId, completed) {
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = completed;
        tasks[taskIndex].status = completed ? 'completed' : 'pending';
        tasks[taskIndex].progress = completed ? 100 : tasks[taskIndex].progress;
        
        localStorage.setItem('colabu_tasks', JSON.stringify(tasks));
        
        // Actualizar progreso del grupo
        updateGroupProgress(tasks[taskIndex].project_id);
        
        // Recargar tareas
        loadUserTasks();
        
        showAlert('Tarea ' + (completed ? 'completada' : 'marcada como pendiente'), 'success');
    }
}

function showProgressModal(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;

    const modalHTML = `
        <div class="modal-overlay active">
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Actualizar Progreso</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="task-info-section">
                        <h3>${task.title}</h3>
                        <p class="task-description-modal">${task.description}</p>
                    </div>
                    
                    <div class="form-section">
                        <div class="form-group">
                            <label for="progressValue">Progreso Actual</label>
                            <div class="slider-container">
                                <input type="range" id="progressValue" min="0" max="100" value="${task.progress}" class="progress-slider">
                                <div class="slider-value" id="progressValueDisplay">${task.progress}%</div>
                            </div>
                            <div class="slider-labels">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="taskStatus">Estado de la Tarea</label>
                            <select id="taskStatus" class="form-select">
                                <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                                <option value="in-progress" ${task.status === 'in-progress' ? 'selected' : ''}>En Progreso</option>
                                <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completada</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="saveTaskProgress(${taskId})">Guardar Cambios</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar evento del slider
    const slider = document.getElementById('progressValue');
    const display = document.getElementById('progressValueDisplay');
    
    slider.addEventListener('input', function() {
        display.textContent = this.value + '%';
        display.style.left = `calc(${this.value}% + (${-20 - this.value * 0.3}px))`;
    });
    
    // Inicializar posición del slider
    display.style.left = `calc(${slider.value}% + (${-20 - slider.value * 0.3}px))`;
    
    setupModalEvents();
}

function saveTaskProgress(taskId) {
    const progressValue = parseInt(document.getElementById('progressValue').value);
    const statusValue = document.getElementById('taskStatus').value;
    
    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
        tasks[taskIndex].progress = progressValue;
        tasks[taskIndex].status = statusValue;
        tasks[taskIndex].completed = statusValue === 'completed';
        
        localStorage.setItem('colabu_tasks', JSON.stringify(tasks));
        
        // Actualizar progreso del grupo
        updateGroupProgress(tasks[taskIndex].project_id);
        
        closeModal();
        loadUserTasks();
        
        showAlert('Progreso actualizado correctamente', 'success');
    }
}

function showSubmitWorkModal(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!task || !currentUser) return;

    const modalHTML = `
        <div class="modal-overlay active">
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Entregar Trabajo</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="task-info-section">
                        <h3>${task.title}</h3>
                        <p class="task-description-modal">${task.description}</p>
                        <div class="deadline-info">
                            <strong>Fecha límite:</strong> ${formatDate(task.deadline)}
                        </div>
                    </div>
                    
                    <form id="submitWorkForm" class="submit-form">
                        <div class="form-group">
                            <label for="workComment">Comentario (opcional)</label>
                            <textarea id="workComment" rows="4" placeholder="Describe tu entrega, incluye detalles importantes o observaciones..." class="form-textarea"></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="workFiles" class="file-upload-label">
                                <span>Subir Archivos</span>
                                <input type="file" id="workFiles" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.mp4,.mov,.avi">
                            </label>
                            <small class="file-hint">Formatos permitidos: PDF, Word, imágenes (JPG, PNG), videos (MP4, MOV, AVI)</small>
                            <div id="filePreview" class="file-preview-container"></div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="submitWork(${taskId})">Entregar Trabajo</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar preview de archivos
    const fileInput = document.getElementById('workFiles');
    const filePreview = document.getElementById('filePreview');
    
    fileInput.addEventListener('change', function() {
        filePreview.innerHTML = '';
        if (this.files.length === 0) {
            filePreview.innerHTML = '<div class="no-files">No hay archivos seleccionados</div>';
            return;
        }
        
        Array.from(this.files).forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.className = 'file-preview-item';
            fileElement.innerHTML = `
                <div class="file-icon">${getFileIcon(file.name)}</div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="file-remove" onclick="this.parentElement.remove()">&times;</button>
            `;
            filePreview.appendChild(fileElement);
        });
    });
    
    // Inicializar estado de preview
    fileInput.dispatchEvent(new Event('change'));
    
    setupModalEvents();
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'doc': '📝',
        'docx': '📝',
        'jpg': '🖼️',
        'jpeg': '🖼️',
        'png': '🖼️',
        'mp4': '🎥',
        'mov': '🎥',
        'avi': '🎥'
    };
    return icons[ext] || '📎';
}

function submitWork(taskId) {
    const comment = document.getElementById('workComment').value;
    const fileInput = document.getElementById('workFiles');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser) return;

    const tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return;

    // Simular subida de archivos (en un sistema real aquí se subirían a un servidor)
    const uploadedFiles = Array.from(fileInput.files).map(file => file.name);

    const newSubmission = {
        user_id: currentUser.id,
        user_name: currentUser.full_name,
        files: uploadedFiles,
        submitted_at: new Date().toISOString(),
        comment: comment || 'Sin comentario'
    };

    if (!tasks[taskIndex].submissions) {
        tasks[taskIndex].submissions = [];
    }

    // Verificar si el usuario ya había entregado
    const existingSubmissionIndex = tasks[taskIndex].submissions.findIndex(
        sub => sub.user_id === currentUser.id
    );

    if (existingSubmissionIndex !== -1) {
        // Actualizar entrega existente
        tasks[taskIndex].submissions[existingSubmissionIndex] = newSubmission;
    } else {
        // Agregar nueva entrega
        tasks[taskIndex].submissions.push(newSubmission);
    }

    // Actualizar progreso de la tarea basado en entregas
    if (tasks[taskIndex].assigned_members && tasks[taskIndex].assigned_members.length > 0) {
        const uniqueSubmitters = [...new Set(tasks[taskIndex].submissions.map(sub => sub.user_id))];
        const submissionProgress = Math.round((uniqueSubmitters.length / tasks[taskIndex].assigned_members.length) * 100);
        tasks[taskIndex].progress = Math.max(tasks[taskIndex].progress, submissionProgress);
    }

    localStorage.setItem('colabu_tasks', JSON.stringify(tasks));
    
    // Actualizar progreso del grupo
    updateGroupProgress(tasks[taskIndex].project_id);
    
    closeModal();
    loadUserTasks();
    
    showAlert('Trabajo entregado correctamente', 'success');
}

function showSubmissionsModal(taskId) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === taskId);
    const users = getUsers();
    
    if (!task) return;

    const assignedMembers = task.assigned_members ? 
        task.assigned_members.map(memberId => users.find(u => u.id === memberId)).filter(Boolean) :
        [users.find(u => u.id === task.assigned_to)].filter(Boolean);

    const modalHTML = `
        <div class="modal-overlay active">
            <div class="modal-container large">
                <div class="modal-header">
                    <h2>Entregas - ${task.title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-number">${task.submissions ? task.submissions.length : 0}</div>
                            <div class="stat-label">Total Entregas</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${assignedMembers.length}</div>
                            <div class="stat-label">Miembros Asignados</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${calculateSubmissionProgress(task)}%</div>
                            <div class="stat-label">Progreso Entregas</div>
                        </div>
                    </div>

                    <div class="content-tabs">
                        <div class="tab-buttons">
                            <button class="tab-button active" data-tab="submissions">Entregas Realizadas</button>
                            <button class="tab-button" data-tab="pending">Miembros Pendientes</button>
                        </div>
                        
                        <div class="tab-content active" id="submissions-tab">
                            ${task.submissions && task.submissions.length > 0 ? 
                                task.submissions.map(submission => `
                                    <div class="submission-card">
                                        <div class="submission-header">
                                            <div class="user-info">
                                                <div class="user-avatar">${getInitials(submission.user_name)}</div>
                                                <div>
                                                    <div class="user-name">${submission.user_name}</div>
                                                    <div class="submission-time">${formatDateTime(submission.submitted_at)}</div>
                                                </div>
                                            </div>
                                        </div>
                                        ${submission.comment && submission.comment !== 'Sin comentario' ? 
                                            `<div class="submission-comment">${submission.comment}</div>` : ''}
                                        ${submission.files && submission.files.length > 0 ? `
                                            <div class="submission-files">
                                                <div class="files-title">Archivos adjuntos:</div>
                                                <div class="files-grid">
                                                    ${submission.files.map(file => `
                                                        <div class="file-item">
                                                            <div class="file-icon">${getFileIcon(file)}</div>
                                                            <div class="file-name">${file}</div>
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('') :
                                '<div class="empty-state">No hay entregas registradas para esta tarea</div>'
                            }
                        </div>
                        
                        <div class="tab-content" id="pending-tab">
                            <div class="pending-list">
                                ${assignedMembers.map(member => {
                                    const hasSubmitted = task.submissions && 
                                        task.submissions.some(sub => sub.user_id === member.id);
                                    
                                    return `
                                        <div class="pending-item ${hasSubmitted ? 'completed' : 'pending'}">
                                            <div class="member-info">
                                                <div class="user-avatar">${getInitials(member.full_name)}</div>
                                                <div class="member-details">
                                                    <div class="member-name">${member.full_name}</div>
                                                    <div class="member-email">${member.email}</div>
                                                </div>
                                            </div>
                                            <div class="status-badge ${hasSubmitted ? 'completed' : 'pending'}">
                                                ${hasSubmitted ? 'Entregado' : 'Pendiente'}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" onclick="closeModal()">Cerrar</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Configurar tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remover active de todos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Agregar active al seleccionado
            this.classList.add('active');
            document.getElementById(`${tabName}-tab`).classList.add('active');
        });
    });
    
    setupModalEvents();
}

function showCreateTaskModal() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const userGroups = getGroups().filter(group => 
        group.members.some(member => member.user_id === currentUser.id)
    );
    const users = getUsers();

    const modalHTML = `
        <div class="modal-overlay active">
            <div class="modal-container">
                <div class="modal-header">
                    <h2>Crear Nueva Tarea</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <form id="createTaskForm" class="task-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="taskTitle">Título de la Tarea *</label>
                                <input type="text" id="taskTitle" required placeholder="Ej: Diseño de interfaz" class="form-input">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="taskDescription">Descripción</label>
                            <textarea id="taskDescription" rows="3" placeholder="Describe la tarea, objetivos y requisitos..." class="form-textarea"></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="taskProject">Proyecto *</label>
                                <select id="taskProject" required class="form-select">
                                    <option value="">Seleccionar proyecto</option>
                                    ${userGroups.map(group => `
                                        <option value="${group.id}">${group.name} - ${group.project_name}</option>
                                    `).join('')}
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="taskAssignee">Responsable *</label>
                                <select id="taskAssignee" required class="form-select">
                                    <option value="">Seleccionar persona</option>
                                    ${users.map(user => `
                                        <option value="${user.id}">${user.full_name} (${user.role === 'teacher' ? 'Docente' : 'Estudiante'})</option>
                                    `).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="taskDeadline">Fecha Límite</label>
                            <input type="date" id="taskDeadline" class="form-input">
                        </div>

                        <div class="form-group">
                            <label>Miembros Asignados</label>
                            <div class="members-grid">
                                ${users.map(user => `
                                    <label class="member-checkbox">
                                        <input type="checkbox" name="assignedMembers" value="${user.id}">
                                        <span class="checkbox-custom"></span>
                                        <div class="member-info-small">
                                            <div class="member-name">${user.full_name}</div>
                                            <div class="member-role">${user.role === 'teacher' ? 'Docente' : 'Estudiante'}</div>
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline" onclick="closeModal()">Cancelar</button>
                    <button type="button" class="btn btn-primary" onclick="createNewTask()">Crear Tarea</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupModalEvents();
}

function createNewTask() {
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    const projectId = parseInt(document.getElementById('taskProject').value);
    const assigneeId = parseInt(document.getElementById('taskAssignee').value);
    const deadline = document.getElementById('taskDeadline').value;

    if (!title || !projectId || !assigneeId) {
        showAlert('Por favor completa los campos obligatorios', 'error');
        return;
    }

    // Obtener miembros asignados
    const assignedMembersCheckboxes = document.querySelectorAll('input[name="assignedMembers"]:checked');
    const assignedMembers = Array.from(assignedMembersCheckboxes).map(cb => parseInt(cb.value));
    
    // Incluir al asignado principal si no está en la lista
    if (!assignedMembers.includes(assigneeId)) {
        assignedMembers.push(assigneeId);
    }

    const tasks = getTasks();
    const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        assigned_to: assigneeId,
        project_id: projectId,
        deadline: deadline,
        status: 'pending',
        progress: 0,
        completed: false,
        created_at: new Date().toISOString(),
        submissions: [],
        assigned_members: assignedMembers
    };

    tasks.push(newTask);
    localStorage.setItem('colabu_tasks', JSON.stringify(tasks));

    closeModal();
    loadUserTasks();
    showAlert('Tarea creada exitosamente', 'success');
}

function updateGroupProgress(groupId) {
    const groups = getGroups();
    const tasks = getTasks();
    
    const groupTasks = tasks.filter(task => task.project_id === groupId);
    
    if (groupTasks.length > 0) {
        const totalProgress = groupTasks.reduce((sum, task) => sum + task.progress, 0);
        const averageProgress = Math.round(totalProgress / groupTasks.length);
        
        const groupIndex = groups.findIndex(group => group.id === groupId);
        if (groupIndex !== -1) {
            groups[groupIndex].progress = averageProgress;
            localStorage.setItem('colabu_groups', JSON.stringify(groups));
        }
    }
}

function setupModalEvents() {
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
    }

    // Cerrar con ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
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

// Funciones auxiliares
function formatDate(dateString) {
    if (!dateString) return 'No definida';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
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

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 4000);
}

// Hacer funciones globales
window.closeModal = closeModal;
window.saveTaskProgress = saveTaskProgress;
window.submitWork = submitWork;
window.createNewTask = createNewTask;

// Agregar CSS para los nuevos elementos
const tasksStyles = `
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .modal-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    .modal-container {
        background: white;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        display: flex;
        flex-direction: column;
        transform: translateY(-20px);
        transition: transform 0.3s ease;
    }

    .modal-overlay.active .modal-container {
        transform: translateY(0);
    }

    .modal-container.large {
        max-width: 700px;
    }

    .modal-header {
        padding: 24px 30px 20px;
        border-bottom: 1px solid #e9ecef;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f8f9fa;
        border-radius: 12px 12px 0 0;
    }

    .modal-header h2 {
        margin: 0;
        color: #2c3e50;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 1.8rem;
        cursor: pointer;
        color: #6c757d;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.3s ease;
    }

    .modal-close:hover {
        background: #e9ecef;
        color: #495057;
    }

    .modal-content {
        padding: 30px;
        flex: 1;
        overflow-y: auto;
    }

    .modal-footer {
        padding: 20px 30px;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        background: #f8f9fa;
        border-radius: 0 0 12px 12px;
    }

    .task-info-section {
        margin-bottom: 25px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 8px;
        border-left: 4px solid #3498db;
    }

    .task-info-section h3 {
        margin: 0 0 8px 0;
        color: #2c3e50;
        font-size: 1.2rem;
    }

    .task-description-modal {
        margin: 0;
        color: #6c757d;
        line-height: 1.5;
    }

    .deadline-info {
        margin-top: 12px;
        padding: 8px 12px;
        background: white;
        border-radius: 6px;
        font-size: 0.9rem;
        color: #495057;
    }

    .form-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .form-group {
        display: flex;
        flex-direction: column;
    }

    .form-group label {
        margin-bottom: 8px;
        color: #495057;
        font-weight: 600;
        font-size: 0.95rem;
    }

    .form-input, .form-select, .form-textarea {
        padding: 12px 16px;
        border: 2px solid #e9ecef;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: white;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
        outline: none;
        border-color: #3498db;
        box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .form-textarea {
        resize: vertical;
        min-height: 80px;
    }

    .slider-container {
        position: relative;
        margin: 15px 0 8px;
    }

    .progress-slider {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: #e9ecef;
        outline: none;
        -webkit-appearance: none;
    }

    .progress-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3498db;
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    .progress-slider::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #3498db;
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }

    .slider-value {
        position: absolute;
        top: -35px;
        background: #3498db;
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        transform: translateX(-50%);
    }

    .slider-labels {
        display: flex;
        justify-content: space-between;
        color: #6c757d;
        font-size: 0.8rem;
        margin-top: 5px;
    }

    .file-upload-label {
        display: inline-block;
        padding: 12px 24px;
        background: #f8f9fa;
        border: 2px dashed #dee2e6;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        transition: all 0.3s ease;
        color: #495057;
        font-weight: 500;
    }

    .file-upload-label:hover {
        border-color: #3498db;
        background: #e3f2fd;
    }

    .file-upload-label input {
        display: none;
    }

    .file-hint {
        display: block;
        margin-top: 6px;
        color: #6c757d;
        font-size: 0.85rem;
    }

    .file-preview-container {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .file-preview-item {
        display: flex;
        align-items: center;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
        gap: 12px;
    }

    .file-icon {
        font-size: 1.2rem;
        flex-shrink: 0;
    }

    .file-info {
        flex: 1;
    }

    .file-name {
        font-weight: 500;
        color: #495057;
        margin-bottom: 2px;
    }

    .file-size {
        font-size: 0.8rem;
        color: #6c757d;
    }

    .file-remove {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #dc3545;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.3s ease;
    }

    .file-remove:hover {
        background: #f8d7da;
    }

    .no-files {
        text-align: center;
        color: #6c757d;
        font-style: italic;
        padding: 20px;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 15px;
        margin-bottom: 25px;
    }

    .stat-card {
        background: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        border: 1px solid #e9ecef;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: #3498db;
        margin-bottom: 5px;
    }

    .stat-label {
        font-size: 0.85rem;
        color: #6c757d;
        font-weight: 500;
    }

    .content-tabs {
        margin-top: 20px;
    }

    .tab-buttons {
        display: flex;
        border-bottom: 2px solid #e9ecef;
        margin-bottom: 20px;
    }

    .tab-button {
        padding: 12px 24px;
        background: none;
        border: none;
        cursor: pointer;
        font-weight: 500;
        color: #6c757d;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        transition: all 0.3s ease;
    }

    .tab-button.active {
        color: #3498db;
        border-bottom-color: #3498db;
    }

    .tab-button:hover:not(.active) {
        color: #495057;
    }

    .tab-content {
        display: none;
    }

    .tab-content.active {
        display: block;
    }

    .submission-card {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .submission-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        background: #3498db;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .user-name {
        font-weight: 600;
        color: #2c3e50;
    }

    .submission-time {
        font-size: 0.85rem;
        color: #6c757d;
    }

    .submission-comment {
        margin: 12px 0;
        padding: 12px;
        background: #f8f9fa;
        border-radius: 6px;
        color: #495057;
        line-height: 1.5;
    }

    .submission-files {
        margin-top: 15px;
    }

    .files-title {
        font-weight: 600;
        color: #495057;
        margin-bottom: 8px;
    }

    .files-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 10px;
    }

    .file-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background: #f8f9fa;
        border-radius: 6px;
        border: 1px solid #e9ecef;
    }

    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: #6c757d;
        font-style: italic;
    }

    .pending-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .pending-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }

    .pending-item.completed {
        background: #d4edda;
        border-color: #c3e6cb;
    }

    .pending-item.pending {
        background: #f8d7da;
        border-color: #f5c6cb;
    }

    .member-info {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .member-details {
        display: flex;
        flex-direction: column;
    }

    .member-name {
        font-weight: 600;
        color: #2c3e50;
    }

    .member-email {
        font-size: 0.85rem;
        color: #6c757d;
    }

    .status-badge {
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }

    .status-badge.completed {
        background: #28a745;
        color: white;
    }

    .status-badge.pending {
        background: #dc3545;
        color: white;
    }

    .members-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 10px;
        max-height: 200px;
        overflow-y: auto;
        padding: 15px;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        background: #f8f9fa;
    }

    .member-checkbox {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .member-checkbox:hover {
        background: #e9ecef;
    }

    .member-checkbox input {
        display: none;
    }

    .checkbox-custom {
        width: 18px;
        height: 18px;
        border: 2px solid #bdc3c7;
        border-radius: 4px;
        position: relative;
        transition: all 0.3s ease;
        flex-shrink: 0;
    }

    .member-checkbox input:checked + .checkbox-custom {
        background: #3498db;
        border-color: #3498db;
    }

    .member-checkbox input:checked + .checkbox-custom::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 12px;
        font-weight: bold;
    }

    .member-info-small {
        display: flex;
        flex-direction: column;
    }

    .member-info-small .member-name {
        font-size: 0.9rem;
        font-weight: 500;
    }

    .member-info-small .member-role {
        font-size: 0.8rem;
        color: #6c757d;
    }

    .progress-section {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: 1rem 0;
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

    .submission-status {
        margin: 1rem 0;
    }

    .submission-progress {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .submission-label {
        font-size: 0.9rem;
        color: #7f8c8d;
        min-width: 120px;
    }

    .submission-bar {
        flex: 1;
        height: 6px;
        background: #ecf0f1;
        border-radius: 3px;
        overflow: hidden;
    }

    .submission-fill {
        height: 100%;
        background: #3498db;
        border-radius: 3px;
        transition: width 0.3s ease;
    }

    .submission-percent {
        font-weight: 600;
        color: #2c3e50;
        min-width: 35px;
        text-align: right;
        font-size: 0.9rem;
    }
    
    .task-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
        flex-wrap: wrap;
    }
    
    .btn-small {
        padding: 8px 16px;
        font-size: 0.9rem;
    }

    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        text-decoration: none;
        cursor: pointer;
        transition: all 0.3s ease;
        gap: 8px;
    }

    .btn-primary {
        background: #3498db;
        color: white;
    }

    .btn-primary:hover {
        background: #2980b9;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
    }

    .btn-secondary {
        background: #95a5a6;
        color: white;
    }

    .btn-secondary:hover {
        background: #7f8c8d;
        transform: translateY(-1px);
    }

    .btn-outline {
        background: transparent;
        color: #3498db;
        border: 2px solid #3498db;
    }

    .btn-outline:hover {
        background: #3498db;
        color: white;
        transform: translateY(-1px);
    }
`;

// Injectar estilos
if (!document.querySelector('#tasks-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'tasks-styles';
    styleElement.textContent = tasksStyles;
    document.head.appendChild(styleElement);
}

console.log('Tareas.js cargado correctamente');