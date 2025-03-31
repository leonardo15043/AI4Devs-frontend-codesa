import express from 'express';
import { getAplicaciones, createAplicacion, updateAplicacion, deleteAplicacion } from '../presentation/controllers/aplicacionLTIController';

const router = express.Router();

router.get('/', getAplicaciones);
router.post('/', createAplicacion);
router.put('/:id', updateAplicacion);
router.delete('/:id', deleteAplicacion);

export default router; 