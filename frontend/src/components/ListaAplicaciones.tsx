import React, { useEffect, useState } from 'react';
import { Table, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { Pencil, Trash, Plus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import ConfirmarEliminar from './ConfirmarEliminar';
import { aplicacionLTIService } from '../services/aplicacionLTIService';
import { AplicacionLTI } from '../types/aplicacionLTI';

const ListaAplicaciones: React.FC = () => {
    const navigate = useNavigate();
    const [aplicaciones, setAplicaciones] = useState<AplicacionLTI[]>([]);
    const [error, setError] = useState<string>('');
    const [showDialog, setShowDialog] = useState(false);
    const [aplicacionToDelete, setAplicacionToDelete] = useState<AplicacionLTI | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState<string>('');

    useEffect(() => {
        fetchAplicaciones();
    }, []);

    const fetchAplicaciones = async () => {
        try {
            setIsLoading(true);
            setError('');
            const data = await aplicacionLTIService.getAplicaciones();
            setAplicaciones(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido al cargar las aplicaciones');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditar = (id: number) => {
        navigate(`/aplicaciones/editar/${id}`);
    };

    const handleDeleteClick = (aplicacion: AplicacionLTI) => {
        setAplicacionToDelete(aplicacion);
        setShowDialog(true);
    };

    const handleDeleteSuccess = () => {
        setAplicaciones(aplicaciones.filter(app => app.id !== aplicacionToDelete?.id));
        setSuccess('Aplicación eliminada exitosamente');
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleDeleteError = (errorMessage: string) => {
        setError(errorMessage);
    };

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger" onClose={() => setError('')} dismissible>
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{error}</p>
                </Alert>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container className="mt-4 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                <p className="mt-2">Cargando aplicaciones...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Aplicaciones LTI</h2>
                <Button variant="primary" onClick={() => navigate('/aplicaciones/crear')}>
                    <Plus /> Nueva Aplicación
                </Button>
            </div>

            {success && (
                <Alert variant="success" onClose={() => setSuccess('')} dismissible>
                    <Alert.Heading>Éxito</Alert.Heading>
                    <p>{success}</p>
                </Alert>
            )}

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>URL</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {aplicaciones.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center">
                                No hay aplicaciones registradas
                            </td>
                        </tr>
                    ) : (
                        aplicaciones.map((aplicacion) => (
                            <tr key={aplicacion.id}>
                                <td>{aplicacion.nombre}</td>
                                <td>{aplicacion.descripcion}</td>
                                <td>{aplicacion.url}</td>
                                <td>
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditar(aplicacion.id)}
                                    >
                                        <Pencil /> Editar
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteClick(aplicacion)}
                                    >
                                        <Trash /> Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            <ConfirmarEliminar
                show={showDialog}
                aplicacion={aplicacionToDelete}
                onClose={() => {
                    setShowDialog(false);
                    setAplicacionToDelete(null);
                }}
                onSuccess={handleDeleteSuccess}
                onError={handleDeleteError}
            />
        </Container>
    );
};

export default ListaAplicaciones; 