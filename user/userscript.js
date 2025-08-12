document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL =
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'https://dressupme-backend.vercel.app';
  const token = localStorage.getItem('authToken');

  let wardrobe = { top: [], bottom: [], shoes: [] };
  let carouselState = {
    top: { id: null, index: -1 },
    bottom: { id: null, index: -1 },
    shoes: { id: null, index: -1 }
  };

  document.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      const direction = parseInt(btn.dataset.direction);
      handleCarouselNav(category, direction);
    });
  });  

  const wardrobeTbody = Array.from(document.querySelectorAll('#mixmatch .table-responsive')).find(div =>
    div.querySelector('h4')?.textContent.includes('Lemari')
  )?.querySelector('tbody');
  const favoriteContainer = document.querySelector('#wardrobe .table-responsive:last-child tbody');

  // ---------------------- OTENTIKASI ----------------------
  function pageGuard() {
    if (!token) {
      alert('Anda harus masuk terlebih dahulu untuk mengakses halaman ini.');
      window.location.href = '../index.html';
      return false;
    }
    return true;
  }

  async function fetchAndDisplayProfile() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Sesi tidak valid.');
      const user = await response.json();
      document.querySelector('.profile-name').textContent = user.username;
      document.querySelector('.profile-email').textContent = user.email;
    } catch (error) {
      alert(error.message);
      handleLogout();
    }
  }

  function handleLogout() {
    localStorage.removeItem('authToken');
    alert('Anda telah keluar dari akun.');
    window.location.href = '../index.html';
  }

  function toggleProfile() {
    document.getElementById("profilePanel").classList.toggle("active");
  }

  // ------------------ ITEM LEMARI ------------------
  async function fetchAndDisplayWardrobe() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal mengambil data lemari.');
      const items = await response.json();

      // Reset dan kelompokkan wardrobe
      wardrobe = { top: [], bottom: [], shoes: [] };
      items.forEach(item => {
        if (wardrobe[item.category]) wardrobe[item.category].push(item);
      });

      renderWardrobeTable();
      initializeCarousels();
      fetchAndDisplayFavorites();
    } catch (error) {
      alert(error.message);
    }
  }

  function renderWardrobeTable() {
    if (!wardrobeTbody) return;
    wardrobeTbody.innerHTML = '';
    const maxRows = Math.max(wardrobe.top.length, wardrobe.bottom.length, wardrobe.shoes.length);
    if (maxRows === 0) {
      wardrobeTbody.innerHTML = '<tr><td colspan="3">Lemari Anda masih kosong.</td></tr>';
      return;
    }

    for (let i = 0; i < maxRows; i++) {
      const tr = document.createElement('tr');
      ['top', 'bottom', 'shoes'].forEach(category => {
        const td = document.createElement('td');
        const item = wardrobe[category][i];
        if (item) {
          td.innerHTML = `
            <div class="position-relative">
              <img src="${item.image_url}" alt="${item.category}" width="80" class="img-fluid">
              <i class="fas fa-trash-alt trash-icon" data-item-id="${item.id}" style="cursor:pointer; position:absolute; bottom:5px; right:5px; color:red;"></i>
            </div>
          `;
        }
        tr.appendChild(td);
      });
      wardrobeTbody.appendChild(tr);
    }
  }

  async function handleDeleteItem(itemId) {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;
    const trashIcon = document.querySelector(`[data-item-id="${itemId}"]`);
    trashIcon?.classList.add('fa-spinner', 'fa-spin');

    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${itemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal menghapus item.');
      alert('Item berhasil dihapus.');
      fetchAndDisplayWardrobe();
    } catch (error) {
      alert(`Gagal menghapus item: ${error.message}`);
    } finally {
      trashIcon?.classList.remove('fa-spinner', 'fa-spin');
      trashIcon?.classList.add('fa-trash-alt');
    }
  }

  // ------------------ CAROUSEL ------------------
  function initializeCarousels() {
    ['top', 'bottom', 'shoes'].forEach(category => {
      if (wardrobe[category].length > 0) {
        carouselState[category].index = 0;
        updateCarouselSlot(category);
      } else {
        const section = [...document.querySelectorAll('#mixmatch .item-section')].find(s =>
          s.querySelector('h5')?.textContent.toLowerCase() === category
        );
        const slot = section?.querySelector('.slot');
        const input = document.getElementById(`${category}-input`);
        if (slot && input) {
          slot.innerHTML = `<label for="${input.id}" style="color: var(--text); cursor:pointer;">Klik atau Seret Gambar ke Sini</label>`;
        }
      }
    });
  }

  function updateCarouselSlot(category) {
    const items = wardrobe[category];
    if (!items || !items.length) return;
  
    const index = carouselState[category].index;
    const item = items[index];
    carouselState[category].id = item.id;
  
    const section = [...document.querySelectorAll('#mixmatch .item-section')]
      .find(s => s.dataset.category === category);
    const slot = section?.querySelector('.slot');
  
    if (slot) {
      slot.innerHTML = `<img src="${item.image_url}" alt="${category}" style="width:100%; height:100%; object-fit:contain;">`;
      slot.dataset.itemId = item.id;
    }
  }
   

  function handleCarouselNav(category, direction) {
    const items = wardrobe[category];
    if (!Array.isArray(items) || items.length <= 1) return;

    let newIndex = carouselState[category].index + direction;
    if (newIndex >= items.length) newIndex = 0;
    if (newIndex < 0) newIndex = items.length - 1;
    carouselState[category].index = newIndex;
    updateCarouselSlot(category);
  }

  async function uploadItem(file, category) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);

    const slot = document.getElementById(`${category}-input`)?.closest('.item-section')?.querySelector('.slot');
    document.getElementById('upload-spinner-overlay').style.display = 'flex';

    if (slot) {
      slot.innerHTML = `<div class="spinner-border text-dark" role="status"><span class="visually-hidden">Memuat...</span></div>`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) throw new Error('Unggahan gagal.');
      alert(`${category} berhasil ditambahkan!`);
      fetchAndDisplayWardrobe();
    } catch (error) {
      alert(`Unggahan gagal: ${error.message}`);
    } finally {
      document.getElementById('upload-spinner-overlay').style.display = 'none';
    }
  }

  // ------------------ OUTFIT FAVORIT ------------------
  async function fetchAndDisplayFavorites(filters = {}) {
    if (!favoriteContainer) return;
    const queryParams = new URLSearchParams(filters).toString();
    try {
      const response = await fetch(`${API_BASE_URL}/api/outfits?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal mengambil data outfit favorit.');
      const outfits = await response.json();
      renderFavoritesGrid(outfits);
    } catch (error) {
      alert(error.message);
    }
  }

  function renderFavoritesGrid(outfits) {
    if (!favoriteContainer) return;
    favoriteContainer.innerHTML = '';

    if (!outfits.length) {
      favoriteContainer.innerHTML = '<tr><td colspan="4">Belum ada outfit yang disimpan.</td></tr>';
      return;
    }

    let tr;
    outfits.forEach((outfit, index) => {
      if (index % 3 === 0) {
        tr = document.createElement('tr');
        favoriteContainer.appendChild(tr);
      }

      const td = document.createElement('td');
      td.innerHTML = `
        <div class="outfit-card position-relative p-2">
          <div class="image-frame"><img src="${outfit.top_image_url}" alt="Atasan"></div>
          <div class="image-frame"><img src="${outfit.bottom_image_url}" alt="Bawahan"></div>
          <div class="image-frame"><img src="${outfit.shoes_image_url}" alt="Sepatu"></div>
          <div class="outfit-info mt-2 text-start w-100">
            ${outfit.tema ? `<span class="badge bg-primary">${outfit.tema}</span>` : ''}
            ${outfit.color ? `<span class="badge bg-secondary">${outfit.color}</span>` : ''}
          </div>
          <i class="fas fa-trash-alt trash-icon" data-outfit-id="${outfit.id}" style="cursor:pointer; position:absolute; bottom:5px; right:5px; color:red;"></i>
        </div>`;
      tr.appendChild(td);
    });
  }

  function handleSaveOutfitClick() {
    if (!carouselState.top.id || !carouselState.bottom.id || !carouselState.shoes.id) {
      alert('Silakan pilih Atasan, Bawahan, dan Sepatu terlebih dahulu.');
      return;
    }
    new bootstrap.Modal(document.getElementById('saveOutfitModal')).show();
  }

  async function handleConfirmSaveOutfit() {
    const data = {
      top_item_id: carouselState.top.id,
      bottom_item_id: carouselState.bottom.id,
      shoes_item_id: carouselState.shoes.id,
      tema: document.getElementById('outfit-tema').value || null,
      color: document.getElementById('outfit-color').value || null
    };
    try {
      const response = await fetch(`${API_BASE_URL}/api/outfits`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Gagal menyimpan outfit.');
      alert('Outfit berhasil disimpan!');
      bootstrap.Modal.getInstance(document.getElementById('saveOutfitModal')).hide();
      document.getElementById('save-outfit-form').reset();
      fetchAndDisplayFavorites();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDeleteOutfit(outfitId) {
    if (!confirm('Apakah Anda yakin ingin menghapus outfit ini?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/outfits/${outfitId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Gagal menghapus outfit.');
      alert('Outfit berhasil dihapus.');
      fetchAndDisplayFavorites();
    } catch (error) {
      alert(error.message);
    }
  }

  function handleFilterClick(event) {
    const button = event.target;
    const parent = button.closest('.situation-filters, .color-filters');
    if (!parent) return;

    const isActive = button.classList.contains('active');
    parent.querySelectorAll('.btn').forEach(btn => btn.classList.remove('active'));

    let filter = {};
    if (!isActive) {
      button.classList.add('active');
      const filterValue = button.textContent;
      if (parent.classList.contains('situation-filters')) {
        filter = { tema: filterValue };
      } else if (parent.classList.contains('color-filters')) {
        filter = { color: filterValue };
      }
    }

    fetchAndDisplayFavorites(filter);
  }

  // ------------------ INISIALISASI ------------------
  if (!pageGuard()) return;
  fetchAndDisplayProfile();
  fetchAndDisplayWardrobe();

  document.querySelector('.logout-button')?.addEventListener('click', handleLogout);
  document.getElementById('profile-link')?.addEventListener('click', e => { e.preventDefault(); toggleProfile(); });
  document.querySelector('#profilePanel .close-btn')?.addEventListener('click', toggleProfile);
  document.getElementById('save-button')?.addEventListener('click', handleSaveOutfitClick);
  document.getElementById('confirm-save-outfit')?.addEventListener('click', handleConfirmSaveOutfit);

  wardrobeTbody?.addEventListener('click', e => {
    if (e.target.matches('.trash-icon')) {
      handleDeleteItem(e.target.dataset.itemId);
    }
  });

  favoriteContainer?.addEventListener('click', e => {
    if (e.target.matches('.trash-icon')) {
      handleDeleteOutfit(e.target.dataset.outfitId);
    }
  });

  document.querySelectorAll('.arrow-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const section = this.closest('.item-section');
      const category = section.querySelector('h5').textContent.toLowerCase();
      const direction = this.textContent.includes('→') ? 1 : -1;
      handleCarouselNav(category, direction);
    });
  });

  ['top', 'bottom', 'shoes'].forEach(category => {
    const input = document.getElementById(`${category}-input`);
    const slot = input?.closest('.item-section')?.querySelector('.slot');
    slot?.addEventListener('click', () => input.click());
    input?.addEventListener('change', () => {
      if (input.files.length > 0) uploadItem(input.files[0], category);
    });
  });

  document.querySelectorAll('.situation-filters .btn, .color-filters .btn')
    .forEach(btn => btn.addEventListener('click', handleFilterClick));

  const fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
  document.head.appendChild(fontAwesome);
});
