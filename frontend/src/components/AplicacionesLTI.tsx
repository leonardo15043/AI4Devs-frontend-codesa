import React, { useEffect, useState } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { Pencil, Trash, Plus } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import { aplicacionLTIService } from '../services/aplicacionLTIService';
import { AplicacionLTI } from '../types/aplicacionLTI';

const AplicacionesLTI: React.FC = () => {
    const navigate = useNavigate();
    const [aplicaciones, setAplicaciones] = useState<AplicacionLTI[]>([]);
    const [error, setError] = useState<string>('');
    const [showDialog, setShowDialog] = useState(false);
    const [aplicacionToDelete, setAplicacionToDelete] = useState<AplicacionLTI | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAplicaciones();
    }, []);

    const fetchAplicaciones = async () => {
        try {
            setIsLoading(true);
            const data = await aplicacionLTIService.getAplicaciones();
            setAplicaciones(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
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

    const handleDeleteConfirm = async () => {
        if (!aplicacionToDelete) return;

        try {
            await aplicacionLTIService.deleteAplicacion(aplicacionToDelete.id);
            setAplicaciones(aplicaciones.filter(app => app.id !== aplicacionToDelete.id));
            setShowDialog(false);
            setAplicacionToDelete(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al eliminar la aplicación');
        }
    };

    const handleDeleteCancel = () => {
        setShowDialog(false);
        setAplicacionToDelete(null);
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (isLoading) {
        return <div className="text-center mt-4">Cargando aplicaciones...</div>;
    }

    return (
        <Container className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Aplicaciones LTI</h2>
                <Button variant="primary" onClick={() => navigate('/aplicaciones/crear')}>
                    <Plus /> Nueva Aplicación
                </Button>
            </div>
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
                    {aplicaciones.map((aplicacion) => (
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
                    ))}
                </tbody>
            </Table>

            <ConfirmDialog
                show={showDialog}
                title="Confirmar Eliminación"
                message={`¿Está seguro de que desea eliminar la aplicación "${aplicacionToDelete?.nombre}"? Esta acción no se puede deshacer.`}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
        </Container>
    );
};

export default AplicacionesLTI; 