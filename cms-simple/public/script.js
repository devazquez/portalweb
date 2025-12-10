/* ============================================================================
   FUNCIONALIDAD DEL PANEL ADMINISTRATIVO - CMS SIMPLE
   ============================================================================ */

// ============================================================================
// VARIABLES GLOBALES
// ============================================================================

// API_BASE - Usar el puerto correcto del servidor CMS
// IMPORTANTE: Si cambias el puerto del servidor, actualiza aquí
const API_BASE = 'http://localhost:3001/api';
let articulos = [];
let articulosFiltrados = [];
let paginaActual = 1;
const articulosPorPagina = 10;
let articuloEditando = null;

// ============================================================================
// ELEMENTOS DEL DOM
// ============================================================================

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');
const modal = document.getElementById('editModal');
const closeBtn = document.querySelector('.close-btn');
const searchInput = document.getElementById('searchInput');

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
    cargarArticulos();
    actualizarDashboard();
});

// ============================================================================
// EVENTOS DE NAVEGACIÓN
// ============================================================================

function inicializarEventos() {
    // Navegación del sidebar
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const seccion = item.getAttribute('data-section');
            mostrarSeccion(seccion);
        });
    });

    // Botón "Nuevo Artículo" en el header
    const newArticleBtn = document.getElementById('newArticleBtn');
    if (newArticleBtn) {
        newArticleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarSeccion('crear');
            const createForm = document.getElementById('articleForm');
            if (createForm) {
                createForm.reset();
            }
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = '0';
            }
            console.log('✅ Formulario de crear artículo abierto');
        });
    }

    // Modal
    closeBtn?.addEventListener('click', cerrarModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Botón Cancelar en modal
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cerrarModal);
    }

    // Formulario de crear artículo
    const createForm = document.getElementById('articleForm');
    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            crearArticulo();
        });
    }

    // Formulario de editar artículo
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            guardarEdicion();
        });
    }

    // Búsqueda
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            buscarArticulos(e.target.value);
        });
    }

    // Contador de caracteres
    const bodyInput = document.getElementById('body');
    if (bodyInput) {
        bodyInput.addEventListener('input', (e) => {
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = e.target.value.length;
            }
        });
    }

    const editBodyInput = document.getElementById('editBody');
    if (editBodyInput) {
        editBodyInput.addEventListener('input', (e) => {
            // Actualizar contador en el modal si existe
            console.log('Caracteres:', e.target.value.length);
        });
    }

    // Botones de exportar y limpiar
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportarArticulos);
    }

    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', limpiarDatos);
    }
}

function mostrarSeccion(nombreSeccion) {
    // Actualizar nav items
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === nombreSeccion) {
            item.classList.add('active');
        }
    });

    // Actualizar secciones (convertir nombreSeccion a id con guiones)
    sections.forEach(section => {
        section.classList.remove('active');
        // Convertir 'crear' a 'crear-section', 'articulos' a 'articulos-section', etc.
        const sectionId = nombreSeccion + '-section';
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });

    // Actualizar header
    const headerTitulos = {
        'dashboard': 'Panel de Control',
        'articles': 'Gestionar Artículos',
        'create': 'Crear Nuevo Artículo',
        'config': 'Configuración'
    };
    const headerLeft = document.querySelector('.header-left h2');
    if (headerLeft) {
        headerLeft.textContent = headerTitulos[nombreSeccion] || 'Panel Administrativo';
    }
}

// ============================================================================
// API - OPERACIONES CRUD
// ============================================================================

async function cargarArticulos() {
    try {
        console.log('📥 Cargando artículos desde:', API_BASE);
        const response = await fetch(`${API_BASE}/articulos`);
        if (!response.ok) throw new Error('Error al cargar artículos');
        
        const result = await response.json();
        console.log('✅ Respuesta recibida:', result);
        
        // La API devuelve {data: [...], meta: {...}}
        articulos = Array.isArray(result) ? result : (result.data || []);
        articulosFiltrados = [...articulos];
        
        console.log('✅ Artículos cargados:', articulos.length);
        console.log('   IDs disponibles:', articulos.map(a => `${a.id} (${typeof a.id})`).join(', '));
        
        renderizarTabla();
        actualizarDashboard();
        mostrarNotificacion('Artículos cargados correctamente', 'info');
    } catch (error) {
        console.error('❌ Error:', error);
        mostrarNotificacion('Error al cargar los artículos', 'error');
    }
}

async function crearArticulo() {
    const form = document.getElementById('articleForm');
    if (!form) {
        console.error('❌ Formulario no encontrado');
        return;
    }

    // Obtener valores del formulario
    const titulo = document.getElementById('title')?.value;
    const descripcion = document.getElementById('description')?.value;
    const cuerpo = document.getElementById('body')?.value;
    const autor = document.getElementById('author')?.value || 'Administrador';

    // Validar campos requeridos
    if (!titulo || !descripcion || !cuerpo) {
        mostrarNotificacion('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    const nuevoArticulo = {
        titulo,
        descripcion,
        cuerpo,
        autor,
        fecha: new Date().toISOString()
    };

    try {
        const response = await fetch(`${API_BASE}/articulos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoArticulo)
        });

        if (!response.ok) throw new Error('Error al crear artículo');

        const resultado = await response.json();
        form.reset();
        const charCount = document.getElementById('charCount');
        if (charCount) charCount.textContent = '0';
        mostrarNotificacion('Artículo creado exitosamente', 'success');
        cargarArticulos();
        mostrarSeccion('articulos');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al crear el artículo', 'error');
    }
}

async function eliminarArticulo(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este artículo?')) return;

    try {
        const response = await fetch(`${API_BASE}/articulos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar artículo');

        mostrarNotificacion('Artículo eliminado exitosamente', 'success');
        cargarArticulos();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al eliminar el artículo', 'error');
    }
}

async function abrirEdicion(id) {
    console.log('🔧 abrirEdicion() llamado con ID:', id, 'tipo:', typeof id);
    
    // Convertir a número si es string para comparación correcta
    const idNumero = parseInt(id, 10);
    console.log('   ID convertido a número:', idNumero);
    
    const articulo = articulos.find(a => {
        console.log('  Comparando: a.id=' + a.id + ' (' + typeof a.id + ') vs idNumero=' + idNumero);
        return a.id === idNumero || a.id == id;
    });
    
    console.log('📄 Artículo encontrado:', articulo);
    
    if (!articulo) {
        console.error('❌ No se encontró artículo con ID:', id);
        console.error('   Artículos disponibles:', articulos.map(a => a.id));
        return;
    }

    articuloEditando = articulo;
    console.log('✅ articuloEditando asignado');

    // Llenar formulario de edición con los IDs correctos del modal
    try {
        document.getElementById('editId').value = articulo.id || '';
        document.getElementById('editTitle').value = articulo.titulo || articulo.title || '';
        document.getElementById('editDescription').value = articulo.descripcion || articulo.description || '';
        document.getElementById('editBody').value = articulo.cuerpo || articulo.body || '';
        document.getElementById('editAuthor').value = articulo.autor || articulo.author || '';
        console.log('✅ Campos del formulario llenados');
    } catch (error) {
        console.error('❌ Error al llenar formulario:', error);
    }

    console.log('🎭 Llamando a abrirModal()');
    abrirModal();
    console.log('✅ Modal debería estar abierto');
}

async function guardarEdicion() {
    const form = document.getElementById('editForm');
    if (!form) {
        console.error('❌ Formulario de edición no encontrado');
        return;
    }

    if (!articuloEditando) {
        mostrarNotificacion('No hay artículo seleccionado', 'error');
        return;
    }

    // Obtener valores del formulario con los IDs correctos del modal
    const titulo = document.getElementById('editTitle')?.value;
    const descripcion = document.getElementById('editDescription')?.value;
    const cuerpo = document.getElementById('editBody')?.value;
    const autor = document.getElementById('editAuthor')?.value;

    if (!titulo || !descripcion || !cuerpo) {
        mostrarNotificacion('Por favor completa todos los campos requeridos', 'error');
        return;
    }

    const datosActualizados = {
        titulo,
        descripcion,
        cuerpo,
        autor: autor || 'Administrador',
        fecha: articuloEditando.fecha
    };

    try {
        const response = await fetch(`${API_BASE}/articulos/${articuloEditando.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        if (!response.ok) throw new Error('Error al actualizar artículo');

        cerrarModal();
        mostrarNotificacion('Artículo actualizado exitosamente', 'success');
        cargarArticulos();
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al actualizar el artículo', 'error');
    }
}

// ============================================================================
// BÚSQUEDA Y FILTRADO
// ============================================================================

function buscarArticulos(termino) {
    termino = termino.toLowerCase();

    if (termino === '') {
        articulosFiltrados = [...articulos];
    } else {
        articulosFiltrados = articulos.filter(a => 
            a.titulo.toLowerCase().includes(termino) ||
            a.descripcion.toLowerCase().includes(termino) ||
            a.cuerpo.toLowerCase().includes(termino) ||
            a.autor.toLowerCase().includes(termino)
        );
    }

    paginaActual = 1;
    renderizarTabla();
}

// ============================================================================
// RENDERIZADO DE TABLA
// ============================================================================

function renderizarTabla() {
    const tbody = document.getElementById('articlesTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (articulosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center empty-state">
                    No hay artículos disponibles
                </td>
            </tr>
        `;
        document.querySelector('.pagination').innerHTML = '';
        return;
    }

    // Calcular paginación
    const totalPaginas = Math.ceil(articulosFiltrados.length / articulosPorPagina);
    const inicio = (paginaActual - 1) * articulosPorPagina;
    const fin = inicio + articulosPorPagina;
    const articulosPagina = articulosFiltrados.slice(inicio, fin);

    // Renderizar filas
    articulosPagina.forEach(articulo => {
        const fila = document.createElement('tr');
        
        // Validar que el artículo tenga las propiedades necesarias
        const titulo = (articulo.titulo || 'Sin título').substring(0, 50);
        const autor = articulo.autor || 'Sin autor';
        const fecha = articulo.fecha ? new Date(articulo.fecha).toLocaleDateString('es-ES') : 'Sin fecha';
        const cuerpo = articulo.cuerpo || '';
        const tamano = cuerpo.length;

        fila.innerHTML = `
            <td>${titulo}</td>
            <td>${autor}</td>
            <td>${fecha}</td>
            <td>${tamano} caracteres</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-warning" onclick="abrirEdicion('${articulo.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarArticulo('${articulo.id}')">
                        🗑️ Eliminar
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });

    // Renderizar paginación
    renderizarPaginacion(totalPaginas);
}

function renderizarPaginacion(totalPaginas) {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    // Botón anterior
    const btnAnterior = document.createElement('button');
    btnAnterior.textContent = '← Anterior';
    btnAnterior.disabled = paginaActual === 1;
    btnAnterior.addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            renderizarTabla();
        }
    });
    paginationContainer.appendChild(btnAnterior);

    // Números de página
    for (let i = 1; i <= totalPaginas; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === paginaActual ? 'active' : '';
        btn.addEventListener('click', () => {
            paginaActual = i;
            renderizarTabla();
        });
        paginationContainer.appendChild(btn);
    }

    // Botón siguiente
    const btnSiguiente = document.createElement('button');
    btnSiguiente.textContent = 'Siguiente →';
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnSiguiente.addEventListener('click', () => {
        if (paginaActual < totalPaginas) {
            paginaActual++;
            renderizarTabla();
        }
    });
    paginationContainer.appendChild(btnSiguiente);
}

// ============================================================================
// MODAL
// ============================================================================

function abrirModal() {
    console.log('🎭 abrirModal() llamado');
    console.log('   modal elemento:', modal);
    console.log('   modal.classList antes:', modal?.className);
    
    if (modal) {
        modal.classList.remove('hidden');
        console.log('✅ Clase "hidden" removida');
        console.log('   modal.classList después:', modal.className);
    } else {
        console.error('❌ modal es null/undefined');
    }
}

function cerrarModal() {
    console.log('🎭 cerrarModal() llamado');
    
    if (modal) {
        modal.classList.add('hidden');
        console.log('✅ Clase "hidden" añadida');
        articuloEditando = null;
        const form = document.getElementById('editForm');
        if (form) form.reset();
    } else {
        console.error('❌ modal es null/undefined');
    }
}

// ============================================================================
// VALIDACIÓN DE FORMULARIOS
// ============================================================================

function validarFormulario(form) {
    let esValido = true;
    const inputs = form.querySelectorAll('[required]');

    inputs.forEach(input => {
        const errorMsg = input.parentElement.querySelector('.error-message');
        
        if (!input.value.trim()) {
            input.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = 'Este campo es requerido';
                errorMsg.classList.add('show');
            }
            esValido = false;
        } else {
            input.classList.remove('error');
            if (errorMsg) {
                errorMsg.classList.remove('show');
            }
        }
    });

    return esValido;
}

function actualizarContador() {
    const bodyInput = document.getElementById('articleBody');
    const contador = document.getElementById('charCount');
    if (bodyInput && contador) {
        const longitud = bodyInput.value.length;
        contador.textContent = `${longitud}/5000`;
    }
}

function actualizarContadorEdicion() {
    const bodyInput = document.getElementById('editArticleBody');
    const contador = document.getElementById('editCharCount');
    if (bodyInput && contador) {
        const longitud = bodyInput.value.length;
        contador.textContent = `${longitud}/5000`;
    }
}

// ============================================================================
// DASHBOARD
// ============================================================================

function actualizarDashboard() {
    const ahora = new Date();
    const hoyInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const hoyFin = new Date(hoyInicio.getTime() + 24 * 60 * 60 * 1000);

    // Total de artículos
    const totalArticulos = articulos.length;

    // Artículos de hoy
    const articulosHoy = articulos.filter(a => {
        const fecha = new Date(a.fecha);
        return fecha >= hoyInicio && fecha < hoyFin;
    }).length;

    // Conteo total de palabras
    const totalPalabras = articulos.reduce((total, a) => {
        const cuerpo = a.cuerpo || '';
        const palabras = cuerpo.split(/\s+/).filter(p => p.length > 0).length;
        return total + palabras;
    }, 0);

    // Última actualización
    let ultimaActualizacion = 'Nunca';
    if (articulos.length > 0) {
        const articulos_ordenados = [...articulos].sort((a, b) => 
            new Date(b.fecha || 0) - new Date(a.fecha || 0)
        );
        const fechaUltima = new Date(articulos_ordenados[0].fecha || Date.now());
        ultimaActualizacion = fechaUltima.toLocaleDateString('es-ES') + ' ' +
                            fechaUltima.toLocaleTimeString('es-ES');
    }

    // Actualizar tarjetas de estadísticas
    const tarjetas = document.querySelectorAll('.stats-number');
    if (tarjetas[0]) tarjetas[0].textContent = totalArticulos;
    if (tarjetas[1]) tarjetas[1].textContent = articulosHoy;
    if (tarjetas[2]) tarjetas[2].textContent = totalPalabras.toLocaleString('es-ES');

    const tiemposActualizacion = document.querySelectorAll('.stats-time');
    if (tiemposActualizacion[3]) tiemposActualizacion[3].textContent = ultimaActualizacion;

    // Actualizar lista de artículos recientes
    const recentArticles = document.getElementById('recentArticles');
    if (recentArticles) {
        recentArticles.innerHTML = '';
        const articulosRecientes = [...articulos]
            .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
            .slice(0, 5);

        if (articulosRecientes.length === 0) {
            recentArticles.innerHTML = '<div class="empty-state">No hay artículos recientes</div>';
        } else {
            articulosRecientes.forEach(articulo => {
                const fecha = (articulo.fecha ? new Date(articulo.fecha).toLocaleDateString('es-ES') : 'Sin fecha');
                const titulo = (articulo.titulo || 'Sin título').substring(0, 60);
                const autor = articulo.autor || 'Sin autor';
                
                const item = document.createElement('div');
                item.className = 'article-item';
                item.innerHTML = `
                    <div class="article-item-title">${titulo}</div>
                    <div class="article-item-meta">Por ${autor} - ${fecha}</div>
                `;
                recentArticles.appendChild(item);
            });
        }
    }

    // Actualizar configuración
    actualizarConfiguracion();
}

function actualizarConfiguracion() {
    const configInfo = document.querySelector('.config-info');
    if (configInfo) {
        const totalEspacioKB = (articulos.reduce((total, a) => {
            return total + JSON.stringify(a).length;
        }, 0) / 1024).toFixed(2);

        configInfo.innerHTML = `
            <p>
                <strong>Total de Artículos:</strong>
                <span>${articulos.length}</span>
            </p>
            <p>
                <strong>Espacio Utilizado:</strong>
                <span>${totalEspacioKB} KB</span>
            </p>
            <p>
                <strong>Última Sincronización:</strong>
                <span>${new Date().toLocaleTimeString('es-ES')}</span>
            </p>
            <p>
                <strong>Versión del Sistema:</strong>
                <span>1.0.0</span>
            </p>
        `;
    }
}

// ============================================================================
// EXPORTAR E IMPORTAR
// ============================================================================

function exportarArticulos() {
    if (articulos.length === 0) {
        mostrarNotificacion('No hay artículos para exportar', 'info');
        return;
    }

    const dataStr = JSON.stringify(articulos, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `articulos_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    mostrarNotificacion('Artículos exportados exitosamente', 'success');
}

function limpiarDatos() {
    if (!confirm('⚠️ ¿Estás COMPLETAMENTE seguro de que deseas eliminar TODOS los artículos? Esta acción no se puede deshacer.')) {
        return;
    }

    if (!confirm('Esta es tu última advertencia. ¿Continuar?')) {
        return;
    }

    // En una aplicación real, deberías hacer una llamada al servidor
    // Por ahora, solo limpiamos la interfaz
    articulos = [];
    articulosFiltrados = [];
    renderizarTabla();
    actualizarDashboard();
    mostrarNotificacion('Todos los artículos han sido eliminados', 'success');
}

// ============================================================================
// NOTIFICACIONES
// ============================================================================

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento toast si no existe
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast hidden';
        document.body.appendChild(toast);
    }

    toast.textContent = mensaje;
    toast.className = `toast ${tipo}`;
    
    // Mostrar
    setTimeout(() => {
        toast.classList.remove('hidden');
    }, 10);

    // Ocultar después de 3 segundos
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// ============================================================================
// UTILIDADES
// ============================================================================

// Formatear fecha
function formatearFecha(dateString) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', opciones);
}

// Truncar texto
function truncarTexto(texto, longitud = 100) {
    if (texto.length <= longitud) return texto;
    return texto.substring(0, longitud) + '...';
}

// Contar palabras
function contarPalabras(texto) {
    return texto.trim().split(/\s+/).filter(p => p.length > 0).length;
}
