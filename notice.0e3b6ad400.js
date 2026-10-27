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
  document.querySelectorAll('.cta-layer').forEach(button => {
    button.addEventListener('click', () => openNotice('事前アンケートの受付は準備中です。', '受付開始まで、しばらくお待ちください。'));
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
