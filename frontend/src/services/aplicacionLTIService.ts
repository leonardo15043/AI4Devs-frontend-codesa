import { AplicacionLTI } from '../types/aplicacionLTI';

const API_BASE_URL = '/api/aplicaciones';

interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

export const aplicacionLTIService = {
    /**
     * Obtiene la lista de todas las aplicaciones LTI
     * @returns Promise con la lista de aplicaciones
     * @throws Error si la petición falla
     */
    getAplicaciones: async (): Promise<AplicacionLTI[]> => {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error al obtener las aplicaciones: ${response.status}`);
            }

            const data: ApiResponse<AplicacionLTI[]> = await response.json();
            
            if (!Array.isArray(data.data)) {
                throw new Error('Formato de respuesta inválido: se esperaba un array de aplicaciones');
            }

            return data.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error en la petición: ${error.message}`);
            }
            throw new Error('Error desconocido al obtener las aplicaciones');
        }
    },

    /**
     * Obtiene una aplicación LTI por su ID
     * @param id ID de la aplicación
     * @returns Promise con los datos de la aplicación
     * @throws Error si la petición falla
     */
    getAplicacionById: async (id: number): Promise<AplicacionLTI> => {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al obtener la aplicación');
            }

            return await response.json();
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error en la petición: ${error.message}`);
            }
            throw new Error('Error desconocido al obtener la aplicación');
        }
    },

    /**
     * Crea una nueva aplicación LTI
     * @param aplicacion Datos de la aplicación a crear
     * @returns Promise con la aplicación creada
     * @throws Error si la petición falla o los datos son inválidos
     */
    createAplicacion: async (aplicacion: Omit<AplicacionLTI, 'id'>): Promise<AplicacionLTI> => {
        // Validación de campos requeridos
        if (!aplicacion.nombre?.trim()) {
            throw new Error('El nombre es requerido');
        }
        if (!aplicacion.url?.trim()) {
            throw new Error('La URL es requerida');
        }
        if (!aplicacion.descripcion?.trim()) {
            throw new Error('La descripción es requerida');
        }

        // Validación de formato de URL
        try {
            new URL(aplicacion.url);
        } catch {
            throw new Error('La URL proporcionada no es válida');
        }

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...aplicacion,
                    nombre: aplicacion.nombre.trim(),
                    descripcion: aplicacion.descripcion.trim(),
                    url: aplicacion.url.trim()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error al crear la aplicación: ${response.status}`);
            }

            const data: ApiResponse<AplicacionLTI> = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error en la petición: ${error.message}`);
            }
            throw new Error('Error desconocido al crear la aplicación');
        }
    },

    /**
     * Actualiza una aplicación LTI existente
     * @param id ID de la aplicación a actualizar
     * @param aplicacion Datos actualizados de la aplicación
     * @returns Promise con la aplicación actualizada
     * @throws Error si la petición falla o los datos son inválidos
     */
    updateAplicacion: async (id: number, aplicacion: Omit<AplicacionLTI, 'id'>): Promise<AplicacionLTI> => {
        // Validación del ID
        if (!id || id <= 0) {
            throw new Error('ID de aplicación inválido');
        }

        // Validación de campos requeridos
        if (!aplicacion.nombre?.trim()) {
            throw new Error('El nombre es requerido');
        }
        if (!aplicacion.url?.trim()) {
            throw new Error('La URL es requerida');
        }
        if (!aplicacion.descripcion?.trim()) {
            throw new Error('La descripción es requerida');
        }

        // Validación de formato de URL
        try {
            new URL(aplicacion.url);
        } catch {
            throw new Error('La URL proporcionada no es válida');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...aplicacion,
                    nombre: aplicacion.nombre.trim(),
                    descripcion: aplicacion.descripcion.trim(),
                    url: aplicacion.url.trim()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 404) {
                    throw new Error('La aplicación no fue encontrada');
                }
                throw new Error(errorData.message || `Error al actualizar la aplicación: ${response.status}`);
            }

            const data: ApiResponse<AplicacionLTI> = await response.json();
            return data.data;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error en la petición: ${error.message}`);
            }
            throw new Error('Error desconocido al actualizar la aplicación');
        }
    },

    /**
     * Elimina una aplicación LTI
     * @param id ID de la aplicación a eliminar
     * @returns Promise que se resuelve cuando la eliminación es exitosa
     * @throws Error si la petición falla o el ID es inválido
     */
    deleteAplicacion: async (id: number): Promise<void> => {
        // Validación del ID
        if (!id || id <= 0) {
            throw new Error('ID de aplicación inválido');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 404) {
                    throw new Error('La aplicación no fue encontrada');
                }
                throw new Error(errorData.message || `Error al eliminar la aplicación: ${response.status}`);
            }

            // Verificar si la respuesta tiene contenido
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data: ApiResponse<void> = await response.json();
                if (data.message) {
                    console.log('Mensaje del servidor:', data.message);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error en la petición: ${error.message}`);
            }
            throw new Error('Error desconocido al eliminar la aplicación');
        }
    }
}; 