export const themes = ['darcula', 'bright'];

const defaultTheme = 'darcula';
let currentTheme = null;

export const applyTheme = (newTheme) => {
  if (currentTheme === newTheme) {
    return;
  }

  if (currentTheme) {
    document.documentElement.classList.add('theme');
    document.documentElement.addEventListener('transitionend', () => {
      document.documentElement.classList.remove('theme');
    }, { once: true });

    if (currentTheme !== defaultTheme) {
      document.documentElement.classList.remove(currentTheme);
    }
  }

  if (newTheme !== defaultTheme) {
    document.documentElement.classList.add(newTheme);
  }

  currentTheme = newTheme;
};
