
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: Iniciando aplicação');
console.log('main.tsx: React DOM disponível:', typeof createRoot);

const rootElement = document.getElementById("root");
console.log('main.tsx: Elemento root encontrado:', rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  console.log('main.tsx: Root React criado, renderizando App');
  root.render(<App />);
} else {
  console.error('main.tsx: Elemento root não encontrado!');
}
