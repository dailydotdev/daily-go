export default function () {
  return window.CSS && window.CSS.supports && window.CSS.supports('color', 'var(--primary)');
}
