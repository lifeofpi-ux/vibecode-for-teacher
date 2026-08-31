/**
 * 《요즘 교사를 위한 웹앱 만들기 with 바이브 코딩》 
 * 부록 & 웹 서적 인터랙션 스크립트 (Mobile Optimized Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  initReadingProgressBar();
  initCopyButtons();
  initToastNotification();
  initMobileTocDrawer();
  initFloatingControls();
  initMobileQuickChips();
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
  }, { passive: true });
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

// 4. Mobile TOC Drawer
function initMobileTocDrawer() {
  const drawer = document.getElementById('mobile-toc-drawer');
  const backdrop = document.getElementById('mobile-toc-backdrop');
  const openBtns = document.querySelectorAll('.open-toc-btn');
  const closeBtn = document.getElementById('mobile-toc-close-btn');

  if (!drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // 드로어 내부 링크 클릭 시 자동 닫힘
  const drawerLinks = drawer.querySelectorAll('a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

// 5. Floating Controls (FAB)
function initFloatingControls() {
  const topBtn = document.getElementById('fab-top-btn');
  const tocBtn = document.getElementById('fab-toc-btn');

  if (topBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        topBtn.classList.add('visible');
      } else {
        topBtn.classList.remove('visible');
      }
    }, { passive: true });

    topBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  if (tocBtn) {
    tocBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const drawer = document.getElementById('mobile-toc-drawer');
      const backdrop = document.getElementById('mobile-toc-backdrop');
      if (drawer && backdrop) {
        drawer.classList.add('open');
        backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  }
}

// 6. Mobile Quick Chips & Scroll Sync
function initMobileQuickChips() {
  const quickChips = document.querySelectorAll('.mobile-quick-nav .quick-chip[data-target]');
  const quickNav = document.querySelector('.mobile-quick-nav');
  if (!quickChips.length || !quickNav) return;

  const sections = Array.from(quickChips).map(chip => {
    const targetId = chip.getAttribute('data-target');
    const el = document.getElementById(targetId);
    return { chip, el, id: targetId };
  }).filter(item => item.el !== null);

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120;

    for (let i = sections.length - 1; i >= 0; i--) {
      const { el, id } = sections[i];
      if (el.offsetTop <= scrollPos) {
        currentId = id;
        break;
      }
    }

    if (!currentId && sections.length > 0) {
      currentId = sections[0].id;
    }

    sections.forEach(({ chip, id }) => {
      if (id === currentId) {
        chip.classList.add('active');
        // 가로 스크롤 중앙 정렬
        const chipLeft = chip.offsetLeft;
        const chipWidth = chip.offsetWidth;
        const navWidth = quickNav.offsetWidth;
        quickNav.scrollTo({
          left: chipLeft - (navWidth / 2) + (chipWidth / 2),
          behavior: 'smooth'
        });
      } else {
        chip.classList.remove('active');
      }
    });
  }, { passive: true });
}
