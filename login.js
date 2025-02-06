// 🔹 Login/Register Elements
const loginButton = document.getElementById("login-button");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");

const registerButton = document.getElementById("register-button");
const registerName = document.getElementById("register-name");
const registerEmail = document.getElementById("register-email");
const registerPassword = document.getElementById("register-password");
const registerError = document.getElementById("register-error");

// ✅ Cadastro de Usuário (POST)
registerButton.addEventListener("click", async () => {
  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();

  if (!name || !email || !password) {
    registerError.textContent = "Preencha todos os campos!";
    return;
  }

  try {
    const response = await fetch("https://holy-bible-java-production.up.railway.app/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: name, email, senha: password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Cadastro realizado com sucesso! Agora você pode fazer login.");
      document.getElementById("show-login").click();
    } else {
      registerError.textContent = data.message || "Erro ao cadastrar!";
    }
  } catch (error) {
    registerError.textContent = "Erro ao conectar com o servidor!";
  }
});

// ✅ Login de Usuário (GET)
loginButton.addEventListener("click", async () => {
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    loginError.textContent = "Preencha todos os campos!";
    return;
  }

  try {
    const response = await fetch(
      `https://holy-bible-java-production.up.railway.app/api/auth/login?email=${encodeURIComponent(
        email
      )}&senha=${encodeURIComponent(password)}`
    );

    if (!response.ok) {
      throw new Error("Falha no login");
    }

    const user = await response.json();

    if (user && user.email) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id, // Adicione o ID
          nome: user.nome,
          email: user.email,
          senha: user.senha,
        })
      );
      window.location.href = "bible.html";
    } else {
      loginError.textContent = "Email ou senha incorretos!";
    }
  } catch (error) {
    loginError.textContent = "Erro ao conectar com o servidor!";
  }
});

// ✅ Verificar se já está logado
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email) {
    window.location.href = "bible.html";
  }
});
