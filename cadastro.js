// DOM Elements
const registerButton = document.getElementById("register-button");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm-password");
const registerError = document.getElementById("register-error");
const registerLoading = document.getElementById("register-loading");

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
  return password.length >= 6;
}

// Show error message
function showError(message) {
  registerError.textContent = message;
  registerError.style.opacity = "1";
}

// Clear error message
function clearError() {
  registerError.textContent = "";
  registerError.style.opacity = "0";
}

// Show/hide loading spinner
function toggleLoading(show) {
  registerLoading.classList.toggle("hidden", !show);
}

// Handle registration
registerButton.addEventListener("click", async () => {
  // Get form values
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  // Clear previous errors
  clearError();

  // Validate inputs
  if (!name || !email || !password || !confirmPassword) {
    showError("Por favor, preencha todos os campos!");
    return;
  }

  if (!isValidEmail(email)) {
    showError("Por favor, insira um email válido!");
    return;
  }

  if (!isValidPassword(password)) {
    showError("A senha deve ter pelo menos 6 caracteres!");
    return;
  }

  if (password !== confirmPassword) {
    showError("As senhas não coincidem!");
    return;
  }

  // Show loading spinner
  toggleLoading(true);

  try {
    const response = await fetch("https://holy-bible-java-production.up.railway.app/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: name,
        email: email,
        senha: password,
      }),
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = "index.html";
    } else {
      // Show error from server
      showError("Usuario ja cadastrado!");
    }
  } catch (error) {
    showError("Erro ao conectar com o servidor. Tente novamente mais tarde!");
  } finally {
    toggleLoading(false);
  }
});

// Clear error when user starts typing
const inputs = [nameInput, emailInput, passwordInput, confirmPasswordInput];
inputs.forEach((input) => {
  input.addEventListener("input", clearError);
});

// Prevent form submission on enter key
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    registerButton.click();
  }
});
