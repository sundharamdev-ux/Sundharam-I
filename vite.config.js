import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyStaticDirs() {
  return {
    name: 'copy-static-dirs',
    closeBundle() {
      const dirsToCopy = ['config', 'assets', 'scripts'];
      dirsToCopy.forEach((dir) => {
        const srcDir = path.resolve(__dirname, dir);
        const destDir = path.resolve(__dirname, 'dist', dir);
        if (fs.existsSync(srcDir)) {
          fs.cpSync(srcDir, destDir, { recursive: true });
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [copyStaticDirs()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
