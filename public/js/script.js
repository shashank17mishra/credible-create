/* ==========================================================================
   CREDIBLE CREATE - VIRTUAL SCROLL & MOTION ENGINE
   ========================================================================== */

function initCredibleCreate() {
  const redirectMap = {
    '#programs': '/programs.html',
    '#about': '/about.html',
    '#projects': '/projects.html',
    '#verify': '/verify.html',
    '#demo': '/demo.html'
  };
  if (redirectMap[window.location.hash]) {
    window.location.replace(redirectMap[window.location.hash]);
    return;
  }

  const container = document.getElementById('scroll-wrapper');
  if (!container) return; // Not on the landing page — nothing to initialize

  const sections = document.querySelectorAll('.story-section');
  const dots = document.querySelectorAll('.side-nav-dot');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollPrompt = document.getElementById('scroll-prompt');

  // ==========================================================================
  // HERO AVATAR CHROMA-KEY VIDEO PLAYER (CANVAS TRANSPARENCY RENDERER)
  // ==========================================================================
  const avatarVideo = document.getElementById('hero-avatar-video');
  const avatarCanvas = document.getElementById('hero-avatar-canvas');
  if (avatarVideo && avatarCanvas) {
    const ctx = avatarCanvas.getContext('2d');
    
    let isDrawing = false;
    
    function drawFrame() {
      if (avatarVideo.paused || avatarVideo.ended) {
        isDrawing = false;
        return;
      }
      
      // Ensure canvas size matches exact video size to prevent stretching or squashing
      if (avatarVideo.videoWidth > 0 && avatarCanvas.width !== avatarVideo.videoWidth) {
        avatarCanvas.width = avatarVideo.videoWidth;
        avatarCanvas.height = avatarVideo.videoHeight;
      }
      
      if (avatarCanvas.width === 0) {
        requestAnimationFrame(drawFrame);
        return;
      }
      
      // Draw video frame onto canvas
      ctx.drawImage(avatarVideo, 0, 0, avatarCanvas.width, avatarCanvas.height);
      
      // Retrieve pixel values
      const imgData = ctx.getImageData(0, 0, avatarCanvas.width, avatarCanvas.height);
      const data = imgData.data;
      const len = data.length;
      
      // Key out green background pixels
      // We set alpha to 0 for background pixels.
      for (let i = 0; i < len; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (g > 100 && g > r * 1.3 && g > b * 1.3) {
          data[i + 3] = 0;
        }
      }
      
      // Draw modified frames back to canvas
      ctx.putImageData(imgData, 0, 0);
      
      // Request next frame
      requestAnimationFrame(drawFrame);
    }
    
    avatarVideo.addEventListener('play', () => {
      if (!isDrawing) {
        isDrawing = true;
        requestAnimationFrame(drawFrame);
      }
    });
    
    avatarVideo.addEventListener('playing', () => {
      if (!isDrawing) {
        isDrawing = true;
        requestAnimationFrame(drawFrame);
      }
    });

    // Safeguard check for autoplay race condition
    if (!avatarVideo.paused && !isDrawing) {
      isDrawing = true;
      requestAnimationFrame(drawFrame);
    }
    
    // Start playback if allowed by browser policies
    avatarVideo.play().catch(err => {
      console.log("Auto-play blocked, waiting for user interaction or trigger.", err);
    });
  }

  // ==========================================================================
  // TYPING ANIMATION ENGINE (HTML-AWARE TOKENIZER)
  // ==========================================================================
  const typableElements = [];
  
  // HTML tokenizer to support <br> and other tag groupings safely during typing
  function tokenizeHtml(htmlString) {
    const tokens = [];
    let i = 0;
    while (i < htmlString.length) {
      if (htmlString[i] === '<') {
        const closeIdx = htmlString.indexOf('>', i);
        if (closeIdx !== -1) {
          tokens.push(htmlString.slice(i, closeIdx + 1));
          i = closeIdx + 1;
        } else {
          tokens.push(htmlString[i]);
          i++;
        }
      } else {
        tokens.push(htmlString[i]);
        i++;
      }
    }
    return tokens;
  }

  // Parse and cache initial content text for each story section
  sections.forEach((section, sIdx) => {
    const title = section.querySelector('.story-title');
    const desc = section.querySelector('.story-content-box p');
    
    if (title) {
      typableElements.push({
        element: title,
        tokens: tokenizeHtml(title.innerHTML.trim()),
        sectionIndex: sIdx,
        type: 'title'
      });
      title.innerHTML = ''; // Start clean
    }
    if (desc) {
      typableElements.push({
        element: desc,
        tokens: tokenizeHtml(desc.innerHTML.trim()),
        sectionIndex: sIdx,
        type: 'desc'
      });
      desc.innerHTML = ''; // Start clean
    }
  });

  const activeTypingTimers = [];

  function clearAllTyping() {
    activeTypingTimers.forEach(timer => clearTimeout(timer));
    activeTypingTimers.length = 0;
  }

  function startTypingForSection(sectionIndex) {
    clearAllTyping();

    // Reset others instantly
    typableElements.forEach(item => {
      if (item.sectionIndex !== sectionIndex) {
        item.element.innerHTML = '';
      }
    });

    // Sequence active slide: Title -> Desc
    const activeItems = typableElements.filter(item => item.sectionIndex === sectionIndex);
    const titleItem = activeItems.find(item => item.type === 'title');
    const descItem = activeItems.find(item => item.type === 'desc');

    if (titleItem) {
      typeElement(titleItem.element, titleItem.tokens, 7.5, () => {
        if (descItem) {
          typeElement(descItem.element, descItem.tokens, 1, null, 2);
        }
      }, 1);
    } else if (descItem) {
      typeElement(descItem.element, descItem.tokens, 1, null, 2);
    }
  }

  function typeElement(element, tokens, speed, onComplete, chunkSize = 1) {
    element.innerHTML = '';
    let tokenIndex = 0;

    function next() {
      if (tokenIndex < tokens.length) {
        let count = 0;
        while (tokenIndex < tokens.length && (count < chunkSize || (tokens[tokenIndex].startsWith('<') && tokens[tokenIndex].endsWith('>')))) {
          const token = tokens[tokenIndex];
          element.innerHTML += token;
          tokenIndex++;
          if (!(token.startsWith('<') && token.endsWith('>'))) {
            count++;
          }
        }
        if (tokenIndex < tokens.length) {
          const timer = setTimeout(next, speed);
          activeTypingTimers.push(timer);
        } else {
          if (onComplete) onComplete();
        }
      } else {
        if (onComplete) onComplete();
      }
    }

    next();
  }

  // Background colors matching the section themes for smooth transition transitions
  const sectionColors = ['#fdfaf4', '#faf1e3', '#fcf4ea', '#f0f4f8', '#ffffff', '#f0f3f8', '#f6f6f6'];

  // Mouse move parallax state
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  const mouseLerpFactor = 0.08;

  // Virtual Scroll State
  let targetScrollY = 0;
  let currentScrollY = 0;
  const scrollLerpFactor = 0.08; // Smooth scrolling dampening
  let activeSectionIndex = 0;

  // Touch Swipe state
  let touchStartY = 0;

  // Calculate scroll boundaries
  function updateScrollBounds() {
    const containerHeight = container.clientHeight;
    // Align current target on resize to prevent drift
    targetScrollY = activeSectionIndex * containerHeight;
    currentScrollY = targetScrollY;
  }
  window.addEventListener('resize', updateScrollBounds);
  updateScrollBounds();

  // Intercept scroll wheel and touch swipe intents for debounced snap transitions
  let isScrollingCooldown = false;
  let cooldownTimer = null;

  function startScrollCooldown() {
    isScrollingCooldown = true;
    if (cooldownTimer) clearTimeout(cooldownTimer);
    cooldownTimer = setTimeout(() => {
      isScrollingCooldown = false;
    }, 900); // 900ms matches the slide fade transition duration
  }

  // Intercept scroll wheel intents
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isScrollingCooldown) return;

    if (Math.abs(e.deltaY) > 20) {
      if (e.deltaY > 0) {
        if (activeSectionIndex < sections.length - 1) {
          scrollToSection(activeSectionIndex + 1);
          startScrollCooldown();
        }
      } else {
        if (activeSectionIndex > 0) {
          scrollToSection(activeSectionIndex - 1);
          startScrollCooldown();
        }
      }
    }
  }, { passive: false });

  // Intercept touch swipe gestures for mobile compatibility
  container.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent standard scroll bounce
    if (isScrollingCooldown) return;

    const currentTouchY = e.touches[0].clientY;
    const deltaY = touchStartY - currentTouchY;

    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) {
        if (activeSectionIndex < sections.length - 1) {
          scrollToSection(activeSectionIndex + 1);
          startScrollCooldown();
        }
      } else {
        if (activeSectionIndex > 0) {
          scrollToSection(activeSectionIndex - 1);
          startScrollCooldown();
        }
      }
      touchStartY = currentTouchY;
    }
  }, { passive: false });

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) - 0.5;
    targetMouseY = (e.clientY / window.innerHeight) - 0.5;
  });

  // Handle dot navigation clicks
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const sectionIndex = parseInt(dot.getAttribute('data-sec'), 10);
      scrollToSection(sectionIndex);
    });
  });

  // Handle header nav links based on current page
  const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
  const isProgramsPage = window.location.pathname.endsWith('programs.html');

  if (navLinks[0]) {
    navLinks[0].addEventListener('click', (e) => {
      if (isHomePage) {
        e.preventDefault();
        scrollToSection(0);
      } else {
        window.location.href = '/index.html';
      }
    });
  }

  if (navLinks[1]) {
    navLinks[1].addEventListener('click', (e) => {
      if (isProgramsPage) {
        e.preventDefault();
        scrollToSection(0);
      } else {
        window.location.href = '/programs.html';
      }
    });
  }

  // Scroll target coordinate function
  function scrollToSection(index) {
    if (sections[index]) {
      activeSectionIndex = index;
      targetScrollY = index * container.clientHeight;
    }
  }

  // Update navigation items and background colors on section change
  function updateNavigation(activeIndex) {
    // Update active index tracking
    activeSectionIndex = activeIndex;

    // Update dots
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update top links (Home link active state)
    if (navLinks[0]) {
      if (activeIndex === 0) {
        navLinks[0].classList.add('active');
      } else {
        navLinks[0].classList.remove('active');
      }
    }

    // Toggle scroll prompt visibility
    if (activeIndex > 0) {
      if (scrollPrompt) scrollPrompt.classList.add('hide');
    } else {
      if (scrollPrompt) scrollPrompt.classList.remove('hide');
    }

    // Transition parent canvas background color
    if (sectionColors[activeIndex]) {
      container.style.backgroundColor = sectionColors[activeIndex];
    }

    // Trigger typing animation for the newly active section
    startTypingForSection(activeIndex);
  }

  // ==========================================================================
  // PROGRAM CURRICULUM DATABASE & DYNAMIC RENDERER
  // ==========================================================================
  const programData = {
    idt: {
      title: "Innovation Design & Thinking",
      foundation: {
        goal: "Confidence + creativity + basic AI usage",
        output: "Idea + visual + simple prototype",
        watermark: "362",
        weeks: [
          {
            num: 1,
            title: "Creativity & Expression",
            desc: "Unlocking lateral thinking and presenting early ideas.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>`,
            sessions: [
              { title: "Session 1", text: "What is Innovation? / Invent a Crazy Product (homework robot, flying bag)." },
              { title: "Session 2", text: "Visual Creation using Canva. Poster: \"My Dream Classroom\"." },
              { title: "Session 3", text: "Speak Your Idea (1-minute pitch presentation)." }
            ]
          },
          {
            num: 2,
            title: "Idea to Visual Thinking",
            desc: "Mapping ideas into wireframes and drawing basic application interfaces.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" /><line x1="16" y1="8" x2="2" y2="22" /></svg>`,
            sessions: [
              { title: "Session 4", text: "Idea Building. Converting ideas to wireframes inside Figma." },
              { title: "Session 5", text: "Visual Design in Figma. Drawing basic screens (login, Instagram feed)." },
              { title: "Session 6", text: "Improve Your Idea. Peer reviews, feedback, and layout redesign." }
            ]
          },
          {
            num: 3,
            title: "AI + Smart Learning",
            desc: "Exploring prompt engineering, digital study aids, and building simple calculators/games.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
            sessions: [
              { title: "Session 7", text: "Introduction to AI. Prompt engineering models, image gen, character personas." },
              { title: "Session 8", text: "AI for Study. Using NotebookLM to summarize topics and design flow charts." },
              { title: "Session 9", text: "Better Questions. Using Gemini AI Studio to build snake/tic-tak-toe games." }
            ]
          },
          {
            num: 4,
            title: "Build & Present",
            desc: "Developing interactive prototypes and pitching concepts on Demo Day.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>`,
            sessions: [
              { title: "Session 10", text: "Simple App Thinking. Create simple AI-based interactive ideas in Google AI Studio." },
              { title: "Session 11", text: "Final Project Build. Constructing app concepts, posters, or visual prototypes." },
              { title: "Session 12", text: "Demo Day! Pitching and presenting ideas live to the cohort." }
            ]
          }
        ]
      },
      advanced: {
        goal: "Problem-solving + business + digital creation",
        output: "Prototype + pitch + social media + product thinking",
        watermark: "420",
        weeks: [
          {
            num: 1,
            title: "Problem & Opportunity",
            desc: "Identifying key customer problems and converting them to opportunities.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>`,
            sessions: [
              { title: "Session 1", text: "Figma Wireframing. Learning layout, alignments, and frames." },
              { title: "Session 2", text: "Figma UI Designing and creating custom infographics." },
              { title: "Session 3", text: "Prompt Engineering. Is it useful? Why?" }
            ]
          },
          {
            num: 2,
            title: "Design & Communication",
            desc: "Developing interactive screen flows and brainstorming solutions.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="12" r="1.5" /><circle cx="16" cy="12" r="1.5" /><path d="M9 16q3-1.5 6 0" /></svg>`,
            sessions: [
              { title: "Session 4", text: "Stich. App and system design flows." },
              { title: "Session 5", text: "Google AI Studio. Creating interactive slide presentations." },
              { title: "Session 6", text: "NotebookLM & Opportunity Thinking. Extracting problems, Crazy 8 paper design." }
            ]
          },
          {
            num: 3,
            title: "AI + Social Media",
            desc: "Editing promotional templates and generating video media using AI tools.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>`,
            sessions: [
              { title: "Session 7", text: "Canva editing. Graphic design layouts for media." },
              { title: "Session 8", text: "Creative concept design for social media platforms." },
              { title: "Session 9", text: "Epoxy flooring video showcasing AI-generated video workflows." }
            ]
          },
          {
            num: 4,
            title: "Build + Innovation",
            desc: "Constructing AI-integrated applications and executing final pitches.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>`,
            sessions: [
              { title: "Session 10", text: "Find your idea and outline the prototype chassis." },
              { title: "Session 11", text: "AI App/Concept Build. Creating simple AI-based helper apps in Google AI Studio." },
              { title: "Session 12", text: "Final Demo Day. Pitching prototype and launching mock marketing plan." }
            ]
          }
        ]
      }
    },
    robotics: {
      title: "Robotics & IoT",
      foundation: {
        goal: "Fun, logic building, basic AI, and virtual hardware",
        output: "Virtual circuits, simple robot commands, and interactive demos",
        watermark: "788",
        weeks: [
          {
            num: 1,
            title: "How Robots Think",
            desc: "Understanding step-by-step logic and movement mechanics.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="12" r="1.5" /><circle cx="16" cy="12" r="1.5" /><path d="M9 16q3-1.5 6 0" /></svg>`,
            sessions: [
              { title: "Session 1", text: "\"The Human Robot\" classroom maze navigation game." },
              { title: "Session 2", text: "Meet Your Digital Robot. Typing WASD keys to drive characters in Sim-1." },
              { title: "Session 3", text: "The Maze Escape. Solving 3D digital maze paths in Sim-1." }
            ]
          },
          {
            num: 2,
            title: "Smart Robots (AI)",
            desc: "Leveraging generative AI as a coding assistant and running virtual scripts.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>`,
            sessions: [
              { title: "Session 4", text: "AI as a Coding Buddy. Playing Guess the Prompt game." },
              { title: "Session 5", text: "Vibe Coding. Asking AI to generate path scripts and running them in Sim-1." },
              { title: "Session 6", text: "Robot Olympics. Jumping, dodging challenges, and winner animations." }
            ]
          },
          {
            num: 3,
            title: "Virtual Gadgets",
            desc: "Learning micro-electronics, wiring LEDs, and motors in Tinkercad.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>`,
            sessions: [
              { title: "Session 7", text: "What is a Robot's Heart? Tinkercad digital circuit deconstruction." },
              { title: "Session 8", text: "Making Things Blink. LED lights, battery wiring, and basic logic." },
              { title: "Session 9", text: "Making Things Move. Wiring virtual motors and understanding power." }
            ]
          },
          {
            num: 4,
            title: "Build & Show Off",
            desc: "Exploring sandbox tools and compiling custom robotic structures.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>`,
            sessions: [
              { title: "Session 10", text: "Combining Ideas. Exploring the Sim-2 hardware platform." },
              { title: "Session 11", text: "Lab Time. Building a virtual robot car chassis." },
              { title: "Session 12", text: "Demo Day! Presenting Tinkercad circuits and virtual robots." }
            ]
          }
        ]
      },
      advanced: {
        goal: "Real-world syntax, AI orchestration, and bridging software to physical hardware",
        output: "Python scripts, 2.5D hardware simulations, and logic optimization",
        watermark: "895",
        weeks: [
          {
            num: 1,
            title: "Ground Truth & Logic",
            desc: "Deconstructing everyday smart systems and writing logic controls in VS Code.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>`,
            sessions: [
              { title: "Session 1", text: "\"Deconstructing the Machine\". Self-driving car logic teardown." },
              { title: "Session 2", text: "Opening VS Code. Writing manual WASD control functions in Python." },
              { title: "Session 3", text: "Environment Reactions. Coding autonomous obstacle responses." }
            ]
          },
          {
            num: 2,
            title: "The Orchestrator Era",
            desc: "Compiling complex AI pathfinding scripts and running them inside game simulators.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>`,
            sessions: [
              { title: "Session 4", text: "Shifting to \"Vibe Coding\" with Gemini AI script dictation." },
              { title: "Session 5", text: "The \"Code Dump\" Workflow. Compiling and loading AI scripts into Sim-1." },
              { title: "Session 6", text: "Adventure Testing. crouch, jump, and evasive maneuver challenges." }
            ]
          },
          {
            num: 3,
            title: "Digital-Physical Bridge",
            desc: "Entering 2.5D lab environments to wire MicroPython ESP32 controllers.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>`,
            sessions: [
              { title: "Session 7", text: "Entering Sim-2 (isometric lab wires and components sandbox)." },
              { title: "Session 8", text: "Brains & Brawn. Setting up ESP32 with MicroPython and motor drives." },
              { title: "Session 9", text: "Environmental Testing. Puzzles and Onshape model imports in Sim-2." }
            ]
          },
          {
            num: 4,
            title: "Simulation to Reality",
            desc: "Rating logic performance and sketching initial 3D chassis builds.",
            icon: `<svg viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>`,
            sessions: [
              { title: "Session 10", text: "Performance & PvP. Rating logic and command efficiency." },
              { title: "Session 11", text: "The Teaser. Sketching virtual chassis and 3D space layouts." },
              { title: "Session 12", text: "Demo Day! Pitching ESP32 wiring, Sim-2 rigs, and MicroPython scripts." }
            ]
          }
        ]
      }
    }
  };

  let currentProgram = 'idt';
  let currentLevel = 'foundation';

  // Infinitely looping robot suspension drift/hover
  if (document.getElementById('robot-car')) {
    gsap.to("#robot-car", {
      y: "-=2",
      repeat: -1,
      yoyo: true,
      duration: 0.35,
      ease: "sine.inOut"
    });
  }

  // Track the GSAP timeline instance for hot reloads / tab switches
  let journeyTimeline = null;

  function createGlowParticles(element) {
    const parent = element;
    const rect = parent.getBoundingClientRect();
    const particleCount = 12;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'glow-particle';
      particle.style.left = `${rect.width / 2}px`;
      particle.style.top = `${rect.height / 2}px`;
      parent.appendChild(particle);
      
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 70;
      const destX = Math.cos(angle) * distance;
      const destY = Math.sin(angle) * distance;
      
      gsap.to(particle, {
        x: destX,
        y: destY,
        opacity: 0,
        scale: 0.1,
        duration: 0.8 + Math.random() * 0.4,
        ease: "power2.out",
        onComplete: () => {
          particle.remove();
        }
      });
    }
  }

  function autoCollapsePopovers(activeWeekNum) {
    const cards = document.querySelectorAll('.milestone-card');
    cards.forEach(card => {
      if (!card.classList.contains(`week-card-${activeWeekNum}`)) {
        card.classList.remove('mobile-open');
      }
    });
  }

  function updateProgressRing(progress) {
    const offset = 163.36 * (1 - progress);
    const ringActive = document.querySelector('.progress-ring-active');
    const textEl = document.querySelector('.progress-ring-text');
    if (ringActive) ringActive.style.strokeDashoffset = offset;
    if (textEl) textEl.textContent = `${Math.round(progress * 100)}%`;
  }

  function renderCurriculum() {
    const data = programData[currentProgram][currentLevel];
    
    // Update goal & output & watermark
    const goalEl = document.getElementById('curriculum-goal');
    const outputEl = document.getElementById('curriculum-output');
    const watermarkEl = document.getElementById('program-watermark');
    if (goalEl) goalEl.textContent = data.goal;
    if (outputEl) outputEl.textContent = data.output;
    if (watermarkEl) watermarkEl.textContent = data.watermark;

    // Render cards
    const container = document.getElementById('curriculum-weeks-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    data.weeks.forEach(week => {
      const item = document.createElement('div');
      item.className = `curriculum-week-item week-type-${week.num % 2 === 0 ? 'even' : 'odd'} pos-week-${week.num}`;
      
      let sessionsHtml = '';
      week.sessions.forEach(session => {
        sessionsHtml += `
          <div class="session-item">
            <h5>${session.title}</h5>
            <p>${session.text}</p>
          </div>
        `;
      });

      const achievementsMap = {
        1: { icon: '💡', title: 'Idea Generator' },
        2: { icon: '🎨', title: 'Design Thinker' },
        3: { icon: '🤖', title: 'AI Explorer' },
        4: { icon: '⚙️', title: 'Systems Builder' }
      };
      
      const badge = achievementsMap[week.num];

      item.innerHTML = `
        <div class="milestone-card week-card-${week.num}" id="milestone-card-${week.num}" tabindex="0">
          <div class="achievement-badge">
            <span class="badge-icon">${badge.icon}</span>
            <span class="badge-title">${badge.title}</span>
          </div>
          <span class="milestone-indicator">Week 0${week.num}</span>
          <h4 class="milestone-title">${week.title}</h4>
          <p class="milestone-desc">${week.desc}</p>
          
          <div class="milestone-meta">
            <span class="meta-tag">Estimated Time: 3 Hours</span>
            <span class="completion-indicator">Locked</span>
          </div>

          <!-- Mobile Accordion Trigger -->
          <button class="mobile-session-trigger" aria-label="Toggle sessions">
            <span>View Sessions</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          
          <div class="week-popover">
            <div class="week-sessions-title">Weekly Sessions</div>
            <div class="week-sessions-list">
              ${sessionsHtml}
            </div>
          </div>
        </div>
      `;
      
      container.appendChild(item);
    });

    // Add click events and keyboard triggers
    const milestoneCards = container.querySelectorAll('.milestone-card');
    milestoneCards.forEach(card => {
      const trigger = card.querySelector('.mobile-session-trigger');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.stopPropagation();
          card.classList.toggle('mobile-open');
        });
      }
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('mobile-open');
        }
      });
    });

    // Clean up existing GSAP scroll triggers for this container
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.id && trigger.vars.id.startsWith('timeline-')) {
        trigger.kill();
      }
    });

    if (journeyTimeline) {
      journeyTimeline.kill();
      journeyTimeline = null;
    }

    // Set up GSAP plugins
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

    // Initial SVG Path setting
    const pathActive = document.getElementById('journey-active-path');
    const pathActiveGlow = document.getElementById('journey-active-path-glow');
    if (pathActive && pathActiveGlow) {
      const pathLength = pathActive.getTotalLength();
      gsap.set([pathActive, pathActiveGlow], { strokeDasharray: pathLength, strokeDashoffset: pathLength });

      // Main scrub timeline
      journeyTimeline = gsap.timeline({
        scrollTrigger: {
          id: "timeline-scrub",
          trigger: ".curriculum-journey-container",
          scroller: "#overlay-programs",
          start: "top 35%",
          end: "bottom 85%",
          scrub: 0.5
        }
      });

      // 1. Draw SVG Active Path
      journeyTimeline.to([pathActive, pathActiveGlow], {
        strokeDashoffset: 0,
        ease: "none"
      }, 0);

      // 2. Robot Car Motion Path
      journeyTimeline.to("#robot-car", {
        motionPath: {
          path: "#journey-track-path",
          align: "#journey-track-path",
          alignOrigin: [0.5, 0.5],
          autoRotate: true
        },
        ease: "none"
      }, 0);

      // 3. Wheel rotation
      journeyTimeline.to(".robot-wheel", {
        rotation: 720,
        ease: "none"
      }, 0);
    }

    // Progress scroller trigger
    ScrollTrigger.create({
      id: "timeline-progress",
      trigger: ".curriculum-journey-container",
      scroller: "#overlay-programs",
      start: "top 35%",
      end: "bottom 85%",
      onUpdate: (self) => {
        updateProgressRing(self.progress);
      }
    });

    // Staggered card triggers and state updates
    const cardsList = [
      { num: 0, selector: ".start-card", nodeSelector: ".start-node" },
      { num: 1, selector: "#milestone-card-1", nodeSelector: ".week-node-1" },
      { num: 2, selector: "#milestone-card-2", nodeSelector: ".week-node-2" },
      { num: 3, selector: "#milestone-card-3", nodeSelector: ".week-node-3" },
      { num: 4, selector: "#milestone-card-4", nodeSelector: ".week-node-4" },
      { num: 5, selector: "#milestone-prototype-card", nodeSelector: ".prototype-node" },
      { num: 6, selector: "#milestone-completion-card", nodeSelector: ".finish-node" }
    ];

    cardsList.forEach(item => {
      const cardEl = document.querySelector(item.selector);
      const nodeEl = document.querySelector(item.nodeSelector);
      if (cardEl) {
        ScrollTrigger.create({
          id: `timeline-reveal-${item.num}`,
          trigger: cardEl,
          scroller: "#overlay-programs",
          start: "top 85%",
          onEnter: () => cardEl.classList.add('reveal'),
          onLeaveBack: () => cardEl.classList.remove('reveal')
        });

        if (nodeEl) {
          ScrollTrigger.create({
            id: `timeline-state-${item.num}`,
            trigger: nodeEl,
            scroller: "#overlay-programs",
            start: "top 60%",
            onEnter: () => {
              cardEl.classList.add('active-milestone', 'unlocked');
              nodeEl.classList.add('active');
              if (item.num > 0) {
                const indicator = cardEl.querySelector('.completion-indicator');
                if (indicator) indicator.textContent = 'Completed';

                for (let i = 0; i < item.num; i++) {
                  const prevNode = document.querySelector(cardsList[i].nodeSelector);
                  const prevCard = document.querySelector(cardsList[i].selector);
                  if (prevNode) prevNode.classList.add('completed');
                  if (prevCard) {
                    const prevInd = prevCard.querySelector('.completion-indicator');
                    if (prevInd) prevInd.textContent = 'Completed';
                  }
                }
                autoCollapsePopovers(item.num);
                createGlowParticles(cardEl);
              }
            },
            onLeaveBack: () => {
              cardEl.classList.remove('active-milestone', 'unlocked');
              nodeEl.classList.remove('active', 'completed');
              if (item.num > 0) {
                const indicator = cardEl.querySelector('.completion-indicator');
                if (indicator) indicator.textContent = 'Locked';
              }
            }
          });
        }
      }
    });

    // Refresh ScrollTrigger to recalculate DOM heights
    ScrollTrigger.refresh();
  }

  // Hook filters
  const progBtns = document.querySelectorAll('.prog-select-btn');
  const lvlBtns = document.querySelectorAll('.level-select-btn');

  progBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      progBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentProgram = btn.getAttribute('data-program');
      renderCurriculum();
    });
  });

  lvlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      lvlBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLevel = btn.getAttribute('data-level');
      renderCurriculum();
    });
  });

  // Initial render when script loads
  renderCurriculum();

  // ==========================================================================
  // About Page Scroll Parallax & Live Illustrations
  const aboutOverlay = document.querySelector('.about-layout');
  if (aboutOverlay) {
    const bioHeading = aboutOverlay.querySelector('.bio-heading');
    const bioNav = aboutOverlay.querySelector('.bio-nav');
    const markOpen = aboutOverlay.querySelector('.mark-open');
    const markClose = aboutOverlay.querySelector('.mark-close');
    const quoteText = aboutOverlay.querySelector('.quote-text');
    const teamHeroTexts = aboutOverlay.querySelectorAll('.about-hero-text');
    const teamHeroImages = aboutOverlay.querySelectorAll('.about-hero-image');
    const visionaryImgs = aboutOverlay.querySelectorAll('.visionary-img');
    const achievementCols = aboutOverlay.querySelectorAll('.achievement-col');
    
    // Background Glow Blobs
    // Background Glow Blobs
    const blob1 = aboutOverlay.querySelector('.blob-1');
    const blob2 = aboutOverlay.querySelector('.blob-2');
    const blob3 = aboutOverlay.querySelector('.blob-3');

    // Navigation Links
    const bioNavLinks = aboutOverlay.querySelectorAll('.bio-nav-link');

    // Hook up clicks for Bio Navigation Links
    bioNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          // Smooth scroll within the overlay panel
          window.scrollTo({
            top: targetSection.offsetTop - 120, // offset for visual breathing room
            behavior: 'smooth'
          });
        }
      });
    });

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const overlayHeight = window.innerHeight;

      // 1. Update Bio Nav active link state based on scroll section visibility
      const bioSection = document.getElementById('about-bio');
      const teamSection = document.getElementById('about-team');
      const achievementsSection = document.getElementById('about-achievements');

      if (bioSection && teamSection && achievementsSection) {
        const teamRect = teamSection.getBoundingClientRect();
        const achievementsRect = achievementsSection.getBoundingClientRect();

        let activeTarget = 'about-bio';
        const triggerThreshold = overlayHeight * 0.4;

        if (achievementsRect.top < triggerThreshold) {
          activeTarget = 'about-achievements';
        } else if (teamRect.top < triggerThreshold) {
          activeTarget = 'about-team';
        }

        bioNavLinks.forEach(link => {
          if (link.getAttribute('data-target') === activeTarget) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }

      // 2. Parallax background blur blobs displacement
      if (blob1) blob1.style.transform = `translate3d(${scrollTop * -0.15}px, ${scrollTop * 0.08}px, 0)`;
      if (blob2) blob2.style.transform = `translate3d(${scrollTop * 0.12}px, ${scrollTop * -0.18}px, 0)`;
      if (blob3) blob3.style.transform = `translate3d(${scrollTop * -0.08}px, ${scrollTop * 0.12}px, 0)`;

      if (scrollTop > 0) {
        // 3. Bio Heading parallax (slides right slowly)
        if (bioHeading) {
          bioHeading.style.transform = `translate3d(${scrollTop * 0.12}px, 0, 0)`;
        }

        // 4. Left side bio nav drift (slides down slowly)
        if (bioNav) {
          bioNav.style.transform = `translate3d(0, ${scrollTop * 0.06}px, 0)`;
        }

        // 5. Quote Marks parallax (drift apart horizontally and vertically)
        if (markOpen) {
          markOpen.style.transform = `translate3d(${scrollTop * -0.06}px, ${scrollTop * -0.03}px, 0)`;
        }
        if (markClose) {
          markClose.style.transform = `translate3d(${scrollTop * 0.06}px, ${scrollTop * 0.03}px, 0)`;
        }

        // 6. Quote Text translation (slides up slightly faster)
        if (quoteText) {
          quoteText.style.transform = `translate3d(0, ${scrollTop * 0.02}px, 0)`;
        }



        // 9. Achievement Columns staggered alternating float
        achievementCols.forEach((col, idx) => {
          const achievementsSection = document.getElementById('about-achievements');
          if (achievementsSection) {
            const achievementsRect = achievementsSection.getBoundingClientRect();
            // Drift shifts when Achievements section is entering the view
            if (achievementsRect.top < overlayHeight) {
              const enterProgress = (overlayHeight - achievementsRect.top);
              const drift = (idx % 2 === 0) ? enterProgress * 0.06 : enterProgress * -0.06;
              col.style.transform = `translate3d(0, ${drift}px, 0)`;
            } else {
              col.style.transform = "";
            }
          }
        });
      } else {
        // Clear styles when at top to preserve entrance transitions
        if (bioHeading) bioHeading.style.transform = "";
        if (bioNav) bioNav.style.transform = "";
        if (markOpen) markOpen.style.transform = "";
        if (markClose) markClose.style.transform = "";
        if (quoteText) quoteText.style.transform = "";
        teamHeroTexts.forEach(el => el.style.transform = "");
        teamHeroImages.forEach(el => el.style.transform = "");
        visionaryImgs.forEach(el => el.style.transform = "");
        achievementCols.forEach(col => col.style.transform = "");
      }
    });

    // ==========================================================================
    // TEAM HORIZONTAL SLIDER
    // ==========================================================================
    const sliderTrack = aboutOverlay.querySelector('.team-slider-track');
    const sliderDots = aboutOverlay.querySelectorAll('.slider-dot');
    const prevArrow = aboutOverlay.querySelector('.prev-arrow');
    const nextArrow = aboutOverlay.querySelector('.next-arrow');
    const slides = aboutOverlay.querySelectorAll('.team-slide');

    if (sliderTrack && slides.length > 0) {
      let activeSlideIndex = 0;

      const updateSliderUI = (index) => {
        activeSlideIndex = index;
        sliderDots.forEach((dot, idx) => {
          if (idx === index) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });

        // Add active-slide class to current slide for newspaper animations
        slides.forEach((slide, idx) => {
          if (idx === index) {
            slide.classList.add('active-slide');
          } else {
            slide.classList.remove('active-slide');
            // Reset inline transform styles on inactive slides to prevent layout drift
            const bgName = slide.querySelector('.team-bg-name');
            const portrait = slide.querySelector('.about-hero-image');
            const leftCol = slide.querySelector('.team-slide-left');
            const rightCol = slide.querySelector('.team-slide-right');
            const slideHeader = slide.querySelector('.team-slide-header');
            if (bgName) bgName.style.transform = "";
            if (portrait) portrait.style.transform = "";
            if (leftCol) leftCol.style.transform = "";
            if (rightCol) rightCol.style.transform = "";
            if (slideHeader) slideHeader.style.transform = "";
          }
        });
      };

      const scrollToSlide = (index) => {
        if (index >= 0 && index < slides.length) {
          const slideWidth = slides[index].offsetWidth;
          sliderTrack.scrollTo({
            left: index * slideWidth,
            behavior: 'smooth'
          });
          updateSliderUI(index);
        }
      };

      // Initialize slide 0 active classes
      updateSliderUI(0);

      sliderDots.forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.getAttribute('data-index'), 10);
          scrollToSlide(index);
        });
      });

      if (prevArrow) {
        prevArrow.addEventListener('click', () => {
          let index = activeSlideIndex - 1;
          if (index < 0) index = slides.length - 1; // loop back
          scrollToSlide(index);
        });
      }

      if (nextArrow) {
        nextArrow.addEventListener('click', () => {
          let index = activeSlideIndex + 1;
          if (index >= slides.length) index = 0; // loop back
          scrollToSlide(index);
        });
      }

      // Handle swipe scroll snaps to update dots dynamically
      let scrollTimeout;
      sliderTrack.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const slideWidth = slides[0].offsetWidth;
          if (slideWidth > 0) {
            const currentScrollLeft = sliderTrack.scrollLeft;
            const index = Math.round(currentScrollLeft / slideWidth);
            if (index !== activeSlideIndex && index >= 0 && index < slides.length) {
              updateSliderUI(index);
            }
          }
        }, 100);
      });

      // Handle resize adjustments
      window.addEventListener('resize', () => {
        scrollToSlide(activeSlideIndex);
      });
    }
  }

  function handleRouting() {
    const hash = window.location.hash;
    overlays.forEach(overlay => overlay.classList.remove('active'));
    if (hashOverlayMap[hash]) {
      openOverlay(hashOverlayMap[hash]);
    }
  }

  window.addEventListener('hashchange', handleRouting);
  if (window.location.hash) {
    handleRouting();
  }

  // ==========================================================================
  // CERTIFICATE VERIFICATION FORM (Connected to SQLite DB via Next.js API)
  // ==========================================================================
  const certInput = document.getElementById('cert-input');
  const certBtn = document.getElementById('cert-btn');
  const certResult = document.getElementById('cert-result');
  const certError = document.getElementById('cert-error');
  const certHolder = document.getElementById('cert-holder');
  const certCourse = document.getElementById('cert-course');
  const certDate = document.getElementById('cert-date');
  const certIdVal = document.getElementById('cert-id-val');

  async function verifyCertificate() {
    const query = certInput.value.trim().toUpperCase();
    if (!query) return;

    try {
      // Show dynamic loading or reset state
      certBtn.disabled = true;
      const originalText = certBtn.innerHTML;
      certBtn.innerHTML = '<span class="btn-text">Checking...</span>';

      const res = await fetch(`/api/verify/${query}`);
      
      certBtn.disabled = false;
      certBtn.innerHTML = originalText;

      if (res.ok) {
        const certificate = await res.json();
        
        // Format the issue date to e.g. "June 2026"
        const dateObj = new Date(certificate.issueDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric'
        });

        certHolder.textContent = certificate.recipientName;
        certCourse.textContent = certificate.courseTitle;
        certDate.textContent = formattedDate;
        certIdVal.textContent = certificate.credentialCode;

        certError.style.display = 'none';
        certResult.classList.add('show');
      } else {
        certResult.classList.remove('show');
        certError.style.display = 'block';
      }
    } catch (error) {
      console.error("Verification failed:", error);
      certBtn.disabled = false;
      certResult.classList.remove('show');
      certError.style.display = 'block';
    }
  }

  if (certBtn && certInput) {
    certBtn.addEventListener('click', verifyCertificate);
    certInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        verifyCertificate();
      }
    });
  }

  // Note: Book a Demo page interactions are completely isolated in /js/demo.js

  // ==========================================================================
  // FAQ ACCORDION TOGGLE ENGINE
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const summary = item.querySelector('.faq-summary');
    if (summary) {
      summary.addEventListener('click', (e) => {
        const isOpen = item.classList.contains('open');

        // Close all other accordion items
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('open');
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('open');
        } else {
          item.classList.add('open');
        }
      });
    }
  });



  // ==========================================================================
  // PARALLAX ANIMATION TICK LOOP
  // ==========================================================================
  function tick() {
    // 1. Lerp mouse values
    mouseX += (targetMouseX - mouseX) * mouseLerpFactor;
    mouseY += (targetMouseY - mouseY) * mouseLerpFactor;

    // 2. Lerp virtual scroll positions
    currentScrollY += (targetScrollY - currentScrollY) * scrollLerpFactor;
    const containerHeight = container.clientHeight;


    // Determine target index closest to current progression float
    const targetIndex = Math.max(0, Math.min(sections.length - 1, Math.round(currentScrollY / containerHeight)));

    // 3. Update sections (toggle active slides and compute inline transitions)
    sections.forEach((section, index) => {
      const sectionOffset = index * containerHeight;
      const progress = (currentScrollY - sectionOffset) / containerHeight;

      // Animate visible sections (within close progression boundary [-1.2, 1.2])
      if (progress >= -1.2 && progress <= 1.2) {
        section.style.setProperty('--section-progress', progress);

        // A. Slide giant background watermarks horizontally
        const watermark = section.querySelector('.watermark-bg');
        if (watermark) {
          const wmSpeed = parseFloat(watermark.getAttribute('data-speed')) || 0.2;
          // As we scroll down, progress goes from -1 to 0 to 1, sliding text to the left
          const wmTranslateX = progress * -320 * wmSpeed;
          watermark.style.transform = `translate3d(calc(-50% + ${wmTranslateX}px), -50%, 0)`;
        }

        // B. Add subtle mouse move shifts to the story text box for layered parallax depth
        const contentBox = section.querySelector('.story-content-box');
        if (contentBox && Math.abs(progress) < 0.2) {
          const contentX = mouseX * -20;
          const contentY = mouseY * -10;
          contentBox.style.transform = `translate3d(${contentX}px, ${contentY}px, 0)`;
        }

        // B2. If Chapter 1 (index 0) - Animate Video Avatar with 3D mouse parallax
        if (index === 0 && Math.abs(progress) < 0.2) {
          const avatarContainer = section.querySelector('.hero-avatar-container');
          if (avatarContainer) {
            const avatarX = mouseX * 30;
            const avatarY = mouseY * 15;
            avatarContainer.style.transform = `translate3d(calc(-50% + ${avatarX}px), calc(-50% + ${avatarY}px), 0)`;
          }
        }

        // C. Animate Opposing Parallax Columns for Gallery Showcase
        if (section.id === 'gallery' || index === 3) {
          const colLeft = section.querySelector('.col-left');
          const colRight = section.querySelector('.col-right');
          if (colLeft && colRight) {
            const leftY = -40 + (progress * -180);
            const rightY = 40 + (progress * 180);
            colLeft.style.transform = `translate3d(0, ${leftY}px, 0)`;
            colRight.style.transform = `translate3d(0, ${rightY}px, 0)`;
          }
        }

        // D. Animate Mockup Card 3D tilt, image parallax, and badges
        if (section.id === 'myna-tribe' || index === 5) {
          const mockupCard = section.querySelector('.myna-section-body');
          const cardImg = section.querySelector('.myna-card-img');
          const badgeLeft = section.querySelector('.myna-floating-badge.badge-left');
          const badgeRight = section.querySelector('.myna-floating-badge.badge-right');

          // 3D Card tilt and scroll parallax
          if (mockupCard) {
            const scrollY = progress * -150;
            const tiltX = mouseY * -8;
            const tiltY = mouseX * 8;
            const shiftX = mouseX * 10;
            const shiftY = mouseY * 5;
            const scale = 1 - Math.abs(progress) * 0.05;
            const opacity = Math.max(0, 1 - Math.abs(progress) * 1.5);

            mockupCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${shiftX}px, calc(${scrollY}px + ${shiftY}px), 0) scale(${scale})`;
            mockupCard.style.opacity = opacity;
          }

          // Image scroll and mouse move parallax
          if (cardImg && Math.abs(progress) < 0.3) {
            const imgMouseX = mouseX * -25;
            const imgMouseY = mouseY * -15;
            // Mixed percentage translation for dynamic responsive crop and scroll parallax (centered horizontally)
            cardImg.style.transform = `translate3d(calc(-50% + ${imgMouseX}px), calc(${progress * -4}% + ${imgMouseY}px), 0) scale(1.02)`;
          }

          // Floating badges parallax depth
          if (badgeLeft && Math.abs(progress) < 0.3) {
            const badgeScrollY = progress * -50;
            const badgeMouseX = mouseX * 18;
            const badgeMouseY = mouseY * 8;
            badgeLeft.style.transform = `translate3d(${badgeMouseX}px, calc(${badgeScrollY}px + ${badgeMouseY}px), 0)`;
          }
          if (badgeRight && Math.abs(progress) < 0.3) {
            const badgeScrollY = progress * -70;
            const badgeMouseX = mouseX * 22;
            const badgeMouseY = mouseY * 10;
            badgeRight.style.transform = `translate3d(${badgeMouseX}px, calc(${badgeScrollY}px + ${badgeMouseY}px), 0)`;
          }
        }
      }
    });

    // E. Team Slider 3D mouse move layered parallax depth (smooth off-center drift)
    const overlayAbout = document.getElementById('overlay-about');
    if (overlayAbout && overlayAbout.classList.contains('active')) {
      const activeSlide = overlayAbout.querySelector('.team-slide.active-slide');
      if (activeSlide) {
        const bgName = activeSlide.querySelector('.team-bg-name');
        const portrait = activeSlide.querySelector('.about-hero-image');
        const leftCol = activeSlide.querySelector('.team-slide-left');
        const rightCol = activeSlide.querySelector('.team-slide-right');
        const slideHeader = activeSlide.querySelector('.team-slide-header');

        if (bgName) {
          bgName.style.transform = `translate3d(${mouseX * -32}px, ${mouseY * -16}px, 0)`;
        }
        if (portrait) {
          portrait.style.transform = `translate3d(${mouseX * 24}px, ${mouseY * 12}px, 0)`;
        }
        if (leftCol) {
          leftCol.style.transform = `translate3d(${mouseX * 12}px, ${mouseY * 6}px, 0)`;
        }
        if (rightCol) {
          rightCol.style.transform = `translate3d(${mouseX * 10}px, ${mouseY * 5}px, 0)`;
        }
        if (slideHeader) {
          slideHeader.style.transform = `translate3d(${mouseX * -6}px, ${mouseY * -3}px, 0)`;
        }
      }
    }

    // F. Program Page (Curriculum Overlay) 3D mouse move layered parallax depth
    const overlayPrograms = document.getElementById('overlay-programs');
    if (overlayPrograms && overlayPrograms.classList.contains('active')) {
      const watermark = overlayPrograms.querySelector('.program-watermark-bg');
      if (watermark) {
        watermark.style.transform = `translate3d(calc(-50% + ${mouseX * -60}px), calc(-50% + ${mouseY * -30}px), 0)`;
      }
      
      const cards = overlayPrograms.querySelectorAll('.curriculum-week-item');
      cards.forEach((card, idx) => {
        const factor = (idx % 2 === 0) ? 14 : -14;
        const cardX = mouseX * factor;
        const cardY = mouseY * (factor * 0.5);
        card.style.setProperty('--card-parallax-x', `${cardX}px`);
        card.style.setProperty('--card-parallax-y', `${cardY}px`);
      });
      
      const pBlob1 = overlayPrograms.querySelector('.p-blob-1');
      const pBlob2 = overlayPrograms.querySelector('.p-blob-2');
      if (pBlob1) pBlob1.style.transform = `translate3d(${mouseX * 40}px, ${mouseY * 40}px, 0)`;
      if (pBlob2) pBlob2.style.transform = `translate3d(${mouseX * -40}px, ${mouseY * -40}px, 0)`;
    }

    // 4. Update section active classes and dots navigation
    if (activeSectionIndex !== targetIndex) {
      updateNavigation(targetIndex);
    }

    sections.forEach((section, index) => {
      if (index === activeSectionIndex) {
        if (!section.classList.contains('active')) {
          section.classList.add('active');
        }
      } else {
        section.classList.remove('active');
      }
    });

    requestAnimationFrame(tick);
  }

  // Kick off animation loop
  requestAnimationFrame(tick);

  // Initial update
  updateNavigation(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCredibleCreate);
} else {
  // Add a small delay to ensure React has fully mounted the DOM elements
  // when the script is lazy-loaded after interactive
  setTimeout(initCredibleCreate, 100);
}



/* ==========================================================================
   GALLERY HORIZONTAL VIRTUAL SCROLL & LIGHTBOX ENGINE
   ========================================================================== */
function initGalleryHorizontalScroll() {
  const container = document.getElementById('gallery-scroll-wrapper');
  if (!container) return; // Not on horizontal gallery page

  const sections = document.querySelectorAll('.gallery-story-section');
  const dots = document.querySelectorAll('.side-nav-dot');
  const scrollThumb = document.getElementById('horizontal-scroll-thumb');
  const prevBtn = document.getElementById('horizontal-prev');
  const nextBtn = document.getElementById('horizontal-next');
  const sectionColors = ['#fdfaf4', '#faf1e3', '#fcf4ea', '#f0f4f8', '#ffffff', '#f0f3f8', '#f6f6f6'];

  let activeIndex = 0;
  let isCooldown = false;
  let cooldownTimer = null;

  function startCooldown() {
    isCooldown = true;
    if (cooldownTimer) clearTimeout(cooldownTimer);
    cooldownTimer = setTimeout(() => {
      isCooldown = false;
    }, 700);
  }

  function goToGallerySection(index) {
    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;
    activeIndex = index;

    container.style.transform = `translateX(-${activeIndex * 100}vw)`;

    sections.forEach((sec, idx) => {
      if (idx === activeIndex) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    if (scrollThumb) {
      scrollThumb.style.transform = `translateX(${activeIndex * 100}%)`;
    }

    if (sectionColors[activeIndex]) {
      container.style.backgroundColor = sectionColors[activeIndex];
    }
  }

  // Wheel listener
  window.addEventListener('wheel', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) return;

    if (isCooldown) return;

    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (Math.abs(delta) > 20) {
      if (delta > 0) {
        if (activeIndex < sections.length - 1) {
          goToGallerySection(activeIndex + 1);
          startCooldown();
        }
      } else {
        if (activeIndex > 0) {
          goToGallerySection(activeIndex - 1);
          startCooldown();
        }
      }
    }
  }, { passive: true });

  // Touch Swipe
  let touchStartX = 0;
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) return;

    if (isCooldown) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        if (activeIndex < sections.length - 1) {
          goToGallerySection(activeIndex + 1);
          startCooldown();
        }
      } else {
        if (activeIndex > 0) {
          goToGallerySection(activeIndex - 1);
          startCooldown();
        }
      }
    }
  }, { passive: true });

  // Keyboard Arrow Keys
  window.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
      }
      return;
    }

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (activeIndex < sections.length - 1) {
        goToGallerySection(activeIndex + 1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (activeIndex > 0) {
        goToGallerySection(activeIndex - 1);
      }
    }
  });

  // Dots & Control buttons
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-sec'), 10);
      goToGallerySection(idx);
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToGallerySection(activeIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToGallerySection(activeIndex + 1);
    });
  }

  // Filter Buttons Jump Handler
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetSec = parseInt(btn.getAttribute('data-target-sec') || '1', 10);
      goToGallerySection(targetSec);
    });
  });

  // Lightbox Handler
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxClose = document.getElementById('lightbox-close');

  const galleryCards = document.querySelectorAll('.gallery-showcase-card');
  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.gallery-showcase-img');
      const title = card.querySelector('.gallery-showcase-title');
      const desc = card.querySelector('.gallery-showcase-desc');
      const badge = card.querySelector('.gallery-showcase-badge');

      if (lightboxImg && img) lightboxImg.src = img.src;
      if (lightboxTitle && title) lightboxTitle.textContent = title.textContent;
      if (lightboxDesc && desc) lightboxDesc.textContent = desc.textContent;
      if (lightboxBadge && badge) lightboxBadge.textContent = badge.textContent;

      if (lightbox) lightbox.classList.add('active');
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightbox) lightbox.classList.remove('active');
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });
  }

  // Init initial slide
  goToGallerySection(0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGalleryHorizontalScroll);
} else {
  setTimeout(initGalleryHorizontalScroll, 150);
}

// Global Get In Touch Form Handler
window.handleGetInTouchSubmit = async function(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnText = submitBtn ? (submitBtn.querySelector('.btn-text') || submitBtn) : null;
  const originalText = btnText ? btnText.textContent : 'SEND MESSAGE';

  const nameInput = form.querySelector('input[type="text"]') || form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[type="email"]') || form.querySelector('input[name="email"]');
  const phoneInput = form.querySelector('input[type="tel"]') || form.querySelector('input[name="phone"]');
  const messageInput = form.querySelector('textarea') || form.querySelector('textarea[name="message"]');

  const payload = {
    name: nameInput ? nameInput.value.trim() : '',
    email: emailInput ? emailInput.value.trim() : '',
    phone: phoneInput ? phoneInput.value.trim() : '',
    message: messageInput ? messageInput.value.trim() : '',
    timestamp: new Date().toISOString()
  };

  if (!payload.name || !payload.email) {
    alert('Please enter your name and email address.');
    return;
  }

  try {
    if (submitBtn) submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'SENDING...';

    // 1. Send to backend endpoint
    fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.warn('Backend contact submission notice:', err));

    // 2. Send to Google Apps Script endpoint
    const appsScriptUrl = (window.APP_CONFIG && window.APP_CONFIG.GET_IN_TOUCH_APPS_SCRIPT_URL)
      || 'https://script.google.com/macros/s/AKfycbySqk-atOfR5qUor5tGSE50ETRHmN18Tbr80r9ib0FO9mXzG0ZNNnd6igLv_to7wYSS1w/exec';

    if (appsScriptUrl) {
      await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).catch(err => console.warn('Apps Script contact submission notice:', err));
    }

    alert('Thank you for your message! We will get back to you shortly.');
    form.reset();
  } catch (error) {
    console.error('Submission error:', error);
    alert('Thank you! Your message has been sent successfully.');
    form.reset();
  } finally {
    if (submitBtn) submitBtn.disabled = false;
    if (btnText) btnText.textContent = originalText;
  }
};


