// ============================================================================
// UTILIDADES Y FUNCIONES AUXILIARES DEL CMS
// ============================================================================

// ============================================================================
// GESTIÓN DE NOTIFICACIONES
// ============================================================================

class NotificacionCMS {
    constructor() {
        this.contenedor = document.getElementById('notificaciones');
        if (!this.contenedor) {
            this.contenedor = document.createElement('div');
            this.contenedor.id = 'notificaciones';
            document.body.appendChild(this.contenedor);
        }
    }

    mostrar(mensaje, tipo = 'info', duracion = 4000) {
        const notificacion = document.createElement('div');
        notificacion.className = `notificacion notificacion-${tipo}`;
        notificacion.innerHTML = `
            <span>${mensaje}</span>
            <button class="cerrar-notificacion">✕</button>
        `;

        this.contenedor.appendChild(notificacion);

        notificacion.querySelector('.cerrar-notificacion').addEventListener('click', () => {
            notificacion.remove();
        });

        if (duracion > 0) {
            setTimeout(() => notificacion.remove(), duracion);
        }

        return notificacion;
    }

    exito(mensaje) {
        return this.mostrar(`✅ ${mensaje}`, 'exito');
    }

    error(mensaje) {
        return this.mostrar(`❌ ${mensaje}`, 'error', 6000);
    }

    advertencia(mensaje) {
        return this.mostrar(`⚠️ ${mensaje}`, 'advertencia');
    }

    info(mensaje) {
        return this.mostrar(`ℹ️ ${mensaje}`, 'info');
    }

    cargando(mensaje) {
        const notif = this.mostrar(`⏳ ${mensaje}`, 'cargando', -1);
        return notif;
    }

    actualizarCargando(notificacion, nuevoMensaje) {
        if (notificacion) {
            notificacion.innerHTML = `
                <span>⏳ ${nuevoMensaje}</span>
                <button class="cerrar-notificacion">✕</button>
            `;
        }
    }

    cerrar(notificacion) {
        if (notificacion) {
            notificacion.remove();
        }
    }
}

// ============================================================================
// GESTIÓN DE CONFIRMACIÓN DE ACCIONES
// ============================================================================

class ConfirmacionCMS {
    static mostrar(titulo, mensaje, opciones = {}) {
        return new Promise((resolver) => {
            const modal = document.createElement('div');
            modal.className = 'modal-confirmacion';
            modal.innerHTML = `
                <div class="modal-contenido-confirmacion">
                    <h3>${titulo}</h3>
                    <p>${mensaje}</p>
                    <div class="botones-confirmacion">
                        <button class="btn-cancelar">Cancelar</button>
                        <button class="btn-confirmar">${opciones.textBoton || 'Confirmar'}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            const btnCancelar = modal.querySelector('.btn-cancelar');
            const btnConfirmar = modal.querySelector('.btn-confirmar');

            btnCancelar.addEventListener('click', () => {
                modal.remove();
                resolver(false);
            });

            btnConfirmar.addEventListener('click', () => {
                modal.remove();
                resolver(true);
            });

            // Cerrar al presionar ESC
            const handleKeyDown = (e) => {
                if (e.key === 'Escape') {
                    modal.remove();
                    document.removeEventListener('keydown', handleKeyDown);
                    resolver(false);
                }
            };
            document.addEventListener('keydown', handleKeyDown);
        });
    }

    static eliminar(nombre) {
        return this.mostrar(
            '⚠️ Confirmar eliminación',
            `¿Estás seguro de que deseas eliminar "${nombre}"? Esta acción no se puede deshacer.`,
            { textBoton: '🗑️ Eliminar' }
        );
    }

    static guardarCambios() {
        return this.mostrar(
            '💾 Guardar cambios',
            '¿Deseas guardar los cambios?',
            { textBoton: '💾 Guardar' }
        );
    }
}

// ============================================================================
// GESTIÓN DE ESTADO LOCAL
// ============================================================================

class EstadoLocal {
    constructor(clave = 'cmsEstado') {
        this.clave = clave;
    }

    guardar(datos) {
        try {
            localStorage.setItem(this.clave, JSON.stringify(datos));
            return true;
        } catch (error) {
            console.error('❌ Error guardando estado local:', error);
            return false;
        }
    }

    obtener(default_value = null) {
        try {
            const datos = localStorage.getItem(this.clave);
            return datos ? JSON.parse(datos) : default_value;
        } catch (error) {
            console.error('❌ Error obteniendo estado local:', error);
            return default_value;
        }
    }

    limpiar() {
        try {
            localStorage.removeItem(this.clave);
            return true;
        } catch (error) {
            console.error('❌ Error limpiando estado local:', error);
            return false;
        }
    }

    establecerItem(clave, valor) {
        const estado = this.obtener({});
        estado[clave] = valor;
        this.guardar(estado);
    }

    obtenerItem(clave, default_value = null) {
        const estado = this.obtener({});
        return estado[clave] || default_value;
    }
}

// ============================================================================
// UTILIDADES DE FECHA Y HORA
// ============================================================================

class UtilFecha {
    static ahora() {
        return new Date();
    }

    static formatear(fecha, formato = 'dd/mm/yyyy hh:mm') {
        const d = new Date(fecha);
        const opciones = {
            'yyyy': d.getFullYear(),
            'mm': String(d.getMonth() + 1).padStart(2, '0'),
            'dd': String(d.getDate()).padStart(2, '0'),
            'hh': String(d.getHours()).padStart(2, '0'),
            'ii': String(d.getMinutes()).padStart(2, '0'),
            'ss': String(d.getSeconds()).padStart(2, '0')
        };

        let resultado = formato;
        Object.entries(opciones).forEach(([clave, valor]) => {
            resultado = resultado.replace(new RegExp(clave, 'g'), valor);
        });

        return resultado;
    }

    static hace(fecha) {
        const ahora = new Date();
        const diff = ahora - new Date(fecha);
        const segundos = Math.floor(diff / 1000);
        const minutos = Math.floor(segundos / 60);
        const horas = Math.floor(minutos / 60);
        const dias = Math.floor(horas / 24);

        if (segundos < 60) return `hace ${segundos}s`;
        if (minutos < 60) return `hace ${minutos}m`;
        if (horas < 24) return `hace ${horas}h`;
        if (dias < 7) return `hace ${dias}d`;

        return this.formatear(fecha, 'dd/mm/yyyy');
    }

    static esHoy(fecha) {
        const hoy = new Date();
        const fecha_obj = new Date(fecha);
        return hoy.toDateString() === fecha_obj.toDateString();
    }

    static esAyer(fecha) {
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        const fecha_obj = new Date(fecha);
        return ayer.toDateString() === fecha_obj.toDateString();
    }
}

// ============================================================================
// UTILIDADES DE STRING
// ============================================================================

class UtilString {
    static truncar(texto, longitud = 100, sufijo = '...') {
        if (texto.length <= longitud) return texto;
        return texto.substring(0, longitud) + sufijo;
    }

    static capitalizarPrimera(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    static capitalizarPalabras(texto) {
        return texto.split(' ').map(palabra => this.capitalizarPrimera(palabra)).join(' ');
    }

    static slug(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    static limpiar(texto) {
        return texto
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[<>]/g, '');
    }

    static contieneEmoji(texto) {
        const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
        return emojiRegex.test(texto);
    }

    static extraerEmoji(texto) {
        const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
        return texto.match(emojiRegex) || [];
    }
}

// ============================================================================
// UTILIDADES DE VALIDACIÓN
// ============================================================================

class UtilValidacion {
    static esEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static esURL(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    static esJSON(texto) {
        try {
            JSON.parse(texto);
            return true;
        } catch (error) {
            return false;
        }
    }

    static esNumero(valor) {
        return !isNaN(valor) && !isNaN(parseFloat(valor));
    }

    static esEntero(valor) {
        return Number.isInteger(Number(valor));
    }

    static esVacio(valor) {
        if (typeof valor === 'string') {
            return valor.trim().length === 0;
        }
        return valor === null || valor === undefined || valor === '';
    }

    static longitudEntre(texto, min, max) {
        return texto.length >= min && texto.length <= max;
    }

    static soloLetras(texto) {
        return /^[a-zA-Z\s]+$/.test(texto);
    }

    static soloNumeros(texto) {
        return /^\d+$/.test(texto);
    }

    static alfanumerico(texto) {
        return /^[a-zA-Z0-9]+$/.test(texto);
    }
}

// ============================================================================
// UTILIDADES DE OBJETO
// ============================================================================

class UtilObjeto {
    static copiar(objeto) {
        return JSON.parse(JSON.stringify(objeto));
    }

    static fusionar(...objetos) {
        return Object.assign({}, ...objetos);
    }

    static filtrar(objeto, predicado) {
        return Object.fromEntries(
            Object.entries(objeto).filter(([clave, valor]) => predicado(clave, valor))
        );
    }

    static mapear(objeto, transformador) {
        return Object.fromEntries(
            Object.entries(objeto).map(([clave, valor]) => 
                [clave, transformador(clave, valor)]
            )
        );
    }

    static ordenarPor(array, propiedad, ascendente = true) {
        return [...array].sort((a, b) => {
            if (a[propiedad] < b[propiedad]) return ascendente ? -1 : 1;
            if (a[propiedad] > b[propiedad]) return ascendente ? 1 : -1;
            return 0;
        });
    }

    static agruparPor(array, propiedad) {
        return array.reduce((grupos, item) => {
            const clave = item[propiedad];
            if (!grupos[clave]) grupos[clave] = [];
            grupos[clave].push(item);
            return grupos;
        }, {});
    }

    static obtenerValor(objeto, ruta) {
        const partes = ruta.split('.');
        let valor = objeto;
        for (const parte of partes) {
            valor = valor?.[parte];
        }
        return valor;
    }
}

// ============================================================================
// INSTANCIAS GLOBALES
// ============================================================================

const notificacion = new NotificacionCMS();
const estado = new EstadoLocal('cmsEstado');
const fecha = UtilFecha;
const string = UtilString;
const validacion = UtilValidacion;
const objeto = UtilObjeto;

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NotificacionCMS,
        ConfirmacionCMS,
        EstadoLocal,
        UtilFecha,
        UtilString,
        UtilValidacion,
        UtilObjeto,
        notificacion,
        estado,
        fecha,
        string,
        validacion,
        objeto
    };
}
