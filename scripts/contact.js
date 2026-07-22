/**
 * contact.js
 * Renders the Contact panel: form + social links from site.json.
 */
const Contact = (function () {
  function init(siteConfig) {
    const body = document.querySelector('#panel-contact .panel-body');
    if (!body || !siteConfig) return;

    const contact = siteConfig.contact || {};
    const social  = siteConfig.social  || [];

    // Social links HTML
    const socialHTML = social.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener"
         class="social-link ${s.color === 'accent-2' ? 'magenta' : ''}">
        <span class="s-icon">${s.icon}</span>
        <span class="s-name">${s.label}</span>
        <span class="s-url">${s.url.replace('https://', '').replace('mailto:', '')}</span>
      </a>`).join('');

    // Contact detail rows
    const detailsHTML = [
      contact.email    ? `<div class="contact-detail"><span class="icon">✉</span><a href="mailto:${contact.email}">${contact.email}</a></div>` : '',
      contact.location ? `<div class="contact-detail"><span class="icon">◎</span><span>${contact.location}</span></div>` : '',
      contact.availability ? `<div class="contact-detail"><span class="icon">◆</span><span>${contact.availability}</span></div>` : '',
    ].join('');

    body.innerHTML = `
      <div class="contact-wrap">
        <!-- Form -->
        <div class="contact-form-wrap">
          <h2>◆ SEND MESSAGE</h2>
          <form id="contactForm" novalidate>
            <div class="field">
              <label for="cf-name">NAME</label>
              <input id="cf-name" type="text" name="name" placeholder="Your name" required>
            </div>
            <div class="field">
              <label for="cf-email">EMAIL</label>
              <input id="cf-email" type="email" name="email" placeholder="you@example.com" required>
            </div>
            <div class="field">
              <label for="cf-subject">SUBJECT</label>
              <input id="cf-subject" type="text" name="subject" placeholder="What's this about?">
            </div>
            <div class="field">
              <label for="cf-msg">MESSAGE</label>
              <textarea id="cf-msg" name="message" rows="5" placeholder="Tell me about your project or opportunity..." required></textarea>
            </div>
            <button type="submit" class="submit-btn">⟶ SEND MESSAGE</button>
            <div class="form-feedback" id="formFeedback"></div>
          </form>
        </div>

        <!-- Info + Socials -->
        <div class="contact-info">
          <h2>◆ CONNECT</h2>
          ${detailsHTML}
          <div class="social-list" style="margin-top:var(--sp-5)">
            ${socialHTML}
          </div>
        </div>
      </div>`;

    // Wire form submit
    const form     = document.getElementById('contactForm');
    const feedback = document.getElementById('formFeedback');

    form?.addEventListener('submit', async e => {
      e.preventDefault();

      // Check validity since 'novalidate' is on the form to suppress default browser bubbles
      if (!form.checkValidity()) {
        feedback.className = 'form-feedback error';
        feedback.textContent = '✕ PLEASE FILL IN ALL REQUIRED FIELDS CORRECTLY';
        form.reportValidity(); // Highlight the invalid field using native styling/behavior
        return;
      }

      const data = new FormData(form);
      const endpoint = contact.formspreeEndpoint;

      feedback.className = 'form-feedback';
      feedback.textContent = 'TRANSMITTING...';

      if (endpoint) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            body: data,
            headers: { Accept: 'application/json' },
          });
          if (res.ok) {
            feedback.className = 'form-feedback success';
            feedback.textContent = '✓ MESSAGE TRANSMITTED SUCCESSFULLY';
            form.reset();
          } else {
            throw new Error('Server error');
          }
        } catch {
          feedback.className = 'form-feedback error';
          feedback.textContent = '✕ TRANSMISSION FAILED — TRY EMAIL DIRECTLY';
        }
      } else {
        // No endpoint configured
        setTimeout(() => {
          feedback.className = 'form-feedback success';
          feedback.textContent = '✓ MESSAGE CAPTURED — Connect Formspree in site.json to send emails';
          form.reset();
        }, 800);
      }
    });
  }

  return { init };
})();
