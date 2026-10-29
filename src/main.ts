import './style.css';

function bootstrap(): void {
  const app = document.querySelector<HTMLDivElement>('#app');
  if (!app) {
    throw new Error('Elemen #app tidak ditemukan');
  }

  const title = document.createElement('h1');
  title.textContent = 'Color Memory Game';
  app.append(title);
}

bootstrap();