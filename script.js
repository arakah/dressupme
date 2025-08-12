const modal = document.getElementById("signup-modal");
const openSignup = document.getElementById("open-signup"); // Navbar Sign Up
const closeSignup = document.getElementById("close-signup");
const saveBtn = document.getElementById("saveBtn");

const signupForm = document.getElementById("signup-form");
const signinForm = document.getElementById("signin-form");

const switchToSignIn = document.getElementById("switch-to-signin");
const switchToSignUp = document.getElementById("switch-to-signup");

const togglePasswordSignup = signupForm.querySelector("#toggle-password");
const passwordFieldSignup = signupForm.querySelector("#password");

const togglePasswordSignin = signinForm.querySelector("#toggle-password");
const passwordFieldSignin = signinForm.querySelector("input[name='password']");

// =================================================================
// PENGATURAN API
// =================================================================
const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : 'https://dressupme-backend.vercel.app';

// =================================================================
// FUNGSI OTENTIKASI
// =================================================================

/**
 * Menangani proses pendaftaran (Sign Up)
 * @param {Event} event
 */
async function handleSignup(event) {
  event.preventDefault(); // Mencegah form reload halaman

  const formData = new FormData(signupForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Signup failed');
    }

    // Beri tahu user untuk sign in setelah registrasi berhasil
    alert('Registration successful! Please sign in to continue.');
    switchToSignIn.click(); // Otomatis pindah ke form sign-in

  } catch (error) {
    console.error('Signup Error:', error);
    alert(`Error: ${error.message}`);
  }
}

/**
 * Menangani proses masuk (Sign In)
 * @param {Event} event
 */
async function handleSignin(event) {
  event.preventDefault(); // Mencegah form reload halaman

  const formData = new FormData(signinForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Invalid credentials');
    }

    // Simpan token ke localStorage untuk digunakan di halaman selanjutnya
    localStorage.setItem('authToken', result.token);

    // Langsung arahkan ke halaman user setelah login berhasil
    window.location.href = 'user/user.html';

  } catch (error) {
    console.error('Signin Error:', error);
    alert(`Error: ${error.message}`);
  }
}

// =================================================================
// EVENT LISTENERS
// =================================================================

// Fungsi untuk membuka modal
function openModal() {
  window.scrollTo(0, 0);
  modal.classList.add("show");
  signupForm.style.display = "block";
  signinForm.style.display = "none";
}

// Tombol Sign Up di Navbar
if (openSignup) {
  openSignup.addEventListener("click", function (e) {
    e.preventDefault();
    openModal();
  });
}

// Tombol Save Outfit akan membuka modal jika belum login
saveBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // Karena user pasti belum login di halaman ini, langsung buka modal
  alert('You must log in or sign up to save an outfit.');
  openModal();
});

// Menutup modal
closeSignup.addEventListener("click", () => modal.classList.remove("show"));
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("show");
  }
});

// Beralih antara form Sign Up dan Sign In
switchToSignIn.addEventListener("click", (e) => {
  e.preventDefault();
  signupForm.style.display = "none";
  signinForm.style.display = "block";
});

switchToSignUp.addEventListener("click", (e) => {
  e.preventDefault();
  signinForm.style.display = "none";
  signupForm.style.display = "block";
});

// Toggle password visibility
togglePasswordSignup.addEventListener("click", function () {
  const type = passwordFieldSignup.type === "password" ? "text" : "password";
  passwordFieldSignup.type = type;
  this.textContent = type === "password" ? "👁️" : "🙈";
});

togglePasswordSignin.addEventListener("click", function () {
  const type = passwordFieldSignin.type === "password" ? "text" : "password";
  passwordFieldSignin.type = type;
  this.textContent = type === "password" ? "👁️" : "🙈";
});

// Menerapkan fungsi handle ke form
signupForm.addEventListener('submit', handleSignup);
signinForm.addEventListener('submit', handleSignin);


// Logika untuk Demo Styling (tidak berubah)
const items = document.querySelectorAll('.item');
items.forEach(item => {
  item.addEventListener('click', () => {
    const category = item.dataset.category;
    const slot = document.getElementById(`${category}-slot`);
    if (slot) {
      const clone = item.cloneNode();
      clone.style.maxWidth = '100%';
      clone.style.maxHeight = '100%';
      clone.style.objectFit = 'contain';
      slot.innerHTML = '';
      slot.appendChild(clone);
      slot.classList.add("has-image");
      slot.style.border = 'none';
    }
  });
});

    // Bahasa Popup
    document.addEventListener("DOMContentLoaded", () => {
      const popup = document.getElementById("languagePopup");
      const openBtn = document.getElementById("openLangPopup");
      const closeBtn = document.querySelector(".close-popup");

      openBtn.onclick = () => popup.style.display = "block";
      closeBtn.onclick = () => popup.style.display = "none";
      window.onclick = (event) => {
        if (event.target == popup) popup.style.display = "none";
      };

      window.setLanguage = function(lang) {
        localStorage.setItem("lang", lang);
        location.reload(); // reload untuk menerapkan bahasa
      };
    });