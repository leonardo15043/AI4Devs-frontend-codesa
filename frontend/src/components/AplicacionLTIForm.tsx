import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

interface AplicacionLTI {
    id?: number;
    nombre: string;
    descripcion: string;
    url: string;
}

const AplicacionLTIForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [aplicacion, setAplicacion] = useState<AplicacionLTI>({
        nombre: '',
        descripcion: '',
        url: ''
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        if (id) {
            fetchAplicacion();
        }
    }, [id]);

    const fetchAplicacion = async () => {
        try {
            const response = await fetch(`/api/aplicaciones/${id}`);
            if (!response.ok) {
                throw new Error('Error al cargar la aplicación');
            }
            const data = await response.json();
            setAplicacion(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar la aplicación');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const url = id ? `/api/aplicaciones/${id}` : '/api/aplicaciones';
            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(aplicacion),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al guardar la aplicación');
            }

            setSuccess('Aplicación guardada correctamente');
            setTimeout(() => {
                navigate('/aplicaciones');
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar la aplicación');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAplicacion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Container className="mt-4">
            <h2 className="mb-4">{id ? 'Editar' : 'Crear'} Aplicación LTI</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={aplicacion.nombre}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese el nombre de la aplicación"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="descripcion"
                        value={aplicacion.descripcion}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese la descripción de la aplicación"
                        rows={3}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                        type="url"
                        name="url"
                        value={aplicacion.url}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese la URL de la aplicación"
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button variant="primary" type="submit">
                        Guardar
                    </Button>
                    <Button variant="secondary" onClick={() => navigate('/aplicaciones')}>
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default AplicacionLTIForm; 