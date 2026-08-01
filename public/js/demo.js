/* ==========================================================================
   CREDIBLE CREATE - BOOK A DEMO PAGE LOGIC (STANDALONE ISOLATED SCRIPT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const demoForm = document.getElementById('demo-form');
  const formSuccess = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');

  // 1. Domain Chips Selection Handler (Robotics vs Innovation Design & AI)
  const domainChips = document.querySelectorAll('#domain-chips .chip-item');
  const formInterestInput = document.getElementById('form-interest');

  domainChips.forEach(chip => {
    chip.addEventListener('click', () => {
      domainChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const val = chip.getAttribute('data-val') || chip.textContent.trim();
      if (formInterestInput) {
        formInterestInput.value = val;
      }
    });
  });

  // 2. Audience Level Selection Handler (School vs College Toggle)
  const audienceChips = document.querySelectorAll('#audience-chips .chip-item');
  const formLevelInput = document.getElementById('form-level');
  const schoolFields = document.getElementById('school-fields');
  const collegeFields = document.getElementById('college-fields');

  audienceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      audienceChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const val = chip.getAttribute('data-val') || 'school';

      if (formLevelInput) {
        formLevelInput.value = val;
      }

      if (schoolFields && collegeFields) {
        if (val === 'school') {
          schoolFields.style.display = 'block';
          collegeFields.style.display = 'none';
        } else {
          schoolFields.style.display = 'none';
          collegeFields.style.display = 'block';
        }
      }
    });
  });

  // 3. Class Chips Selection Handler (for School level)
  const classChips = document.querySelectorAll('#class-chips .chip-item');
  const formClassInput = document.getElementById('form-class');

  classChips.forEach(chip => {
    chip.addEventListener('click', () => {
      classChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const val = chip.getAttribute('data-val') || chip.textContent.trim();
      if (formClassInput) {
        formClassInput.value = val;
      }
    });
  });

  // 4. College Chips Selection Handler (for College level)
  const collegeChips = document.querySelectorAll('#college-chips .chip-item');
  const formCourseInput = document.getElementById('form-course');

  collegeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      collegeChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
      const val = chip.getAttribute('data-val') || chip.textContent.trim();
      if (formCourseInput) {
        formCourseInput.value = val;
      }
    });
  });

  // 5. 3D Mouse Parallax Effect for Demo Stage Elements
  const splitGrid = document.getElementById('demo-split-grid');
  const studentImg = document.getElementById('demo-student-img');
  const carMascot = document.getElementById('demo-car-mascot');
  const formCard = document.getElementById('demo-card-container');

  if (splitGrid && typeof gsap !== 'undefined') {
    splitGrid.addEventListener('mousemove', (e) => {
      const rect = splitGrid.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (studentImg) {
        gsap.to(studentImg, {
          x: x * 22,
          y: y * 22,
          duration: 0.5,
          ease: 'power2.out'
        });
      }

      if (carMascot) {
        gsap.to(carMascot, {
          x: x * 32,
          y: y * 32,
          duration: 0.5,
          ease: 'power2.out'
        });
      }

      if (formCard) {
        gsap.to(formCard, {
          rotationY: x * 3,
          rotationX: -y * 3,
          transformPerspective: 1200,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
    });

    splitGrid.addEventListener('mouseleave', () => {
      if (studentImg) gsap.to(studentImg, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
      if (carMascot) gsap.to(carMascot, { x: 0, y: 0, duration: 0.8, ease: 'power3.out' });
      if (formCard) gsap.to(formCard, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'power3.out' });
    });
  }

  // 6. Trust Metrics Strip Count-Up Numbers Animation
  const countElements = document.querySelectorAll('.trust-num');
  if (countElements.length > 0 && typeof gsap !== 'undefined') {
    countElements.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      if (!isNaN(target)) {
        const suffix = target === 99 ? '%' : '+';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power3.out',
          onUpdate: () => {
            if (target === 10000) {
              el.textContent = Math.floor(obj.val).toLocaleString() + suffix;
            } else {
              el.textContent = Math.floor(obj.val) + suffix;
            }
          }
        });
      }
    });
  }

  // 7. Secure Live Submission Handler to Google Apps Script
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJuIfElPCsZ-2K58rS72-UDDJ9uiAU8HmG7dZw2VLrsoFrjP5csBp5-JGjz3yXTdva/exec';
  let isSubmitting = false;

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const institutionInput = document.getElementById('form-institution');
      const interestInput = document.getElementById('form-interest');
      const levelInput = document.getElementById('form-level');
      const classInput = document.getElementById('form-class');
      const courseInput = document.getElementById('form-course');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const institution = institutionInput ? institutionInput.value.trim() : '';
      const interest = interestInput ? interestInput.value.trim() : 'Robotics';
      const level = levelInput ? levelInput.value.trim() : 'school';
      const classVal = classInput ? classInput.value.trim() : '';
      const courseVal = courseInput ? courseInput.value.trim() : '';
      const classOrCourse = level === 'school' ? classVal : courseVal;

      if (!name || !email || !institution) {
        alert('Please fill in all required fields.');
        return;
      }

      isSubmitting = true;
      if (submitBtn) submitBtn.disabled = true;
      const ctaText = submitBtn ? submitBtn.querySelector('.btn-demo-cta-text') : null;
      if (ctaText) {
        ctaText.textContent = 'Transmitting Request...';
      }

      const payload = {
        name: name,
        email: email,
        institution: institution,
        interest: interest,
        level: level,
        class_course: classOrCourse,
        class: classVal,
        course: courseVal
      };

      fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
      .then(() => {
        if (typeof gsap !== 'undefined') {
          gsap.to(demoForm, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            onComplete: () => {
              demoForm.style.display = 'none';
              if (formSuccess) {
                formSuccess.style.display = 'flex';
                gsap.fromTo(formSuccess.querySelectorAll('> *'),
                  { opacity: 0, y: 20, scale: 0.95 },
                  { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, ease: 'back.out(1.5)' }
                );
              }
            }
          });
        } else {
          demoForm.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'flex';
        }
      })
      .catch((err) => {
        console.error('Submission error:', err);
        if (ctaText) ctaText.textContent = 'Request a Demo →';
        if (submitBtn) submitBtn.disabled = false;
        isSubmitting = false;
        alert('Failed to transmit request. Please try again.');
      });
    });
  }
});
