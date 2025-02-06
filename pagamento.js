document.addEventListener("DOMContentLoaded", () => {
  // Verificar se usuário está logado
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Configurar botão de copiar código PIX
  const copyButton = document.getElementById("copy-code");
  copyButton.addEventListener("click", () => {
    // Substitua este texto pelo seu código PIX
    navigator.clipboard.writeText(
      "00020126740014br.gov.bcb.pix0120tcunha2004@gmail.com0228Holy Bible acesso exclusivo!520400005303986540514.995802BR5922Thiago Friedrich Cunha6008Brasilia62090505m0vof6304D693"
    );
    copyButton.textContent = "Código copiado!";
    setTimeout(() => {
      copyButton.textContent = "Copiar código PIX";
    }, 2000);
  });

  // Adicionar o event listener para o botão de voltar
  const backButton = document.getElementById("back-button");
  backButton.addEventListener("click", () => {
    window.location.href = "bible.html";
  });

  // Adicionar o event listener para o botão de confirmação de pagamento
  const paymentConfirmedButton = document.getElementById("payment-confirmed");
  paymentConfirmedButton.addEventListener("click", () => {
    // Criar o container da mensagem
    const messageContainer = document.createElement("div");
    messageContainer.style.textAlign = "center";
    messageContainer.style.marginTop = "2rem";

    // Adicionar o ícone de check
    messageContainer.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <p style="color: #e8e8e8; margin-top: 1rem; font-size: 1rem;">
      Agora, aguarde a confirmação do pagamento no seu email cadastrado!
    </p>
  `;

    // Substituir o QR code e os botões pela mensagem
    const qrCodeContainer = document.querySelector(".qr-code-container");
    const buttonsContainer =
      document.querySelector(".copy-button").parentElement;

    qrCodeContainer.style.display = "none";
    paymentConfirmedButton.style.display = "none";
    document.getElementById("copy-code").style.display = "none";

    // Inserir a mensagem após o container do QR code
    qrCodeContainer.parentElement.insertBefore(
      messageContainer,
      qrCodeContainer.nextSibling
    );

    // Esconder a mensagem de instruções do QR Code
    document.querySelector(".payment-instructions").style.display = "none";
  });
});
