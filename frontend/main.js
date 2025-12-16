  const form = document.getElementById('contactForm');
    const statusMessage = document.getElementById('statusMessage');
    const submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Désactiver le bouton pendant l'envoi
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      statusMessage.textContent = '';

      // Récupérer les données du formulaire
      const formData = {
        forname: document.getElementById('forname').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
      };

      try {
        const response = await fetch('http://localhost:3000/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
          statusMessage.textContent = '✅ Message sent successfully!';
          statusMessage.style.color = 'green';
          form.reset();
        } else {
          statusMessage.textContent = '❌ Error: ' + data.error;
          statusMessage.style.color = 'red';
        }
      } catch (error) {
        statusMessage.textContent = '❌ Connection error. Please try again.';
        statusMessage.style.color = 'red';
      } finally {
        // Réactiver le bouton
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });