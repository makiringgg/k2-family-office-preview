(() => {
  'use strict';
  const dialog = document.getElementById('cta-dialog');
  const title = document.getElementById('dialog-title');
  const description = document.getElementById('dialog-description');
  function openNotice(heading, message) {
    title.textContent = heading;
    description.textContent = message;
    if (!dialog.open) dialog.showModal();
  }
  let pendingTap = false;
  document.querySelectorAll('.cta-layer').forEach(button => {
    button.addEventListener('click', event => {
      const show = () => openNotice('事前アンケートの受付は準備中です。', '受付開始まで、しばらくお待ちください。');
      if (!button.closest('.sp-layout') || event.detail === 0) {
        show();
        return;
      }
      if (pendingTap) return;
      pendingTap = true;
      button.classList.add('is-tap-feedback');
      // Let the selected color register before opening the notice.
      window.setTimeout(() => {
        show();
        pendingTap = false;
      }, 350);
      window.setTimeout(() => button.classList.remove('is-tap-feedback'), 650);
    });
  });
  document.querySelectorAll('[data-footer]').forEach(button => {
    button.addEventListener('click', () => openNotice(`${button.textContent.trim()}のページは準備中です。`, '公開まで、しばらくお待ちください。'));
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
})();
