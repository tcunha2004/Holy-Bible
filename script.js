// DOM Elements
const booksNav = document.querySelector(".books-nav");
const versesContainer = document.getElementById("verses");
const chapterTitle = document.querySelector(".chapter-title");
const versionSelect = document.getElementById("version");
const assistant = document.getElementById("holy-assistant");
const toggleButton = document.getElementById("toggle-assistant");
const minimizeButton = document.getElementById("minimize-assistant");
const messageInput = document.getElementById("message-input");
const sendButton = document.querySelector(".send-button");
const messagesContainer = document.getElementById("messages");

// Profile Elements
const profileButton = document.getElementById("profile-button");
const profileName = document.getElementById("profile-name");
const profileDropdown = document.getElementById("profile-dropdown");
const dropdownName = document.getElementById("dropdown-name");
const dropdownEmail = document.getElementById("dropdown-email");
const dropdownPassword = document.getElementById("dropdown-password");
const togglePassword = document.getElementById("toggle-password");
const logoutButton = document.getElementById("logout-button");

// Mobile Elements
const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");

// Contador de prompts
let promptCount = 0;

// Função para verificar plano pago
async function checkPaidPlan(email, senha) {
  try {
    const response = await fetch(
      `https://holy-bible-java-production.up.railway.app/api/plan/check?email=${encodeURIComponent(
        email
      )}&senha=${encodeURIComponent(senha)}`
    );
    return await response.json();
  } catch (error) {
    console.error("Erro ao verificar plano:", error);
    return false;
  }
}

// Função para incrementar contador de prompts
async function incrementPromptCount(userId) {
  try {
    const response = await fetch(
      `https://holy-bible-java-production.up.railway.app/api/prompt/incremento`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: parseInt(userId) }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Erro ao incrementar prompts:", error);
  }
}

// Função para truncar email
function truncateEmail(email) {
  const [localPart, domain] = email.split("@");

  if (localPart.length <= 8) {
    return email;
  }

  return `${localPart.substring(0, 5)}(...)@${domain}`;
}

// Função para mostrar o balão de introdução do Holy
function showHolyIntro() {
  const introMessage = document.createElement("div");
  introMessage.style.cssText = `
    position: fixed;
    bottom: 6.5rem;
    right: 4rem;
    background: #363b42;
    padding: 1rem;
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 300px;
    z-index: 999;
    animation: fadeIn 1.5s ease-in-out;
  `;

  introMessage.innerHTML = `
    <p style="color: #e8e8e8; margin: 0; font-size: 0.9rem;">
      Olá! Eu sou o Holy, seu assistente espiritual. Estou aqui para ajudar você a compreender melhor a palavra de Deus. Clique em qualquer versículo para conversarmos sobre ele!
    </p>
  `;

  document.body.appendChild(introMessage);

  setTimeout(() => {
    introMessage.style.animation = "fadeOut 1.5s ease-in-out";
    setTimeout(() => {
      document.body.removeChild(introMessage);
    }, 500);
  }, 5000);

  localStorage.setItem("holyIntroShown", "true");
}

// Initialize profile
function initializeProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    // Extrair o primeiro nome
    const firstName = user.nome.split(" ")[0];

    // Atualizar o botão com apenas o primeiro nome
    profileName.textContent = firstName;

    // Manter o nome completo no dropdown
    dropdownName.textContent = user.nome;
    dropdownEmail.textContent = user.email;
    dropdownPassword.textContent = "•".repeat(user.senha.length);
  }
}

// Toggle password visibility
let passwordVisible = false;
togglePassword.addEventListener("click", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    passwordVisible = !passwordVisible;
    dropdownPassword.textContent = passwordVisible ? user.senha : "•".repeat(8);

    // Update eye icon
    togglePassword.innerHTML = passwordVisible
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  }
});

// Toggle dropdown
profileButton.addEventListener("click", () => {
  profileDropdown.classList.toggle("hidden");
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (
    !profileButton.contains(e.target) &&
    !profileDropdown.contains(e.target)
  ) {
    profileDropdown.classList.add("hidden");
  }
});

// Handle logout
function handleLogout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

// Add logout event listener
logoutButton.addEventListener("click", handleLogout);

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  
  // Verifica se existe um usuário logado
  const user = JSON.parse(localStorage.getItem("user"));

  // Se não houver usuário logado, redireciona para a página de login
  if (!user || !user.email) {
    window.location.href = "index.html";
    return;
  }

  // Inicializar perfil
  initializeProfile();

  // Verificar se é a primeira visita
  const isFirstVisit = !localStorage.getItem("holyIntroShown");
  if (isFirstVisit) {
    showHolyIntro();
  }

  // Mobile menu toggle
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });

    // Fechar o menu ao clicar fora
    document.addEventListener("click", (e) => {
      if (
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target) &&
        sidebar.classList.contains("active")
      ) {
        sidebar.classList.remove("active");
      }
    });
  }

  // Inicializar conteúdo
  loadSavedState();
  initializeContent();
});

// State
let currentVersion = localStorage.getItem("currentVersion") || "acf";
let currentBook = null;
let currentChapter = 1;
let books = []; // Array global para armazenar todos os livros

// Load saved state
function loadSavedState() {
  // Set version from localStorage
  versionSelect.value = currentVersion;

  // Get saved book and chapter
  const savedBook = localStorage.getItem("currentBook");
  const savedChapter = localStorage.getItem("currentChapter");

  if (savedBook) {
    currentBook = JSON.parse(savedBook);
    currentChapter = parseInt(savedChapter) || 1;
  }
}

// Save current state
function saveState() {
  localStorage.setItem("currentVersion", currentVersion);
  localStorage.setItem("hasVisited", "true");
  if (currentBook) {
    localStorage.setItem("currentBook", JSON.stringify(currentBook));
    localStorage.setItem("currentChapter", currentChapter.toString());
  }
}

// Initialize content
async function initializeContent() {
  try {
    const response = await fetch("https://holy-bible-java-production.up.railway.app/api/books");
    books = await response.json(); // Armazena os livros globalmente
    displayBooks(books);

    const hasVisited = localStorage.getItem("hasVisited");

    if (currentBook) {
      // User has a saved position, restore it
      const book = books.find((b) => b.nome === currentBook.nome);
      if (book) {
        await selectBook(book, false);
      }
    } else if (!hasVisited) {
      // First time visitor
      versesContainer.innerHTML = ""; // Limpa o conteúdo anterior
      showWelcomeMessage();
      localStorage.setItem("hasVisited", "true");
    } else {
      // Usuário já visitou mas não tem posição salva
      versesContainer.innerHTML = ""; // Mantém o container limpo
    }
  } catch (error) {
    console.error("Erro ao carregar livros:", error);
  }
}

// Show welcome message
function showWelcomeMessage() {
  const welcomeDiv = document.createElement("div");
  welcomeDiv.className = "welcome-message";
  welcomeDiv.innerHTML = `
    <h2>Bem-vindo!</h2>
    <p>Vamos aprofundar na palavra de Deus?</p>
    <br>
    <p>1- Escolha seu livro no menu acima 📖</p>
    <p>2- Esolha qual versao gostaria de ler 💭</p>
    <p>3- Clique no versiculo que tem duvida ou digite sua duvida e receba ajuda do Holy! 🕊️</p>

  `;
  versesContainer.appendChild(welcomeDiv);
}

// Display books in sidebar
function displayBooks(books) {
  // Clear previous content
  booksNav.innerHTML = "";

  // Create search input
  const searchContainer = document.createElement("div");
  searchContainer.className = "search-container";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "Pesquisar livro...";
  searchInput.className = "search-input";

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBooks = books.filter(
      (book) =>
        book.nome.toLowerCase().includes(searchTerm) ||
        book.autor.toLowerCase().includes(searchTerm)
    );
    displayFilteredBooks(filteredBooks);
  });

  searchContainer.appendChild(searchInput);
  booksNav.appendChild(searchContainer);

  // Create books container
  const booksContainer = document.createElement("div");
  booksContainer.className = "books-container";

  // Add books
  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.className = "book";
    bookElement.textContent = book.nome;
    bookElement.addEventListener("click", () => selectBook(book, true));
    booksContainer.appendChild(bookElement);
  });

  booksNav.appendChild(booksContainer);

  // Add show more button
  const showMoreButton = document.createElement("button");
  showMoreButton.className = "show-more-button";
  showMoreButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
`;

  // Handle scroll behavior
  booksContainer.addEventListener("scroll", () => {
    const scrollPercentage =
      (booksContainer.scrollTop + booksContainer.clientHeight) /
      booksContainer.scrollHeight;
    if (scrollPercentage > 0.1) {
      showMoreButton.classList.add("hidden");
    } else {
      showMoreButton.classList.remove("hidden");
    }
  });

  // Handle click to scroll down
  showMoreButton.addEventListener("click", () => {
    const currentScroll = booksContainer.scrollTop;
    const scrollAmount = booksContainer.clientHeight * 0.3;

    booksContainer.scrollTo({
      top: currentScroll + scrollAmount,
      behavior: "smooth",
    });
  });

  booksNav.appendChild(showMoreButton);
}

// Display filtered books (for search)
function displayFilteredBooks(books) {
  const booksContainer = booksNav.querySelector(".books-container");
  booksContainer.innerHTML = "";

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.className = "book";
    bookElement.textContent = book.nome;
    bookElement.addEventListener("click", () => selectBook(book, true));
    booksContainer.appendChild(bookElement);
  });
}

// Navigate to previous chapter or book
function navigatePrevious() {
  if (currentChapter > 1) {
    currentChapter--;
    loadChapter();
    saveState();
  } else {
    // Find current book index
    const currentIndex = books.findIndex(
      (book) => book.nome === currentBook.nome
    );
    if (currentIndex > 0) {
      // Go to previous book
      const previousBook = books[currentIndex - 1];
      currentBook = previousBook;
      currentChapter = getBookChapters(previousBook.nome);
      selectBook(previousBook, false);
    }
  }
}

// Navigate to next chapter or book
function navigateNext() {
  const maxChapters = getBookChapters(currentBook.nome);
  if (currentChapter < maxChapters) {
    currentChapter++;
    loadChapter();
    saveState();
  } else {
    // Find current book index
    const currentIndex = books.findIndex(
      (book) => book.nome === currentBook.nome
    );
    if (currentIndex < books.length - 1) {
      // Go to next book
      const nextBook = books[currentIndex + 1];
      currentBook = nextBook;
      currentChapter = 1;
      selectBook(nextBook, false);
    }
  }
}

// Create navigation buttons
function createNavigationButtons() {
  const navigationTop = document.createElement("div");
  navigationTop.className = "chapter-navigation";

  const navigationBottom = document.createElement("div");
  navigationBottom.className = "chapter-navigation";

  // Previous button (top)
  const prevButtonTop = document.createElement("button");
  prevButtonTop.className = "nav-button";
  prevButtonTop.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
    Capítulo Anterior
  `;
  prevButtonTop.addEventListener("click", navigatePrevious);

  // Next button (bottom)
  const nextButtonBottom = document.createElement("button");
  nextButtonBottom.className = "nav-button";
  nextButtonBottom.innerHTML = `
    Próximo Capítulo
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  `;
  nextButtonBottom.addEventListener("click", navigateNext);

  navigationTop.appendChild(prevButtonTop);
  navigationBottom.appendChild(nextButtonBottom);

  return { navigationTop, navigationBottom };
}

// Select a book
async function selectBook(book, resetChapter = true) {
  currentBook = book;
  if (resetChapter) {
    currentChapter = 1;
  }

  versesContainer.innerHTML = ""; // Limpa todo o conteúdo antes de começar

  // Create chapter header
  const chapterHeader = document.createElement("div");
  chapterHeader.className = "chapter-header";

  // Create chapter title
  const titleElement = document.createElement("h2");
  titleElement.className = "chapter-title";
  titleElement.textContent = `${book.nome} ${currentChapter}`;
  chapterHeader.appendChild(titleElement);

  // Create chapter selector
  const chapterSelector = document.createElement("select");
  chapterSelector.className = "select chapter-selector";

  const numChapters = getBookChapters(book.nome);
  for (let i = 1; i <= numChapters; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `Capítulo ${i}`;
    if (i === currentChapter) {
      option.selected = true;
    }
    chapterSelector.appendChild(option);
  }

  chapterSelector.addEventListener("change", (e) => {
    currentChapter = parseInt(e.target.value);
    loadChapter();
    saveState();
  });

  chapterHeader.appendChild(chapterSelector);
  versesContainer.appendChild(chapterHeader);

  // Create navigation buttons
  const { navigationTop, navigationBottom } = createNavigationButtons();

  // Add top navigation
  versesContainer.appendChild(navigationTop);

  // Create verses container
  const versesDiv = document.createElement("div");
  versesDiv.className = "verses";
  versesContainer.appendChild(versesDiv);

  // Add bottom navigation
  versesContainer.appendChild(navigationBottom);

  await loadChapter();
  saveState();
}

// Get number of chapters for a book
function getBookChapters(bookName) {
  const bookChapters = {
    Gênesis: 50,
    Êxodo: 40,
    Levítico: 27,
    Números: 36,
    Deuteronômio: 34,
    Josué: 24,
    Juízes: 21,
    Rute: 4,
    "1º Samuel": 31,
    "2º Samuel": 24,
    "1º Reis": 22,
    "2º Reis": 25,
    "1º Crônicas": 29,
    "2º Crônicas": 36,
    Esdras: 10,
    Neemias: 13,
    Ester: 10,
    Jó: 42,
    Salmos: 150,
    Provérbios: 31,
    Eclesiastes: 12,
    Cânticos: 8,
    Isaías: 66,
    Jeremias: 52,
    "Lamentações de Jeremias": 5,
    Ezequiel: 48,
    Daniel: 12,
    Oséias: 14,
    Joel: 3,
    Amós: 9,
    Obadias: 1,
    Jonas: 4,
    Miquéias: 7,
    Naum: 3,
    Habacuque: 3,
    Sofonias: 3,
    Ageu: 2,
    Zacarias: 14,
    Malaquias: 4,
    Mateus: 28,
    Marcos: 16,
    Lucas: 24,
    João: 21,
    Atos: 28,
    Romanos: 16,
    "1ª Coríntios": 16,
    "2ª Coríntios": 13,
    Gálatas: 6,
    Efésios: 6,
    Filipenses: 4,
    Colossenses: 4,
    "1ª Tessalonicenses": 5,
    "2ª Tessalonicenses": 3,
    "1ª Timóteo": 6,
    "2ª Timóteo": 4,
    Tito: 3,
    Filemom: 1,
    Hebreus: 13,
    Tiago: 5,
    "1ª Pedro": 5,
    "2ª Pedro": 3,
    "1ª João": 5,
    "2ª João": 1,
    "3ª João": 1,
    Judas: 1,
    Apocalipse: 22,
  };

  return bookChapters[bookName];
}

// Load chapter content
async function loadChapter() {
  try {
    const versesDiv = versesContainer.querySelector(".verses");
    if (versesDiv) {
      versesDiv.innerHTML =
        '<div class="loading"><div class="loading-spinner"></div></div>';
    }

    const bookAbbrev = getBookAbbrev(currentBook.nome);
    const response = await fetch(
      `https://holy-bible-java-production.up.railway.app/api/chapters/${currentVersion}/${bookAbbrev}/${currentChapter}`
    );
    const data = await response.json();

    // Update chapter title
    const titleElement = versesContainer.querySelector(".chapter-title");
    if (titleElement) {
      titleElement.textContent = `${currentBook.nome} ${currentChapter}`;
    }

    // Update chapter selector
    const chapterSelector = versesContainer.querySelector(".chapter-selector");
    if (chapterSelector) {
      chapterSelector.value = currentChapter;
    }

    // Create new verses container
    const newVersesDiv = document.createElement("div");
    newVersesDiv.className = "verses";

    // Create paragraphs for verses groups
    let currentParagraph = document.createElement("p");
    currentParagraph.className = "verses-text";

    data.dadosVerso.forEach((verse, index) => {
      // Create new paragraph every 3 verses
      if (index > 0 && index % 3 === 0) {
        newVersesDiv.appendChild(currentParagraph);
        currentParagraph = document.createElement("p");
        currentParagraph.className = "verses-text";
      }

      const verseSpan = document.createElement("span");
      verseSpan.className = "verse";

      // Create verse number
      const numberSpan = document.createElement("span");
      numberSpan.className = "verse-number";
      numberSpan.textContent = verse.numero;

      // Create verse text
      const textSpan = document.createElement("span");
      textSpan.className = "verse-text";
      textSpan.textContent = ` ${verse.texto} `;

      verseSpan.appendChild(numberSpan);
      verseSpan.appendChild(textSpan);

      // Add click handler for verse
      verseSpan.addEventListener("click", () => {
        // Format verse reference
        const verseReference = `${currentBook.nome} ${currentChapter}:${verse.numero}`;
        const message = `${verseReference} - ${verse.texto}`;

        // Expand assistant if not already expanded
        if (!assistant.classList.contains("expanded")) {
          assistant.classList.add("expanded");
        }

        // Send verse to Holy Assistant
        messageInput.value = message;
        handleMessage();
      });

      currentParagraph.appendChild(verseSpan);
    });

    // Append the last paragraph if it has any verses
    if (currentParagraph.childNodes.length > 0) {
      newVersesDiv.appendChild(currentParagraph);
    }

    // Replace old verses with new ones
    const oldVersesDiv = versesContainer.querySelector(".verses");
    if (oldVersesDiv) {
      versesContainer.replaceChild(newVersesDiv, oldVersesDiv);
    }
  } catch (error) {
    console.error("Erro ao carregar capítulo:", error);
  }
}

// Get book abbreviation
function getBookAbbrev(bookName) {
  const bookAbbrevs = {
    Gênesis: "gn",
    Êxodo: "ex",
    Levítico: "lv",
    Números: "nm",
    Deuteronômio: "dt",
    Josué: "js",
    Juízes: "jz",
    Rute: "rt",
    "1º Samuel": "1sm",
    "2º Samuel": "2sm",
    "1º Reis": "1rs",
    "2º Reis": "2rs",
    "1º Crônicas": "1cr",
    "2º Crônicas": "2cr",
    Esdras: "ed",
    Neemias: "ne",
    Ester: "et",
    Jó: "job",
    Salmos: "sl",
    Provérbios: "pv",
    Eclesiastes: "ec",
    Cânticos: "ct",
    Isaías: "is",
    Jeremias: "jr",
    "Lamentações de Jeremias": "lm",
    Ezequiel: "ez",
    Daniel: "dn",
    Oséias: "os",
    Joel: "jl",
    Amós: "am",
    Obadias: "ob",
    Jonas: "jn",
    Miquéias: "mq",
    Naum: "na",
    Habacuque: "hc",
    Sofonias: "sf",
    Ageu: "ag",
    Zacarias: "zc",
    Malaquias: "ml",
    Mateus: "mt",
    Marcos: "mc",
    Lucas: "lc",
    João: "jo",
    Atos: "at",
    Romanos: "rm",
    "1ª Coríntios": "1co",
    "2ª Coríntios": "2co",
    Gálatas: "gl",
    Efésios: "ef",
    Filipenses: "fp",
    Colossenses: "cl",
    "1ª Tessalonicenses": "1ts",
    "2ª Tessalonicenses": "2ts",
    "1ª Timóteo": "1tm",
    "2ª Timóteo": "2tm",
    Tito: "tt",
    Filemom: "fm",
    Hebreus: "hb",
    Tiago: "tg",
    "1ª Pedro": "1pe",
    "2ª Pedro": "2pe",
    "1ª João": "1jo",
    "2ª João": "2jo",
    "3ª João": "3jo",
    Judas: "jd",
    Apocalipse: "ap",
  };

  return bookAbbrevs[bookName];
}

// Version selector
versionSelect.addEventListener("change", (e) => {
  currentVersion = e.target.value;
  if (currentBook) {
    loadChapter();
    saveState();
  }
});

// Holy Assistant
toggleButton.addEventListener("click", () => {
  assistant.classList.add("expanded");
});

minimizeButton.addEventListener("click", () => {
  assistant.classList.remove("expanded");
});

// Message handling
function addMessage(text, isUser = false) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${isUser ? "user" : "holy"}`;
  messageDiv.innerHTML = `<p>${text}</p>`;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Função para fazer a requisição ao backend
async function generateResponse(prompt) {
  try {
    const response = await fetch("https://holy-bible-java-production.up.railway.app/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt.replace(/"/g, '\\"') }),
    });

    if (!response.ok) {
      throw new Error("Erro na resposta do servidor");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Erro ao gerar resposta:", error);
    return "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.";
  }
}

// Nova função de manipulação de mensagem com integração ao backend
async function handleMessage() {
  const text = messageInput.value.trim();
  if (text) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      console.error("ID do usuário não encontrado");
      window.location.href = "index.html";
      return;
    }

    try {
      // 1. Primeiro verifica se tem plano pago
      const hasPaidPlan = await checkPaidPlan(user.email, user.senha);

      if (!hasPaidPlan) {
        // 2. Se não tem plano pago, verifica o contador atual
        const response = await fetch(
          `https://holy-bible-java-production.up.railway.app/api/prompt/count/${user.id}`
        );
        const currentCount = await response.json();

        // 3. Se já atingiu o limite, redireciona
        if (currentCount >= 5) {
          window.location.href = "pagamento.html";
          return;
        }
      }

      // 4. Se chegou aqui, pode processar a mensagem
      addMessage(text, true);
      messageInput.value = "";

      const typingDiv = document.createElement("div");
      typingDiv.className = "message holy";
      typingDiv.innerHTML = "<p>Digitando...</p>";
      messagesContainer.appendChild(typingDiv);

      // 5. Gera a resposta
      const response = await generateResponse(text);
      typingDiv.remove();
      addMessage(response);

      // 6. Incrementa o contador APENAS se não tem plano pago
      if (!hasPaidPlan) {
        await incrementPromptCount(user.id);
      }
    } catch (error) {
      console.error("Erro:", error);
      addMessage(
        "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente."
      );
    }
  }
}

messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleMessage();
  }
});

sendButton.addEventListener("click", handleMessage);
