/* ============================================================================
   FUNCIONALIDAD DEL PANEL ADMINISTRATIVO - CMS SIMPLE
   ============================================================================ */

// ============================================================================
// VARIABLES GLOBALES
// ============================================================================

const API_BASE = 'http://localhost:1337/api';
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

    // Modal
    closeBtn?.addEventListener('click', cerrarModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
    });

    // Formulario de crear artículo
    const createForm = document.getElementById('createForm');
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
    const bodyInput = document.getElementById('articleBody');
    if (bodyInput) {
        bodyInput.addEventListener('input', actualizarContador);
    }

    const editBodyInput = document.getElementById('editArticleBody');
    if (editBodyInput) {
        editBodyInput.addEventListener('input', actualizarContadorEdicion);
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

    // Actualizar secciones
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === nombreSeccion + 'Section') {
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
        const response = await fetch(`${API_BASE}/articulos`);
        if (!response.ok) throw new Error('Error al cargar artículos');
        
        articulos = await response.json();
        articulosFiltrados = [...articulos];
        renderizarTabla();
        actualizarDashboard();
        mostrarNotificacion('Artículos cargados correctamente', 'info');
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al cargar los artículos', 'error');
    }
}

async function crearArticulo() {
    const form = document.getElementById('createForm');
    if (!validarFormulario(form)) return;

    const formData = new FormData(form);
    const nuevoArticulo = {
        titulo: formData.get('articleTitle'),
        descripcion: formData.get('articleDescription'),
        cuerpo: formData.get('articleBody'),
        autor: formData.get('articleAuthor') || 'Administrador',
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
        document.getElementById('charCount').textContent = '0/5000';
        mostrarNotificacion('Artículo creado exitosamente', 'success');
        cargarArticulos();
        mostrarSeccion('articles');
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
    const articulo = articulos.find(a => a.id === id);
    if (!articulo) return;

    articuloEditando = articulo;

    // Llenar formulario de edición
    document.getElementById('editArticleTitle').value = articulo.titulo;
    document.getElementById('editArticleDescription').value = articulo.descripcion;
    document.getElementById('editArticleBody').value = articulo.cuerpo;
    document.getElementById('editArticleAuthor').value = articulo.autor;

    document.getElementById('editCharCount').textContent = `${articulo.cuerpo.length}/5000`;
    
    abrirModal();
}

async function guardarEdicion() {
    const form = document.getElementById('editForm');
    if (!validarFormulario(form)) return;

    if (!articuloEditando) return;

    const formData = new FormData(form);
    const datosActualizados = {
        titulo: formData.get('editArticleTitle'),
        descripcion: formData.get('editArticleDescription'),
        cuerpo: formData.get('editArticleBody'),
        autor: formData.get('editArticleAuthor'),
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
        const fechaFormato = new Date(articulo.fecha).toLocaleDateString('es-ES');
        const titulo = articulo.titulo.length > 50 
            ? articulo.titulo.substring(0, 50) + '...' 
            : articulo.titulo;

        fila.innerHTML = `
            <td>${titulo}</td>
            <td>${articulo.autor}</td>
            <td>${fechaFormato}</td>
            <td>${articulo.cuerpo.length} caracteres</td>
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
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function cerrarModal() {
    if (modal) {
        modal.classList.add('hidden');
        articuloEditando = null;
        document.getElementById('editForm').reset();
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
        const palabras = a.cuerpo.split(/\s+/).filter(p => p.length > 0).length;
        return total + palabras;
    }, 0);

    // Última actualización
    let ultimaActualizacion = 'Nunca';
    if (articulos.length > 0) {
        const articulos_ordenados = [...articulos].sort((a, b) => 
            new Date(b.fecha) - new Date(a.fecha)
        );
        const fechaUltima = new Date(articulos_ordenados[0].fecha);
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
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 5);

        if (articulosRecientes.length === 0) {
            recentArticles.innerHTML = '<div class="empty-state">No hay artículos recientes</div>';
        } else {
            articulosRecientes.forEach(articulo => {
                const fecha = new Date(articulo.fecha).toLocaleDateString('es-ES');
                const titulo = articulo.titulo.length > 60 
                    ? articulo.titulo.substring(0, 60) + '...' 
                    : articulo.titulo;
                
                const item = document.createElement('div');
                item.className = 'article-item';
                item.innerHTML = `
                    <div class="article-item-title">${titulo}</div>
                    <div class="article-item-meta">Por ${articulo.autor} - ${fecha}</div>
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
