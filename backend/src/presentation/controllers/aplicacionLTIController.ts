import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAplicaciones = async (req: Request, res: Response) => {
    try {
        const aplicaciones = await prisma.aplicacionLTI.findMany();
        res.status(200).json(aplicaciones);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al obtener las aplicaciones', error: error.message });
        } else {
            res.status(500).json({ message: 'Error al obtener las aplicaciones', error: String(error) });
        }
    }
};

export const createAplicacion = async (req: Request, res: Response) => {
    try {
        const { nombre, descripcion, url } = req.body;
        
        if (!nombre || !descripcion || !url) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const aplicacion = await prisma.aplicacionLTI.create({
            data: {
                nombre,
                descripcion,
                url
            }
        });

        res.status(201).json(aplicacion);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al crear la aplicación', error: error.message });
        } else {
            res.status(500).json({ message: 'Error al crear la aplicación', error: String(error) });
        }
    }
};

export const updateAplicacion = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, descripcion, url } = req.body;

        if (!nombre || !descripcion || !url) {
            return res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const aplicacion = await prisma.aplicacionLTI.update({
            where: { id },
            data: {
                nombre,
                descripcion,
                url
            }
        });

        res.status(200).json(aplicacion);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al actualizar la aplicación', error: error.message });
        } else {
            res.status(500).json({ message: 'Error al actualizar la aplicación', error: String(error) });
        }
    }
};

export const deleteAplicacion = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.aplicacionLTI.delete({
            where: { id }
        });
        res.status(200).json({ message: 'Aplicación eliminada correctamente' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: 'Error al eliminar la aplicación', error: error.message });
        } else {
            res.status(500).json({ message: 'Error al eliminar la aplicación', error: String(error) });
        }
    }
}; 