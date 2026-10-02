import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import projectRoutes from './projectRoutes.js';

const apiRouter = Router();

// Mount sub-routers
apiRouter.use('/health', healthRoutes);
apiRouter.use('/projects', projectRoutes);

export default apiRouter;
