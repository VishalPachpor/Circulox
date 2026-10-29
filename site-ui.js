// Shared inner-page navigation and native, progressively enhanced disclosures.
(() => {
  const header = document.querySelector('.top');
  const menu = header?.querySelector('.site-menu');
  const nav = header?.querySelector('#site-navigation');
  if (menu && nav) {
    const close = (returnFocus = false) => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
      menu.textContent = 'Menu';
      if (returnFocus) menu.focus();
    };
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close menu' : 'Menu';
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('click', event => { if (!header.contains(event.target)) close(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') close(true);
    });
    header.addEventListener('focusout', event => {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) close();
    });
    matchMedia('(max-width:800px)').addEventListener('change', () => close());
  }
  // Desktop retains the original fully visible preparation and answers.
  const compact = matchMedia('(max-width:560px)');
  const preparation = document.querySelector('.preparation-details');
  const answers = [...document.querySelectorAll('.faq-item')];
  const adapt = () => {
    if (preparation) preparation.open = !compact.matches;
    for (const item of answers) {
      item.open = !compact.matches;
      const summary = item.querySelector('summary');
      summary.tabIndex = compact.matches ? 0 : -1;
      if (compact.matches) { summary.removeAttribute('role'); summary.removeAttribute('aria-level'); }
      else { summary.setAttribute('role', 'heading'); summary.setAttribute('aria-level', '3'); }
    }
  };
  for (const item of answers) item.addEventListener('keydown', event => {
    if (!compact.matches && (event.key === 'Enter' || event.key === ' ')) event.preventDefault();
  });
  adapt(); compact.addEventListener('change', adapt);
})();
