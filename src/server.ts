import app from './app';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running fine! http://localhost:${PORT}/`);
});
