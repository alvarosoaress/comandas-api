import { type Express } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerJsonDocs from './openapi.json';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function swaggerDocs(app: Express, port: number) {
  const CSS_URL =
    'https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.3.0/swagger-ui.css';

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsonDocs, {
      customCssUrl: CSS_URL,
      customSiteTitle: 'ComandasApi Docs',
      customJs: `https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.3.0/swagger-ui-bundle.js`,
      customfavIcon: `/docs/favicon`,
    }),
  );

  console.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
