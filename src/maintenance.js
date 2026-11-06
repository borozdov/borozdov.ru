import './maintenance.css';

const button = document.getElementById('theme-toggle');
const updateLabel = () => {
  button.textContent = document.documentElement.dataset.theme === 'titan' ? 'Тёмная тема' : 'Светлая тема';
};
button.hidden = false;
updateLabel();
button.addEventListener('click', () => {
  const theme = document.documentElement.dataset.theme === 'titan' ? 'obsidian' : 'titan';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('lik', theme); } catch {}
  updateLabel();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(console.error);
}
