import { type Express } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerJsonDocs from './openapi.json';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function swaggerDocs(app: Express, port: number) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsonDocs));

  console.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
