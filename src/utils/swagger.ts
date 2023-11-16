import { type Express } from 'express';

import swaggerUi from 'swagger-ui-express';
import swaggerJsonDocs from './openapi.json';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function swaggerDocs(app: Express, port: number) {
  const CSS_URL =
    'https://raw.githubusercontent.com/ostranme/swagger-ui-themes/develop/themes/3.x/theme-flattop.css';

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsonDocs, {
      customCssUrl: `/docs/css`,
      customSiteTitle: 'ComandasApi Docs',
      customJs: `/docs/swaggerjs`,
      customfavIcon: `/docs/favicon`,
    }),
  );

  console.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;
