import { type Express } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerJsonDocs from './openapi.json';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function swaggerDocs(app: Express, port: number) {
  const CSS_URL =
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsonDocs, {
      customCssUrl: CSS_URL,
      customSiteTitle: 'ComandasApi Docs',
      customJs: `/docs/swaggerjs`,
      customfavIcon: `/docs/favicon`,
    }),
  );

  console.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
