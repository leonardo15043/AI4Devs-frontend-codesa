import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { aplicacionLTIService } from '../services/aplicacionLTIService';
import { AplicacionLTI } from '../types/aplicacionLTI';

const FormularioAplicacion: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState<Omit<AplicacionLTI, 'id'>>({
        nombre: '',
        descripcion: '',
        url: ''
    });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEditing) {
            fetchAplicacion();
        }
    }, [id]);

    const fetchAplicacion = async () => {
        try {
            setIsLoading(true);
            setError('');
            const aplicacion = await aplicacionLTIService.getAplicacionById(parseInt(id!));
            setFormData({
                nombre: aplicacion.nombre,
                descripcion: aplicacion.descripcion,
                url: aplicacion.url
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar la aplicación');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            setError('');
            setSuccess('');

            if (isEditing) {
                await aplicacionLTIService.updateAplicacion(parseInt(id!), formData);
                setSuccess('Aplicación actualizada exitosamente');
            } else {
                await aplicacionLTIService.createAplicacion(formData);
                setSuccess('Aplicación creada exitosamente');
            }

            // Redirigir después de un breve delay para mostrar el mensaje de éxito
            setTimeout(() => {
                navigate('/aplicaciones');
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar la aplicación');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-2">Cargando aplicación...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">{isEditing ? 'Editar' : 'Nueva'} Aplicación LTI</h2>

            {error && (
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            )}

            {success && (
                <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                    <Alert.Heading>Éxito</Alert.Heading>
                    <p>{success}</p>
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
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
                        value={formData.descripcion}
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
                        value={formData.url}
                        onChange={handleChange}
                        required
                        placeholder="Ingrese la URL de la aplicación"
                    />
                </Form.Group>

                <div className="d-flex gap-2">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Guardando...
                            </>
                        ) : (
                            'Guardar'
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/aplicaciones')}
                    >
                        Cancelar
                    </Button>
                </div>
            </Form>
        </Container>
    );
};

export default FormularioAplicacion; 