// ============================================================================
// VISTAS PARA DIFERENTES TIPOS DE CONTENIDO
// ============================================================================

const VISTAS_CONTENIDO = {
    articulos: {
        nombre: 'Artículos',
        campos: [
            { id: 'title', etiqueta: 'Título', tipo: 'text', requerido: true },
            { id: 'description', etiqueta: 'Descripción', tipo: 'text', requerido: true },
            { id: 'body', etiqueta: 'Contenido', tipo: 'textarea', requerido: true },
            { id: 'author', etiqueta: 'Autor', tipo: 'text', requerido: false }
        ],
        columnas: ['titulo', 'descripcion', 'autor', 'fecha']
    },
    
    libros: {
        nombre: 'Libros',
        campos: [
            { id: 'title', etiqueta: 'Título', tipo: 'text', requerido: true },
            { id: 'author', etiqueta: 'Autor', tipo: 'text', requerido: true },
            { id: 'isbn', etiqueta: 'ISBN', tipo: 'text', requerido: false },
            { id: 'publicacionDate', etiqueta: 'Fecha de Publicación', tipo: 'date', requerido: false },
            { id: 'editorial', etiqueta: 'Editorial', tipo: 'text', requerido: false },
            { id: 'description', etiqueta: 'Descripción', tipo: 'textarea', requerido: true },
            { id: 'portada', etiqueta: 'Portada (URL)', tipo: 'text', requerido: false }
        ],
        columnas: ['titulo', 'autor', 'isbn', 'editorial', 'fecha']
    },
    
    multimedia: {
        nombre: 'Multimedia',
        campos: [
            { id: 'title', etiqueta: 'Título', tipo: 'text', requerido: true },
            { id: 'type', etiqueta: 'Tipo', tipo: 'select', opciones: ['video', 'audio', 'imagen', 'presentación'], requerido: true },
            { id: 'url', etiqueta: 'URL', tipo: 'text', requerido: true },
            { id: 'thumbnail', etiqueta: 'Miniatura (URL)', tipo: 'text', requerido: false },
            { id: 'description', etiqueta: 'Descripción', tipo: 'textarea', requerido: true },
            { id: 'duration', etiqueta: 'Duración (minutos)', tipo: 'number', requerido: false }
        ],
        columnas: ['titulo', 'type', 'description']
    },
    
    recursos: {
        nombre: 'Recursos',
        campos: [
            { id: 'title', etiqueta: 'Título', tipo: 'text', requerido: true },
            { id: 'category', etiqueta: 'Categoría', tipo: 'select', opciones: ['tutorial', 'guía', 'template', 'herramienta', 'referencia'], requerido: true },
            { id: 'url', etiqueta: 'URL', tipo: 'text', requerido: true },
            { id: 'format', etiqueta: 'Formato', tipo: 'select', opciones: ['pdf', 'html', 'video', 'aplicación'], requerido: true },
            { id: 'description', etiqueta: 'Descripción', tipo: 'textarea', requerido: true },
            { id: 'tags', etiqueta: 'Etiquetas', tipo: 'text', requerido: false }
        ],
        columnas: ['titulo', 'category', 'format', 'description']
    }
};

// ============================================================================
// FUNCIONES DE GENERACIÓN DE VISTAS
// ============================================================================

function obtenerConfiguracionTipo(tipo) {
    return VISTAS_CONTENIDO[tipo] || VISTAS_CONTENIDO.articulos;
}

function generarFormularioPorTipo(tipo, datos = {}, esEdicion = false) {
    const config = obtenerConfiguracionTipo(tipo);
    let html = '';

    config.campos.forEach(campo => {
        const valor = datos[campo.id] || '';
        const claseRequerido = campo.requerido ? 'requerido' : '';
        
        switch (campo.tipo) {
            case 'text':
                html += `
                    <div class="campo-formulario ${claseRequerido}">
                        <label for="${tipo}-${campo.id}">${campo.etiqueta}</label>
                        <input type="text" id="${tipo}-${campo.id}" value="${valor}" placeholder="${campo.etiqueta}">
                    </div>
                `;
                break;
            
            case 'textarea':
                html += `
                    <div class="campo-formulario ${claseRequerido}">
                        <label for="${tipo}-${campo.id}">${campo.etiqueta}</label>
                        <textarea id="${tipo}-${campo.id}" placeholder="${campo.etiqueta}" rows="8">${valor}</textarea>
                        <small class="contador-caracteres" id="${tipo}-${campo.id}-contador">0 caracteres</small>
                    </div>
                `;
                break;
            
            case 'date':
                html += `
                    <div class="campo-formulario ${claseRequerido}">
                        <label for="${tipo}-${campo.id}">${campo.etiqueta}</label>
                        <input type="date" id="${tipo}-${campo.id}" value="${valor}">
                    </div>
                `;
                break;
            
            case 'number':
                html += `
                    <div class="campo-formulario ${claseRequerido}">
                        <label for="${tipo}-${campo.id}">${campo.etiqueta}</label>
                        <input type="number" id="${tipo}-${campo.id}" value="${valor}" placeholder="${campo.etiqueta}">
                    </div>
                `;
                break;
            
            case 'select':
                const opciones = campo.opciones.map(op => 
                    `<option value="${op}" ${valor === op ? 'selected' : ''}>${op}</option>`
                ).join('');
                html += `
                    <div class="campo-formulario ${claseRequerido}">
                        <label for="${tipo}-${campo.id}">${campo.etiqueta}</label>
                        <select id="${tipo}-${campo.id}">
                            <option value="">Selecciona...</option>
                            ${opciones}
                        </select>
                    </div>
                `;
                break;
        }
    });

    return html;
}

function generarTablaParaTipo(tipo, datos = []) {
    const config = obtenerConfiguracionTipo(tipo);
    let html = `
        <table class="tabla-contenido">
            <thead>
                <tr>
    `;

    config.columnas.forEach(columna => {
        html += `<th>${columna.charAt(0).toUpperCase() + columna.slice(1)}</th>`;
    });

    html += `
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    datos.forEach(item => {
        html += `<tr data-id="${item.id}">`;
        
        config.columnas.forEach(columna => {
            const valor = item[columna] || '-';
            html += `<td>${valor}</td>`;
        });

        html += `
            <td class="acciones">
                <button class="btn-editar" data-id="${item.id}">✏️ Editar</button>
                <button class="btn-eliminar" data-id="${item.id}">🗑️ Eliminar</button>
            </td>
        </tr>`;
    });

    html += `
            </tbody>
        </table>
    `;

    return html;
}

function cambiarTipoContenido(nuevoTipo) {
    const config = obtenerConfiguracionTipo(nuevoTipo);
    
    // Actualizar título de sección
    const tituloSeccion = document.querySelector('[data-seccion="crear"] h2');
    if (tituloSeccion) {
        tituloSeccion.textContent = `Crear ${config.nombre}`;
    }

    // Actualizar formulario
    const formulario = document.querySelector('[data-seccion="crear"] form');
    if (formulario) {
        formulario.innerHTML = generarFormularioPorTipo(nuevoTipo);
        adjuntarEscuchasFormulario(nuevoTipo);
    }

    console.log(`✅ Tipo de contenido cambiado a: ${config.nombre}`);
}

// ============================================================================
// FILTRADO Y BÚSQUEDA POR TIPO
// ============================================================================

function filtrarPorTipo(contenido, tipo) {
    if (tipo === 'todos') return contenido;
    return contenido.filter(item => item.tipo === tipo);
}

function buscarEnTipo(contenido, termino, tipo = 'todos') {
    let resultados = contenido;
    
    // Filtrar por tipo si se especifica
    if (tipo !== 'todos') {
        resultados = resultados.filter(item => item.tipo === tipo);
    }
    
    // Buscar por término
    const terminoLower = termino.toLowerCase();
    resultados = resultados.filter(item => 
        (item.titulo && item.titulo.toLowerCase().includes(terminoLower)) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(terminoLower)) ||
        (item.cuerpo && item.cuerpo.toLowerCase().includes(terminoLower)) ||
        (item.author && item.author.toLowerCase().includes(terminoLower))
    );
    
    return resultados;
}

// ============================================================================
// VALIDACIÓN DE CAMPOS
// ============================================================================

function validarFormularioPorTipo(tipo) {
    const config = obtenerConfiguracionTipo(tipo);
    const errores = [];

    config.campos.forEach(campo => {
        if (campo.requerido) {
            const elemento = document.getElementById(`${tipo}-${campo.id}`);
            const valor = elemento?.value?.trim() || '';
            
            if (!valor) {
                errores.push(`${campo.etiqueta} es requerido`);
            }
        }
    });

    return {
        valido: errores.length === 0,
        errores
    };
}

function obtenerDatosFormularioPorTipo(tipo) {
    const config = obtenerConfiguracionTipo(tipo);
    const datos = {
        tipo,
        fecha: new Date().toISOString(),
        id: Date.now().toString()
    };

    config.campos.forEach(campo => {
        const elemento = document.getElementById(`${tipo}-${campo.id}`);
        if (elemento) {
            datos[campo.id] = elemento.value;
        }
    });

    return datos;
}

function rellenarFormularioPorTipo(tipo, datos) {
    const config = obtenerConfiguracionTipo(tipo);

    config.campos.forEach(campo => {
        const elemento = document.getElementById(`${tipo}-${campo.id}`);
        if (elemento && datos[campo.id]) {
            elemento.value = datos[campo.id];
        }
    });
}

// ============================================================================
// FUNCIONES DE AYUDA
// ============================================================================

function adjuntarEscuchasFormulario(tipo) {
    const config = obtenerConfiguracionTipo(tipo);

    // Escuchas para contadores de caracteres
    config.campos.forEach(campo => {
        if (campo.tipo === 'textarea') {
            const textarea = document.getElementById(`${tipo}-${campo.id}`);
            const contador = document.getElementById(`${tipo}-${campo.id}-contador`);
            
            if (textarea && contador) {
                textarea.addEventListener('input', () => {
                    contador.textContent = `${textarea.value.length} caracteres`;
                });
            }
        }
    });
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        VISTAS_CONTENIDO,
        obtenerConfiguracionTipo,
        generarFormularioPorTipo,
        generarTablaParaTipo,
        cambiarTipoContenido,
        filtrarPorTipo,
        buscarEnTipo,
        validarFormularioPorTipo,
        obtenerDatosFormularioPorTipo,
        rellenarFormularioPorTipo,
        adjuntarEscuchasFormulario
    };
}
