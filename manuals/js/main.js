/**
 * GEMS (The New Energy Grid) Documentation Site Core JavaScript
 * Handles themes, mobile drawer, search modal, tabs, code copying, and scrollspy.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initSearch();
  initTabs();
  initCodeCopy();
  initScrollspy();
});

/* --- Theme Management --- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('nems-docs-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('nems-docs-theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  // Listen for OS system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('nems-docs-theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      updateThemeIcon(newTheme);
    }
  });
}

function updateThemeIcon(theme) {
  const iconUse = document.querySelector('#theme-toggle-btn use');
  if (iconUse) {
    iconUse.setAttribute('href', theme === 'dark' ? 'assets/icons.svg#icon-sun' : 'assets/icons.svg#icon-moon');
  }
}

/* --- Mobile Sidebar Navigation Drawer --- */
function initMobileNav() {
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('.docs-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (!mobileBtn || !sidebar || !backdrop) return;

  function toggleSidebar(open) {
    if (open) {
      sidebar.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    } else {
      sidebar.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  mobileBtn.addEventListener('click', () => {
    const isOpen = sidebar.classList.contains('open');
    toggleSidebar(!isOpen);
  });

  backdrop.addEventListener('click', () => {
    toggleSidebar(false);
  });

  // Close sidebar on link click in mobile view
  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 860) {
        toggleSidebar(false);
      }
    });
  });
}

/* --- Search Modal Engine (Ctrl+K) --- */
function initSearch() {
  const searchTriggers = document.querySelectorAll('.search-trigger-btn, .search-shortcut-trigger');
  const modalBackdrop = document.getElementById('search-modal-backdrop');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const closeBtn = document.getElementById('search-close-btn');

  if (!modalBackdrop || !searchInput || !searchResults) return;

  function openSearch() {
    modalBackdrop.classList.add('open');
    searchInput.value = '';
    renderSearchResults('');
    setTimeout(() => searchInput.focus(), 50);
    document.body.style.overflow = 'hidden';
  }

  function closeSearch() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  searchTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearch);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeSearch();
    }
  });

  // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, /)
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modalBackdrop.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    } else if (e.key === '/' && !isInputElement(document.activeElement) && !modalBackdrop.classList.contains('open')) {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeSearch();
    }
  });

  // Search input handler
  searchInput.addEventListener('input', (e) => {
    renderSearchResults(e.target.value.trim());
  });

  // Keyboard navigation within search results
  let selectedIndex = -1;
  searchInput.addEventListener('keydown', (e) => {
    const items = searchResults.querySelectorAll('.search-result-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % items.length;
      updateSelectedResult(items, selectedIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + items.length) % items.length;
      updateSelectedResult(items, selectedIndex);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].click();
      } else if (items[0]) {
        items[0].click();
      }
    }
  });

  function updateSelectedResult(items, index) {
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  function renderSearchResults(query) {
    selectedIndex = -1;
    if (!window.DOCS_SEARCH_INDEX) {
      searchResults.innerHTML = '<li class="search-result-item" style="cursor:default; color:var(--text-muted);">Search index loading...</li>';
      return;
    }

    if (!query) {
      // Show default top suggestions
      const topItems = window.DOCS_SEARCH_INDEX.slice(0, 6);
      searchResults.innerHTML = topItems.map(item => createResultHtml(item)).join('');
      attachResultClickEvents();
      return;
    }

    const q = query.toLowerCase();
    const matches = window.DOCS_SEARCH_INDEX.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSnippet = item.snippet.toLowerCase().includes(q);
      const matchKeywords = item.keywords.some(k => k.toLowerCase().includes(q));
      return matchTitle || matchSnippet || matchKeywords;
    });

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <li class="search-result-item" style="cursor:default; text-align:center; padding: 2rem 1rem; color:var(--text-muted);">
          No documentation matches found for "<strong>${escapeHtml(query)}</strong>"
        </li>
      `;
    } else {
      searchResults.innerHTML = matches.map(item => createResultHtml(item, q)).join('');
      attachResultClickEvents();
    }
  }

  function createResultHtml(item, highlightQuery = '') {
    let titleHtml = escapeHtml(item.title);
    let snippetHtml = escapeHtml(item.snippet);

    if (highlightQuery) {
      const regex = new RegExp(`(${escapeRegex(highlightQuery)})`, 'gi');
      titleHtml = titleHtml.replace(regex, '<mark style="background:var(--brand-glow); color:var(--brand-primary); padding:0 2px; border-radius:2px;">$1</mark>');
      snippetHtml = snippetHtml.replace(regex, '<mark style="background:var(--brand-glow); color:var(--brand-primary); padding:0 2px; border-radius:2px;">$1</mark>');
    }

    return `
      <li class="search-result-item" data-url="${item.url}">
        <div class="search-result-title">
          <svg width="16" height="16" style="flex-shrink:0; color:var(--brand-primary);"><use href="assets/icons.svg#icon-book"></use></svg>
          <span>${titleHtml}</span>
          <span class="search-result-category" style="margin-left:auto;">${escapeHtml(item.category)}</span>
        </div>
        <div class="search-result-snippet">${snippetHtml}</div>
      </li>
    `;
  }

  function attachResultClickEvents() {
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
      const url = item.getAttribute('data-url');
      if (url) {
        item.addEventListener('click', () => {
          window.location.href = url;
          closeSearch();
        });
      }
    });
  }
}

function isInputElement(el) {
  return el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* --- Interactive Tabs --- */
function initTabs() {
  document.querySelectorAll('.tab-container').forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabPanes = container.querySelectorAll('.tab-pane');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = container.querySelector(`#${targetId}`);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  });
}

/* --- Code Snippet Copy Buttons --- */
function initCodeCopy() {
  document.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
    const pre = wrapper.querySelector('pre');
    const code = wrapper.querySelector('code');
    const copyBtn = wrapper.querySelector('.copy-code-btn');

    if (!copyBtn || (!pre && !code)) return;

    copyBtn.addEventListener('click', async () => {
      const textToCopy = (code || pre).innerText;
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <svg width="14" height="14"><use href="assets/icons.svg#icon-check"></use></svg>
          <span>Copied!</span>
        `;
        copyBtn.style.color = 'var(--alert-tip-border)';
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code snippet:', err);
      }
    });
  });
}

/* --- Scrollspy for On-This-Page Table of Contents --- */
function initScrollspy() {
  const tocLinks = document.querySelectorAll('.docs-toc .toc-link');
  if (!tocLinks.length) return;

  const headings = Array.from(document.querySelectorAll('.docs-content h2[id], .docs-content h3[id]'));
  if (!headings.length) return;

  function updateActiveLink() {
    const scrollY = window.scrollY || window.pageYOffset;
    const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 64;
    const offset = headerHeight + 50;

    let currentHeading = null;
    for (let i = 0; i < headings.length; i++) {
      const top = headings[i].offsetTop;
      if (top <= scrollY + offset) {
        currentHeading = headings[i];
      } else {
        break;
      }
    }

    tocLinks.forEach(link => {
      link.classList.remove('active');
      if (currentHeading && link.getAttribute('href') === `#${currentHeading.id}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}
