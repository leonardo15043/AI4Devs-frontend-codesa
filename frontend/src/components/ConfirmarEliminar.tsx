import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import { aplicacionLTIService } from '../services/aplicacionLTIService';
import { AplicacionLTI } from '../types/aplicacionLTI';

interface ConfirmarEliminarProps {
    show: boolean;
    aplicacion: AplicacionLTI | null;
    onClose: () => void;
    onSuccess: () => void;
    onError: (error: string) => void;
}

const ConfirmarEliminar: React.FC<ConfirmarEliminarProps> = ({
    show,
    aplicacion,
    onClose,
    onSuccess,
    onError
}) => {
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [error, setError] = React.useState<string>('');

    const handleConfirm = async () => {
        if (!aplicacion) return;

        try {
            setIsDeleting(true);
            setError('');
            await aplicacionLTIService.deleteAplicacion(aplicacion.id);
            onSuccess();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la aplicación';
            setError(errorMessage);
            onError(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClose = () => {
        setError('');
        onClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && (
                    <Alert variant="danger" onClose={() => setError('')} dismissible>
                        <Alert.Heading>Error</Alert.Heading>
                        <p>{error}</p>
                    </Alert>
                )}

                <p>
                    ¿Está seguro de que desea eliminar la aplicación "{aplicacion?.nombre}"?
                    Esta acción no se puede deshacer.
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={isDeleting}
                >
                    Cancelar
                </Button>
                <Button
                    variant="danger"
                    onClick={handleConfirm}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ConfirmarEliminar; 