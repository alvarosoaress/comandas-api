import app from './app';
import swaggerDocs from './utils/swagger';

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is running fine! http://localhost:${PORT}/`);

  swaggerDocs(app, PORT);
});
