document.addEventListener('DOMContentLoaded', () => {
  // Seu código JavaScript aqui
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const sendBtn = document.getElementById("send");

  sendBtn.addEventListener('click', async () => {
    let name = nameInput.value;
    let email = emailInput.value;
    let password = passwordInput.value;

    const response = await fetch('/auth/cadaster', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error('Erro ao criar usuário');
    }
  });
});
