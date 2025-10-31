// Pequeña lógica para menú desplegable, acordeones y formulario de reserva
document.addEventListener('DOMContentLoaded', () => {
  // Año en footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Toggle del panel de menú
  const menuToggle = document.getElementById('menu-toggle');
  const menuPanel = document.getElementById('menu-panel');
  if (menuToggle && menuPanel) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        menuPanel.hidden = true;
      } else {
        menuPanel.hidden = false;
      }
    });

    // Close menu if click outside
    document.addEventListener('click', (e) => {
      if (!menuPanel.contains(e.target) && !menuToggle.contains(e.target)) {
        menuPanel.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Acordeones dentro del menú
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = btn.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      const expanded = btn.getAttribute('aria-expanded') === 'true';

      // Cerrar otros
      accordions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      if (expanded) {
        btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.hidden = true;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        if (panel) panel.hidden = false;
      }
    });
  });

  // Formulario de reserva: validación simple y mensaje
  const form = document.getElementById('reservation-form');
  const msg = document.getElementById('form-msg');
  if (form) {
    /*
      Envío real:
      - Si quieres recibir reservas por correo sin backend, puedes usar Formspree:
        1) Regístrate en https://formspree.io y crea un endpoint.
        2) Pega la URL en la constante FORMSPREE_ENDPOINT más abajo.
      - Alternativa: puedes dejar FORMSPREE_ENDPOINT vacío y el formulario usará mailto: como fallback.
      - También se deja un hueco para GOOGLE_FORM_ACTION si deseas usar un formulario de Google (requiere nombres de campo concretos).
    */

    // CONFIG: pon tu endpoint aquí si tienes Formspree u otro servicio
    const FORMSPREE_ENDPOINT = ''; // e.g. 'https://formspree.io/f/abcdxyz'
    const GOOGLE_FORM_ACTION = ''; // e.g. 'https://docs.google.com/forms/d/e/....../formResponse'

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.querySelector('#name');
      const phone = form.querySelector('#phone');
      const email = form.querySelector('#email');
      const date = form.querySelector('#date');
      const time = form.querySelector('#time');
      const guests = form.querySelector('#guests');
      const notes = form.querySelector('#notes');

      // Validaciones básicas
      if (!name.value.trim() || !phone.value.trim() || !date.value || !time.value || !guests.value) {
        showMessage('Por favor, rellena los campos obligatorios (nombre, teléfono, fecha, hora y comensales).', true);
        return;
      }

      // Si tienes Formspree (o un endpoint similar), lo usamos
      if (FORMSPREE_ENDPOINT) {
        try {
          const data = new FormData();
          data.append('name', name.value);
          data.append('phone', phone.value);
          data.append('email', email.value || '');
          data.append('date', date.value);
          data.append('time', time.value);
          data.append('guests', guests.value);
          data.append('notes', notes.value || '');

          const res = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            body: data,
            headers: { 'Accept': 'application/json' }
          });
          if (res.ok) {
            showMessage('¡Reserva enviada! Te confirmaremos por teléfono o email.', false);
            form.reset();
          } else {
            showMessage('Error al enviar la reserva. Intenta nuevamente o usa contacto telefónico.', true);
          }
        } catch (err) {
          showMessage('Error de red al enviar. Revisa tu conexión.', true);
        }
        return;
      }

      // Si prefieres usar Google Forms, configura GOOGLE_FORM_ACTION y los nombres de campo correctamente
      if (GOOGLE_FORM_ACTION) {
        // Nota: para Google Forms necesitas los nombres de inputs tipo 'entry.123456789'.
        // Aquí hacemos un submit directo: ajusta los 'name' de inputs del formulario para que coincidan con Google Forms.
        form.action = GOOGLE_FORM_ACTION;
        form.method = 'POST';
        form.target = '_blank';
        form.submit();
        showMessage('Enviando a Google Forms...', false);
        form.reset();
        return;
      }

      // Fallback: abrir mailto: con los datos (cliente de correo del usuario)
      const subject = encodeURIComponent('Reserva - La Abuela Pepa: ' + name.value);
      const bodyLines = [];
      bodyLines.push('Nombre: ' + name.value);
      bodyLines.push('Teléfono: ' + phone.value);
      if (email.value) bodyLines.push('Email: ' + email.value);
      bodyLines.push('Fecha: ' + date.value);
      bodyLines.push('Hora: ' + time.value);
      bodyLines.push('Comensales: ' + guests.value);
      if (notes.value) bodyLines.push('\nNotas: ' + notes.value);
      const body = encodeURIComponent(bodyLines.join('\n'));
      // Cambia este correo por el del restaurante
      const to = 'laabuela@example.com';
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      showMessage('Se abrirá tu cliente de correo para completar el envío.', false);
      form.reset();
      // Cerrar panel del menú si está abierto
      if (menuPanel) { menuPanel.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  function showMessage(text, isError) {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = isError ? '#b13636' : 'var(--primary)';
    setTimeout(() => { msg.textContent = ''; }, 7000);
  }
});
