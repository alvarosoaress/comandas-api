import app from './app';

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is running fine! http://localhost:${PORT}/`);
});
