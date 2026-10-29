// Native selects remain the filtering source of truth and no-JS fallback.
// Enhance only the presentation so labels wrap and the open menu shares the site palette.
(() => {
  let opened;
  for (const select of document.querySelectorAll('.filters select')) {
    const wrapper = document.createElement('div'); wrapper.className = 'filter-select';
    select.before(wrapper); wrapper.append(select); select.classList.add('enhanced-select');
    select.tabIndex = -1; select.setAttribute('aria-hidden', 'true');
    const label = document.querySelector(`label[for="${select.id}"]`);
    label.id = `${select.id}-label`;
    const trigger = document.createElement('button'); trigger.type = 'button'; trigger.className = 'filter-trigger'; trigger.id = `${select.id}-trigger`;
    trigger.setAttribute('aria-haspopup', 'listbox'); trigger.setAttribute('aria-expanded', 'false');
    const value = document.createElement('span'); value.id = `${select.id}-value`; trigger.append(value);
    trigger.setAttribute('aria-labelledby', `${label.id} ${value.id}`); label.htmlFor = trigger.id;
    const list = document.createElement('div'); list.id = `${select.id}-options`; list.className = 'filter-options'; list.hidden = true;
    list.setAttribute('role', 'listbox'); list.setAttribute('aria-labelledby', label.id); trigger.setAttribute('aria-controls', list.id);
    wrapper.append(trigger, list);
    const options = [...select.options].map(option => {
      const button = document.createElement('button'); button.type = 'button'; button.setAttribute('role', 'option'); button.tabIndex = -1;
      button.textContent = option.textContent; button.dataset.value = option.value; list.append(button);
      button.addEventListener('click', () => {
        select.value = option.value; select.dispatchEvent(new Event('change', {bubbles:true})); close(true);
      }); return button;
    });
    function sync() {
      value.textContent = select.selectedOptions[0].textContent;
      options.forEach(option => option.setAttribute('aria-selected', String(option.dataset.value === select.value)));
    }
    function close(focus = false) {
      list.hidden = true; trigger.setAttribute('aria-expanded', 'false'); wrapper.classList.remove('is-open');
      if (opened?.wrapper === wrapper) opened = undefined;
      if (focus) trigger.focus();
    }
    function open(index = select.selectedIndex) {
      opened?.close(); list.hidden = false; trigger.setAttribute('aria-expanded', 'true'); wrapper.classList.add('is-open');
      opened = {wrapper, close}; options[index].focus();
    }
    trigger.addEventListener('click', () => list.hidden ? open() : close());
    trigger.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open(event.key === 'ArrowUp' ? options.length - 1 : select.selectedIndex); }
    });
    let typed = '', typedAt = 0;
    list.addEventListener('keydown', event => {
      const index = options.indexOf(document.activeElement); let next;
      if (event.key === 'ArrowDown') next = (index + 1) % options.length;
      else if (event.key === 'ArrowUp') next = (index + options.length - 1) % options.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = options.length - 1;
      else if (event.key === 'Escape') { event.preventDefault(); close(true); return; }
      else if (event.key === 'Tab') { close(); trigger.focus(); return; }
      else if (event.key.length === 1 && event.key !== ' ') {
        typed = Date.now() - typedAt > 700 ? event.key : typed + event.key; typedAt = Date.now();
        next = options.findIndex(option => option.textContent.toLowerCase().startsWith(typed.toLowerCase()));
        if (next < 0) return;
      } else return;
      event.preventDefault(); options[next].focus();
    });
    const phone = matchMedia('(max-width:560px)');
    const adapt = () => {
      close();
      select.tabIndex = phone.matches ? -1 : 0;
      if (phone.matches) select.setAttribute('aria-hidden', 'true');
      else select.removeAttribute('aria-hidden');
      label.htmlFor = phone.matches ? trigger.id : select.id;
    };
    adapt(); phone.addEventListener('change', adapt);
    select.addEventListener('change', sync);
    document.addEventListener('click', event => { if (!wrapper.contains(event.target)) close(); });
    wrapper.addEventListener('focusout', event => {
      if (event.relatedTarget && !wrapper.contains(event.relatedTarget)) close();
    });
    sync();
  }
})();
