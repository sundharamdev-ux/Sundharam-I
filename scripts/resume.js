/**
 * resume.js
 * Renders the Resume panel from resume.json.
 * Includes download button, experience timeline, education, certs, achievements.
 */
const Resume = (function () {
  function init(resumeConfig) {
    const body = document.querySelector('#panel-resume .panel-body');
    if (!body || !resumeConfig) return;

    // Experience timeline
    const expHTML = (resumeConfig.experience || [])
      .map(exp => `
        <div class="tl-item">
          <div class="tl-year">${exp.type || exp.year}</div>
          <h4>${exp.title}</h4>
          <p>${exp.company ? `<em style="color:var(--accent-1)">${exp.company}</em> — ` : ''}${exp.description}</p>
        </div>`)
      .join('');

    // Education
    const eduHTML = (resumeConfig.education || [])
      .map(e => `
        <div class="tl-item">
          <div class="tl-year">${e.year}</div>
          <h4>${e.degree}</h4>
          <p>${e.institution ? `<em style="color:var(--accent-2)">${e.institution}</em> — ` : ''}${e.description}</p>
        </div>`)
      .join('');

    // Certificates
    const certHTML = (resumeConfig.certificates || [])
      .filter(c => c.name && !c.name.startsWith('Add'))
      .map(c => `
        <div class="cert-card">
          <div class="cert-info">
            <h4>${c.name}</h4>
            <span>${c.issuer || ''}</span>
          </div>
          <div class="cert-year">${c.year || ''}</div>
          ${c.url ? `<a href="${c.url}" target="_blank" rel="noopener" class="btn-mini" style="flex:0;white-space:nowrap">VIEW ↗</a>` : ''}
        </div>`)
      .join('');

    // Achievements
    const achHTML = (resumeConfig.achievements || [])
      .map(a => `<li>${a}</li>`)
      .join('');

    // Download button
    const hasResume = resumeConfig.resumeFile &&
                      !resumeConfig.resumeFile.includes('add') &&
                      resumeConfig.resumeFile.endsWith('.pdf');

    body.innerHTML = `
      <!-- Download card -->
      <div class="resume-header-card">
        <h2>◆ ${(resumeConfig.headline || 'RESUME').toUpperCase()}</h2>
        <p>${resumeConfig.summary || 'Download the full resume PDF.'}</p>
        ${hasResume
          ? `<a href="${resumeConfig.resumeFile}" download class="download-btn">⬇ DOWNLOAD RESUME.PDF</a>`
          : `<button class="download-btn" onclick="alert('Drop your resume.pdf into assets/ and update resumeFile in resume.json')">⬇ DOWNLOAD RESUME.PDF</button>`
        }
      </div>

      <div class="resume-section-wrap">
        <!-- Experience -->
        ${expHTML ? `
          <div class="resume-section-title">◆ EXPERIENCE</div>
          <div class="timeline">${expHTML}</div>
        ` : ''}

        <!-- Education -->
        ${eduHTML ? `
          <div class="resume-section-title">◆ EDUCATION</div>
          <div class="timeline">${eduHTML}</div>
        ` : ''}

        <!-- Certificates -->
        ${certHTML ? `
          <div class="resume-section-title">◆ CERTIFICATES</div>
          ${certHTML}
        ` : ''}

        <!-- Achievements -->
        ${achHTML ? `
          <div class="resume-section-title">◆ ACHIEVEMENTS</div>
          <ul class="achievement-list">${achHTML}</ul>
        ` : ''}
      </div>
    `;
  }

  return { init };
})();
window.Resume = Resume;

