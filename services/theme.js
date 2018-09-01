import darcula from '../styles/themes/darcula';
import bright from '../styles/themes/bright';

const themesStyles = {
  darcula,
  bright,
};

export const themes = Object.keys(themesStyles);

export const applyTheme = (newTheme) => {
  const prevDocument = document.head.querySelector('.theme');

  if (prevDocument) {
    document.documentElement.classList.add('theme');
    document.documentElement.addEventListener('transitionend', () => {
      document.documentElement.classList.remove('theme');
    }, { once: true });
  }

  const documentContainer = document.createElement('style');
  documentContainer.classList.add('theme');

  documentContainer.innerHTML = themesStyles[newTheme];
  document.head.appendChild(documentContainer);

  if (prevDocument) {
    document.head.removeChild(prevDocument);
  }
};
