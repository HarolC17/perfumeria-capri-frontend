// Placeholder SVG embebido para productos sin imagen
export const PLACEHOLDER_IMAGE_100 = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Cpath fill="%23ccc" d="M30 35 L50 55 L70 35 L70 65 L30 65 Z"/%3E%3Ccircle fill="%23ccc" cx="38" cy="42" r="4"/%3E%3C/svg%3E';

export const PLACEHOLDER_IMAGE_60 = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"%3E%3Crect fill="%23f0f0f0" width="60" height="60"/%3E%3Cpath fill="%23ccc" d="M18 21 L30 33 L42 21 L42 39 L18 39 Z"/%3E%3Ccircle fill="%23ccc" cx="23" cy="25" r="2.5"/%3E%3C/svg%3E';

/**
 * Maneja el error de carga de imagen y muestra el placeholder
 * @param {Event} e - Evento de error de la imagen
 * @param {string} placeholder - URL del placeholder a usar
 */
export const handleImageError = (e, placeholder) => {
    if (e.target.src !== placeholder) {
        e.target.onerror = null;
        e.target.src = placeholder;
    }
};
