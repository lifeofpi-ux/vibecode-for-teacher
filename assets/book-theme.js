/**
 * 《요즘 교사를 위한 웹앱 만들기 with 바이브 코딩》 
 * 부록 & 웹 서적 인터랙션 스크립트 (Professional Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initCopyButtons();
  initToastNotification();
});

// 1. Reading Progress Bar
function initReadingProgressBar() {
  const progressBar = document.getElementById('reading-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  });
}

// 2. Clipboard Copy Functionality
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const codeWrapper = btn.closest('.code-wrapper');
      if (!codeWrapper) return;

      const codeContent = codeWrapper.querySelector('.code-content');
      if (!codeContent) return;

      const textToCopy = codeContent.innerText || codeContent.textContent;

      try {
        await navigator.clipboard.writeText(textToCopy.trim());
        
        // Button State
        const originalHtml = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          복사 완료
        `;

        showToast('프롬프트가 클립보드에 복사되었습니다.');

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = originalHtml;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
        showToast('복사에 실패했습니다. 직접 선택하여 복사하세요.', true);
      }
    });
  });
}

// 3. Toast Notification
function initToastNotification() {
  if (document.getElementById('book-toast')) return;

  const toast = document.createElement('div');
  toast.id = 'book-toast';
  toast.className = 'book-toast';
  toast.innerHTML = `
    <span class="book-toast-icon">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </span>
    <span id="book-toast-message">프롬프트가 클립보드에 복사되었습니다.</span>
  `;
  document.body.appendChild(toast);
}

function showToast(message, isError = false) {
  const toast = document.getElementById('book-toast');
  const toastMsg = document.getElementById('book-toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  if (window.toastTimeout) {
    clearTimeout(window.toastTimeout);
  }

  window.toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}
