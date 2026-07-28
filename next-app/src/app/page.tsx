
"use client";
import React from 'react';
import Link from 'next/link';
import ChromaKeyVideo from "@/components/ChromaKeyVideo";

export default function Page() {
  return (
    <>
      <div className="bg-grid-lines">
        <div className="grid-line grid-line-v1"></div>
        <div className="grid-line grid-line-v2"></div>
        <div className="grid-line grid-line-v3"></div>
      </div>

      <header>
        <a href="#" className="logo" id="logo-link">
          <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7" />
            <polygon points="2 7 12 12 12 22 2 17" />
            <polygon points="12 12 22 7 22 17 12 22" />
          </svg>
          <span>CREDIBLE // CREATE</span>
        </a>
        <nav>
          <ul>
            <li><a className="nav-link active" data-sec="0">Home</a></li>
            <li><a className="overlay-trigger" data-target="overlay-programs">Programs</a></li>
            <li><a className="overlay-trigger" data-target="overlay-about">About</a></li>
            <li><a className="overlay-trigger" data-target="overlay-projects">Projects & FAQ</a></li>
            <li><a className="overlay-trigger" data-target="overlay-verify">Verify Portal</a></li>
            <li><Link href="/blog" className="nav-link">Blog</Link></li>
            <li><a className="overlay-trigger btn btn-primary" data-target="overlay-demo"
                style={{ padding: "0.45rem 1.25rem", fontSize: "0.65rem" }}><span className="btn-text">Book Demo</span></a></li>
          </ul>
        </nav>
      </header>

      <div className="side-nav" aria-label="Story chapters">
        <button className="side-nav-dot active" data-sec="0" aria-label="Chapter 1: The Spark"></button>
        <button className="side-nav-dot" data-sec="1" aria-label="Chapter 2: Bot Barracks"></button>
        <button className="side-nav-dot" data-sec="2" aria-label="Chapter 3: Tech Labs"></button>
        <button className="side-nav-dot" data-sec="3" aria-label="Chapter 4: Sanctuary"></button>
        <button className="side-nav-dot" data-sec="4" aria-label="Chapter 5: Gallery"></button>
        <button className="side-nav-dot" data-sec="5" aria-label="Chapter 6: Myna UI"></button>
        <button className="side-nav-dot" data-sec="6" aria-label="Chapter 7: Footer"></button>
      </div>

      <main className="scroll-container" id="scroll-wrapper">
        <section id="meadow" className="story-section active" data-index="0">
          <div className="section-bg"></div>

          <div className="parallax-canvas">
            <div className="watermark-bg" data-speed="0.15">Creative</div>
            <div className="hero-avatar-container">
              <ChromaKeyVideo
                className="hero-avatar-video"
                src="/assets/Create_a_subtle_high_quality-nobg.mp4"
              />
            </div>
          </div>

          <div className="editorial-container">
            <div className="story-content-box">
              <span className="chapter-indicator">CH.01 / START</span>
              <h1 className="story-title">Shaping the Innovators of Tomorrow</h1>
              <p className="story-text">At Credible Create, we redefine technology education. Through hands-on, project-based training, we prepare young minds to build the future of Robotics, AI, and Drone Technology.</p>
              <div className="story-actions">
                <button className="btn btn-primary overlay-trigger" data-target="overlay-demo"><span className="btn-text">Request Call</span></button>
                <button className="btn btn-secondary overlay-trigger" data-target="overlay-programs"><span className="btn-text">Expertise</span></button>
              </div>
            </div>

            <div className="status-panel">
              <span className="status-num">01</span>
              <div>
                STATUS // LIVE<br />
                SYS.RUN // TRUE<br />
                AETHER // ORIGIN
              </div>
            </div>
          </div>

          <div className="scroll-indicator" id="scroll-prompt">
            <span>Scroll to scan</span>
            <svg viewBox="0 0 24 24">
              <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </section>

        <section id="canopy" className="story-section" data-index="1">
          <div className="section-bg"></div>

          <div className="parallax-canvas">
            <div className="watermark-bg" data-speed="0.25">Barracks</div>
            <div className="mascot-container">
              <img
                src="/assets/image copy.png"
                alt="Bot Barracks Cybernetics"
                className="mascot-image"
              />
            </div>
          </div>

          <div className="editorial-container">
            <div className="story-content-box">
              <span className="chapter-indicator">CH.02 / BARRACKS</span>
              <h2 className="story-title">Bot Barracks & Cybernetics</h2>
              <p className="story-text">Move beyond virtual limits. Through Bot Barracks—our dedicated robotics training brand—we supply schools and cohorts with hardware assemblies, mechanical programming, and competitive cybernetics skills.</p>
              <div className="story-actions">
                <button className="btn btn-secondary overlay-trigger" data-target="overlay-programs"><span className="btn-text">Explore Labs</span></button>
              </div>
            </div>

            <div className="status-panel">
              <span className="status-num">02</span>
              <div>
                DRIVE // CALIB<br />
                ARM.MOD // STEP<br />
                TELEMETRY // ON
              </div>
            </div>
          </div>
        </section>

        <section id="thermals" className="story-section" data-index="2">
          <div className="section-bg"></div>

          <div className="parallax-canvas">
            <div className="watermark-bg" data-speed="0.15">Lab Tech</div>
          </div>

          <div className="editorial-container">
            <div className="story-content-box">
              <span className="chapter-indicator">CH.03 / LABS</span>
              <h2 className="story-title">The Innovation Proving Ground</h2>
              <p className="story-text">Accelerate development curves. In the Innovation Lab, students integrate design thinking models with physical technologies, working with Arduino circuits, IoT grids, Figma, and 3D printing.</p>
              <div className="story-actions">
                <button className="btn btn-secondary overlay-trigger" data-target="overlay-projects"><span className="btn-text">Student Portfolio</span></button>
              </div>
            </div>

            <div className="status-panel">
              <span className="status-num">03</span>
              <div>
                AI.PROMPT // SET<br />
                CAD.RENDER // ON<br />
                FREQ // 5.8GHZ
              </div>
            </div>
          </div>
        </section>

        <section id="sanctuary" className="story-section" data-index="3">
          <div className="section-bg"></div>

          <div className="parallax-canvas">
            <div className="watermark-bg" data-speed="0.3">Sanctuary</div>
          </div>

          <div className="editorial-container">
            <div className="story-content-box">
              <span className="chapter-indicator">CH.04 / HORIZON</span>
              <h2 className="story-title">Connected Communities</h2>
              <p className="story-text">Our flight completes where regional impact is established. Through school training certifications, national hackathons, and cohort networks, we support students as they build real solutions.</p>
              <div className="story-actions">
                <button className="btn btn-primary overlay-trigger" data-target="overlay-demo"><span className="btn-text">Partner With Us</span></button>
                <button className="btn btn-secondary overlay-trigger" data-target="overlay-verify"><span className="btn-text">Verify Certificates</span></button>
              </div>
            </div>

            <div className="status-panel">
              <span className="status-num">04</span>
              <div>
                CERT // TRUSTED<br />
                IMPACT // REGIONAL<br />
                VALLEY // PERCH
              </div>
            </div>
          </div>
        </section>

        <section id="gallery" className="story-section" data-index="4">
          <div className="section-bg"></div>

          <div className="parallax-canvas">
            <div className="watermark-bg" data-speed="0.25">Showcase</div>
          </div>

          <div className="editorial-container">
            <div className="story-content-box">
              <span className="chapter-indicator">CH.05 / GALLERY</span>
              <h2 className="story-title">Creative Work In Motion</h2>
          <p className="story-text">Observe our robotics, coding, and aerospace classes in action. These images represent
            cohort milestones, robot test flights, and team builds.</p>
          <div className="story-actions">
            <button className="btn btn-primary overlay-trigger" data-target="overlay-demo"><span className="btn-text">Join
                Cohort</span></button>
          </div>
        </div>

        
        <div className="gallery-scroll-wrapper">
          <div className="gallery-column col-left">
            
            <div className="gallery-card">
              <img src="/assets/class_robotics.png" alt="Robotics Class" className="gallery-img" />
              <div className="gallery-info">
                <h4>BOT BARRACKS LAB</h4>
                <span>CH-01</span>
              </div>
            </div>
            <div className="gallery-card">
              <img src="/assets/class_ai.png" alt="AI Programming" className="gallery-img" />
              <div className="gallery-info">
                <h4>COGNITIVE LABS</h4>
                <span>CH-02</span>
              </div>
            </div>
          </div>
          <div className="gallery-column col-right">
            
            <div className="gallery-card">
              <img src="/assets/class_drone.png" alt="Drone Aerospace" className="gallery-img" />
              <div className="gallery-info">
                <h4>FLIGHT TELEMETRY</h4>
                <span>CH-03</span>
              </div>
            </div>
            <div className="gallery-card">
              <img src="/assets/class_aerospace.png" alt="Aerospace Models" className="gallery-img" />
              <div className="gallery-info">
                <h4>MODEL PROTOTYPING</h4>
                <span>CH-04</span>
              </div>
            </div>
          </div>
        </div>

        <div className="status-panel">
          <span className="status-num">05</span>
          <div>
            GALLERY // PORTFOLIO<br />
            SHOWCASE // ACTIVE<br />
            INDEX // RUNNING
          </div>
        </div>
      </div>
    </section>

    
    <section id="myna-tribe" className="story-section" data-index="5">
      <div className="section-bg"></div>

      
      <div className="parallax-canvas">
        
        <div className="watermark-bg" data-speed="0.2">Tribe</div>
      </div>

      
      <div className="myna-floating-badge badge-left">
        <span className="myna-badge-dot"></span>
        <span>50+ Cohorts</span>
      </div>
      <div className="myna-floating-badge badge-right">
        <span className="myna-badge-dot"></span>
        <span>10K+ Network</span>
      </div>

      <div className="myna-section-body">
        <div className="myna-card-content story-content-box">
          <span className="chapter-indicator" style={{ alignSelf: "center", marginBottom: "0.25rem" }}>CH.06 / MYNA</span>
          <h2 className="story-title">Find Your Tribe,<br />Build Your Network.</h2>
          <p className="story-text">Connect with like-minded students for fun, friendships, and future opportunities.</p>

          <div className="myna-card-actions story-actions">
            <button className="myna-card-btn myna-card-btn-primary overlay-trigger" data-target="overlay-demo">Join for Free
              →</button>
            <button className="myna-card-btn myna-card-btn-secondary overlay-trigger" data-target="overlay-programs">
              <span className="myna-avatar-stack">
                <span className="myna-avatar" style={{ backgroundImage: "url('/assets/anshuman.png')" }}></span>
                <span className="myna-avatar" style={{ backgroundImage: "url('/assets/suhani.png')" }}></span>
                <span className="myna-avatar" style={{ backgroundImage: "url('/assets/shashank.png')" }}></span>
              </span>
              Explore Communities
            </button>
          </div>
        </div>

        
        <div className="myna-card-image-wrap">
          <img src="/assets/image-Photoroom.png" alt="Myna Tribe Group" className="myna-card-img" />
        </div>
      </div>


    </section>

    
    <section id="footer-section" className="story-section footer-story-section" data-index="6">
      <div className="section-bg"></div>
      <div className="parallax-canvas">
        <div className="watermark-bg" data-speed="0.12">Credible</div>
      </div>

      <div className="footer-section-inner">
        
        <div className="footer-brand-row">
          <a href="#" className="logo footer-logo" id="footer-logo-link">
            <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7" />
              <polygon points="2 7 12 12 12 22 2 17" />
              <polygon points="12 12 22 7 22 17 12 22" />
            </svg>
            <span>CREDIBLE // CREATE</span>
          </a>
          <nav className="footer-top-nav">
            <ul>
              <li><a className="overlay-trigger" data-target="overlay-programs">Programs</a></li>
              <li><a className="overlay-trigger" data-target="overlay-about">About</a></li>
              <li><a className="overlay-trigger" data-target="overlay-projects">Projects</a></li>
              <li><a className="overlay-trigger" data-target="overlay-verify">Verify</a></li>
              <li><a className="overlay-trigger btn btn-primary" data-target="overlay-demo" style={{ padding: "0.45rem 1.25rem", fontSize: "0.65rem" }}><span className="btn-text">Book Demo</span></a></li>
            </ul>
          </nav>
        </div>

        
        <div className="footer-section-divider"></div>

        
        <div className="footer-columns-row">
          <div className="footer-col">
            <h4>Credible Create</h4>
            <ul>
              <li><a className="overlay-trigger" data-target="overlay-about">Our Mission</a></li>
              <li><a className="overlay-trigger" data-target="overlay-about">Our Team</a></li>
              <li><a href="#" style={{ pointerEvents: "none", opacity: 0.4 }}>Careers (We&apos;re Hiring)</a></li>
              <li><a href="#" style={{ pointerEvents: "none", opacity: 0.4 }}>Partnerships</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Bot Barracks</h4>
            <ul>
              <li><a className="overlay-trigger" data-target="overlay-programs">Robotics Labs</a></li>
              <li><a className="overlay-trigger" data-target="overlay-programs">Innovation Design</a></li>
              <li><a className="overlay-trigger" data-target="overlay-projects">Student Cohorts</a></li>
              <li><a className="overlay-trigger" data-target="overlay-verify">Verify Portal</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li><a href="#" style={{ pointerEvents: "none", opacity: 0.4 }}>Figma Mockups</a></li>
              <li><a href="#" style={{ pointerEvents: "none", opacity: 0.4 }}>Onshape Tutorials</a></li>
              <li><a href="#" style={{ pointerEvents: "none", opacity: 0.4 }}>NotebookLM Prompts</a></li>
              <li><a href="#" style={{ pointerEvents: "none", opacity: 0.4 }}>Curriculum PDFs</a></li>
            </ul>
          </div>
          <div className="footer-col footer-cta-col">
            <h4>Connect</h4>
            <p className="footer-cta-text">Have a school or program in mind? Let&apos;s build something meaningful.</p>
            <button className="btn btn-primary overlay-trigger footer-cta-btn" data-target="overlay-demo">
              <span className="btn-text">Request a Call →</span>
            </button>
            <div className="footer-contact-links">
              <a href="mailto:info@crediblecreate.com">info@crediblecreate.com</a>
              <a href="#" style={{ pointerEvents: "none", opacity: 0.4 }}>Community Forum</a>
            </div>
          </div>
        </div>

        
        <div className="footer-section-divider"></div>

        
        <div className="footer-bottom-row">
          <span className="footer-copyright">© 2026 Credible Create. All rights reserved.</span>
          <div className="footer-bottom-status">
            <span className="footer-status-dot"></span>
            <span>SYS.STATUS // LIVE</span>
          </div>
          <div className="footer-bottom-links">
            <a href="#" style={{ pointerEvents: "none", opacity: 0.4 }}>Privacy Policy</a>
            <a href="#" style={{ pointerEvents: "none", opacity: 0.4 }}>Terms &amp; Conditions</a>
          </div>
        </div>
      </div>
    </section>

  </main>

  

  
  <div className="overlay-panel" id="overlay-about">
    
    <div className="about-glow-blobs">
      <div className="about-glow-blob blob-1"></div>
      <div className="about-glow-blob blob-2"></div>
      <div className="about-glow-blob blob-3"></div>
    </div>

    
    <div className="overlay-nav">
      <a href="#" className="logo overlay-nav-logo">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7" />
          <polygon points="2 7 12 12 12 22 2 17" />
          <polygon points="12 12 22 7 22 17 12 22" />
        </svg>
        <span>CREDIBLE // CREATE</span>
      </a>
      <nav className="overlay-nav-links">
        <ul>
          <li><a className="overlay-trigger" data-target="overlay-programs">Programs</a></li>
          <li><a className="overlay-trigger overlay-nav-active" data-target="overlay-about">About</a></li>
          <li><a className="overlay-trigger" data-target="overlay-projects">Projects</a></li>
          <li><a className="overlay-trigger" data-target="overlay-verify">Verify</a></li>
          <li><a className="overlay-trigger btn btn-primary" data-target="overlay-demo" style={{ padding: "0.45rem 1.25rem", fontSize: "0.65rem" }}><span className="btn-text">Book Demo</span></a></li>
        </ul>
      </nav>
      <button className="close-btn overlay-nav-close" aria-label="Close panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div className="overlay-container about-layout">
      
      <div className="about-section about-bio-section" id="about-bio">
        <h1 className="bio-heading">ABOUT US.</h1>
        <div className="bio-grid">
          <div className="bio-nav">
            <span className="bio-nav-link active" data-target="about-bio">About us.</span>
            <span className="bio-nav-link" data-target="about-team">Our team.</span>
            <span className="bio-nav-link" data-target="about-achievements">Milestones.</span>
          </div>
          <div className="bio-text">
            <p>Credible Create, innovation education agency based in Singapore, was created in 2021 by pioneering
              technologists with long-term experience in MIT, Silicon Valley, and research labs. Many of our cohort
              clients, like regional training schools and research universities, follow us in this tech-education
              adventure and many others such as national science clubs.</p>
            <p>After a fortunate collaboration with robotics labs and curriculum designers, we gained fundamental
              members of our team. Today, collaborating with global brands and educational institutions, we support
              students as they build real solutions.</p>
          </div>
        </div>
      </div>

      
      <div className="about-section about-quote-section" id="about-quote">
        <div className="quote-wrapper">
          <span className="quote-mark mark-open">“</span>
          <blockquote className="quote-text">
            Our work does make sense only if it is a faithful witness of its time.
          </blockquote>
          <span className="quote-mark mark-close">”</span>
          <cite className="quote-author">Jean-Philippe Nuel, Director</cite>
        </div>
      </div>

      
      <div className="about-section about-team-section" id="about-team">
        <h2 className="team-heading">THE TEAM</h2>

        <div className="team-slider-container">

          <div className="team-slider-track">

            
            <div className="team-slide">
              <div className="team-slide-header">
                <span className="news-meta-vol">VOL. XXVI — NO. 197</span>
                <span className="news-meta-title">CREDIBLE CREATE JOURNAL</span>
                <span className="news-meta-date">THURSDAY, JULY 16, 2026</span>
              </div>
              <div className="team-slide-left">
                <div className="founder-badge">MEET OUR FOUNDER</div>
                <h4 className="founder-name">ANSHUMAN SHUKLA</h4>
              </div>
              <div className="team-slide-center">
                <div className="team-bg-name">ANSHUMAN</div>
                <div className="about-hero-image">
                  <img src="/assets/anshuman.png" alt="Anshuman - Visionary Leader Portrait" className="visionary-img" />
                </div>
              </div>
              <div className="team-slide-right">
                <p className="founder-bio">Driven by a pursuit of digital innovation, Anshuman founded Credible Create to
                  create solutions that matter. His journey from an aspiring visionary to a dynamic leader embodies the
                  core values of creativity, resilience, and meaningful impact. Read his full story.</p>
                <div className="founder-socials-wrap">
                  <div className="founder-divider-line"></div>
                  <div className="founder-socials">
                    <a href="#" className="social-icon-link" aria-label="LinkedIn">
                      <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="#" className="social-icon-link" aria-label="X">
                      <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="team-slide">
              <div className="team-slide-header">
                <span className="news-meta-vol">VOL. XXVI — NO. 197</span>
                <span className="news-meta-title">CREDIBLE CREATE JOURNAL</span>
                <span className="news-meta-date">THURSDAY, JULY 16, 2026</span>
              </div>
              <div className="team-slide-left">
                <div className="founder-badge">MEET OUR CO-FOUNDER</div>
                <h4 className="founder-name">HARSHIT PAL</h4>
              </div>
              <div className="team-slide-center">
                <div className="team-bg-name">HARSHIT</div>
                <div className="about-hero-image">
                  <img src="/assets/harshit.png" alt="Harshit - Tech Lead Portrait" className="visionary-img" />
                </div>
              </div>
              <div className="team-slide-right">
                <p className="founder-bio">Harshit leads our Cybernetics research and Drone Technology curriculum. Dedicated
                  to hands-on engineering, he empowers students to build, fly, and innovate, turning abstract coding and
                  mechanics concepts into tangible real-world applications.</p>
                <div className="founder-socials-wrap">
                  <div className="founder-divider-line"></div>
                  <div className="founder-socials">
                    <a href="#" className="social-icon-link" aria-label="LinkedIn">
                      <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="#" className="social-icon-link" aria-label="X">
                      <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="team-slide">
              <div className="team-slide-header">
                <span className="news-meta-vol">VOL. XXVI — NO. 197</span>
                <span className="news-meta-title">CREDIBLE CREATE JOURNAL</span>
                <span className="news-meta-date">THURSDAY, JULY 16, 2026</span>
              </div>
              <div className="team-slide-left">
                <div className="founder-badge">MEET OUR CO-FOUNDER</div>
                <h4 className="founder-name">SHASHANK MISHRA</h4>
              </div>
              <div className="team-slide-center">
                <div className="team-bg-name">SHASHANK</div>
                <div className="about-hero-image">
                  <img src="/assets/shashank.png" alt="Shashank - Program Coordinator Portrait" className="visionary-img" />
                </div>
              </div>
              <div className="team-slide-right">
                <p className="founder-bio">Shashank manages our student cohorts, hackathons, and regional outreach programs.
                  With a passion for community building, he connects schools and students to cultivate a thriving
                  ecosystem of AI, design thinking, and technical talent.</p>
                <div className="founder-socials-wrap">
                  <div className="founder-divider-line"></div>
                  <div className="founder-socials">
                    <a href="#" className="social-icon-link" aria-label="LinkedIn">
                      <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="#" className="social-icon-link" aria-label="X">
                      <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="team-slide">
              <div className="team-slide-header">
                <span className="news-meta-vol">VOL. XXVI — NO. 197</span>
                <span className="news-meta-title">CREDIBLE CREATE JOURNAL</span>
                <span className="news-meta-date">THURSDAY, JULY 16, 2026</span>
              </div>
              <div className="team-slide-left">
                <div className="founder-badge">MEET OUR CO-FOUNDER</div>
                <h4 className="founder-name">SUHANI YADAV</h4>
              </div>
              <div className="team-slide-center">
                <div className="team-bg-name">SUHANI</div>
                <div className="about-hero-image">
                  <img src="/assets/suhani.png" alt="Suhani - AI & IoT Lead Portrait" className="visionary-img" />
                </div>
              </div>
              <div className="team-slide-right">
                <p className="founder-bio">Suhani leads our research in Artificial Intelligence, IoT integrations, and
                  interactive learning designs. Combining educational design with machine learning, she builds immersive
                  curricula that inspire future engineers and innovators.</p>
                <div className="founder-socials-wrap">
                  <div className="founder-divider-line"></div>
                  <div className="founder-socials">
                    <a href="#" className="social-icon-link" aria-label="LinkedIn">
                      <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                    <a href="#" className="social-icon-link" aria-label="X">
                      <svg className="brand-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          
          <div className="team-slider-nav">
            <div className="team-slider-dots">
              <button className="slider-dot active" data-index="0" aria-label="Go to slide 1"></button>
              <button className="slider-dot" data-index="1" aria-label="Go to slide 2"></button>
              <button className="slider-dot" data-index="2" aria-label="Go to slide 3"></button>
              <button className="slider-dot" data-index="3" aria-label="Go to slide 4"></button>
            </div>
            <div className="team-slider-arrows">
              <button className="slider-arrow prev-arrow" aria-label="Previous Team Member">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button className="slider-arrow next-arrow" aria-label="Next Team Member">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div className="about-section about-achievements-section" id="about-achievements">
        <h2 className="team-heading">MILESTONES & IMPACT</h2>
        <div className="about-achievements-row">
          <div className="achievement-col glass-card">
            <div className="achievement-card-glow"></div>
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <h4>Best EdTech Academy</h4>
            <p>Honored as the premier technology learning platform for cohorts in 2026.</p>
          </div>
          <div className="achievement-col glass-card">
            <div className="achievement-card-glow"></div>
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h4>10,000+ Certified</h4>
            <p>Students and teachers successfully certified across national institutions.</p>
          </div>
          <div className="achievement-col glass-card">
            <div className="achievement-card-glow"></div>
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
              </svg>
            </div>
            <h4>UX & Design Finalist</h4>
            <p>Nominated for excellence in educational interface design at LX Awards.</p>
          </div>
          <div className="achievement-col glass-card">
            <div className="achievement-card-glow"></div>
            <div className="achievement-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <h4>Global Hackathons</h4>
            <p>Hosts of 5 major cohort events preparing students for real solutions.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  
  <div className="overlay-panel" id="overlay-programs">
    
    <div className="overlay-nav">
      <a href="#" className="logo overlay-nav-logo">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7" />
          <polygon points="2 7 12 12 12 22 2 17" />
          <polygon points="12 12 22 7 22 17 12 22" />
        </svg>
        <span>CREDIBLE // CREATE</span>
      </a>
      <nav className="overlay-nav-links">
        <ul>
          <li><a className="overlay-trigger overlay-nav-active" data-target="overlay-programs">Programs</a></li>
          <li><a className="overlay-trigger" data-target="overlay-about">About</a></li>
          <li><a className="overlay-trigger" data-target="overlay-projects">Projects</a></li>
          <li><a className="overlay-trigger" data-target="overlay-verify">Verify</a></li>
          <li><a className="overlay-trigger btn btn-primary" data-target="overlay-demo" style={{ padding: "0.45rem 1.25rem", fontSize: "0.65rem" }}><span className="btn-text">Book Demo</span></a></li>
        </ul>
      </nav>
      <button className="close-btn overlay-nav-close" aria-label="Close panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    
    <div className="program-glow-blobs">
      <div className="program-glow-blob p-blob-1"></div>
      <div className="program-glow-blob p-blob-2"></div>
    </div>

    <div className="overlay-container program-layout">
      
      <div className="program-watermark-bg" id="program-watermark">362</div>

      <div className="program-header-group">
        <span className="program-subtitle">— e22entials. —</span>
        <h3 className="program-main-title">Program Journey<span className="blue-dot">.</span></h3>
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
          <div className="single-row-segmented-bar">
            <button className="segmented-control-btn prog-select-btn active" data-program="idt">Innovation Design & Thinking</button>
            <button className="segmented-control-btn prog-select-btn" data-program="robotics">Robotics & IoT</button>
            <div className="single-row-divider"></div>
            <button className="segmented-control-btn level-select-btn active" data-level="foundation">Class 6–8 (Foundation)</button>
            <button className="segmented-control-btn level-select-btn" data-level="advanced">Class 9–11 (Builder)</button>
          </div>
        </div>

        {/* Structured High-Contrast KPI Cards */}
        <div className="program-curriculum-summary" style={{ display: "flex", gap: "1.5rem", maxWidth: "780px", margin: "0 auto 3.5rem auto", width: "100%" }}>
          <div className="kpi-metric-card">
            <span className="kpi-metric-tag">✦ PRIMARY GOAL</span>
            <span className="kpi-metric-title" id="curriculum-goal">Confidence + creativity + basic AI usage</span>
          </div>
          <div className="kpi-metric-card">
            <span className="kpi-metric-tag" style={{ color: "#4f46e5" }}>✦ PRACTICAL OUTPUT</span>
            <span className="kpi-metric-title" id="curriculum-output">Idea + visual + simple prototype</span>
          </div>
        </div>
      </div>

      {/* Apple & Google Style Step-by-Step Curriculum Flow */}
      <div className="curriculum-journey-container" style={{ maxWidth: "840px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* Step 01 Card */}
        <div className="apple-step-card">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span className="step-number-badge">STEP 01</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#909090" }}>⏱️ ESTIMATED TIME: 2 HOURS</span>
            </div>
            <h4 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#121212", marginBottom: "0.5rem" }}>Ideation & Design Foundations</h4>
            <p style={{ fontSize: "0.95rem", color: "#5a5a5a", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Learn fundamental design thinking principles, sketch physical prototypes, and configure base learning modules.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#10b981", backgroundColor: "#e6f4ea", padding: "0.25rem 0.6rem", borderRadius: "4px" }}>Design Thinking</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#121212", backgroundColor: "#f1f5f9", padding: "0.25rem 0.6rem", borderRadius: "4px" }}>Figma Mockups</span>
            </div>
          </div>
          <div className="step-illustration-box">
            <img src="/assets/class_robotics.png" alt="Robotics Class" className="step-illustration-img" />
          </div>
        </div>

        {/* Step 02 Card */}
        <div className="apple-step-card">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span className="step-number-badge" style={{ backgroundColor: "#4f46e5" }}>STEP 02</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#909090" }}>⏱️ ESTIMATED TIME: 3 HOURS</span>
            </div>
            <h4 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#121212", marginBottom: "0.5rem" }}>Cognitive Labs & AI Vibe Coding</h4>
            <p style={{ fontSize: "0.95rem", color: "#5a5a5a", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Integrate machine learning models with microcontrollers, write AI scripts, and build responsive sensors.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#4f46e5", backgroundColor: "#eef2ff", padding: "0.25rem 0.6rem", borderRadius: "4px" }}>AI Vibe Coding</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#121212", backgroundColor: "#f1f5f9", padding: "0.25rem 0.6rem", borderRadius: "4px" }}>Microcontrollers</span>
            </div>
          </div>
          <div className="step-illustration-box">
            <img src="/assets/class_ai.png" alt="AI Programming" className="step-illustration-img" />
          </div>
        </div>

        {/* Step 03 Card */}
        <div className="apple-step-card">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span className="step-number-badge" style={{ backgroundColor: "#06b6d4" }}>STEP 03</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#909090" }}>⏱️ ESTIMATED TIME: 4 HOURS</span>
            </div>
            <h4 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#121212", marginBottom: "0.5rem" }}>Interactive Hardware & Cybernetics</h4>
            <p style={{ fontSize: "0.95rem", color: "#5a5a5a", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Assemble ESP32 circuits, construct mechanical chassis, and run telemetry tests on Bot Barracks hardware.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#06b6d4", backgroundColor: "#ecfeff", padding: "0.25rem 0.6rem", borderRadius: "4px" }}>Cybernetics</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#121212", backgroundColor: "#f1f5f9", padding: "0.25rem 0.6rem", borderRadius: "4px" }}>ESP32 Circuits</span>
            </div>
          </div>
          <div className="step-illustration-box">
            <img src="/assets/class_drone.png" alt="Hardware Cybernetics" className="step-illustration-img" />
          </div>
        </div>

        {/* Step 04 Card */}
        <div className="apple-step-card">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span className="step-number-badge" style={{ backgroundColor: "#10b981" }}>STEP 04</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#909090" }}>⏱️ ESTIMATED TIME: 4 HOURS</span>
            </div>
            <h4 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#121212", marginBottom: "0.5rem" }}>Interactive Showcase & CAD Modeling</h4>
            <p style={{ fontSize: "0.95rem", color: "#5a5a5a", lineHeight: 1.6, marginBottom: "1.25rem" }}>
              Import 3D CAD assemblies from Onshape, run logic models, and present your working prototype.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#10b981", backgroundColor: "#d1fae5", padding: "0.25rem 0.6rem", borderRadius: "4px" }}>CAD Modeling</span>
              <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "#121212", backgroundColor: "#f1f5f9", padding: "0.25rem 0.6rem", borderRadius: "4px" }}>3D Printing</span>
            </div>
          </div>
          <div className="step-illustration-box">
            <img src="/assets/class_aerospace.png" alt="CAD Model Prototyping" className="step-illustration-img" />
          </div>
        </div>

        {/* Completion Card */}
        <div style={{
          backgroundColor: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "1.5rem",
          padding: "3rem 2rem",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
          marginTop: "1rem"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🏆</div>
          <h4 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#121212", marginBottom: "0.5rem" }}>Journey Completed!</h4>
          <p style={{ fontSize: "0.95rem", color: "#5a5a5a", maxWidth: "480px", margin: "0 auto 1.5rem auto" }}>
            Congratulations! You have explored the full program path. Request a demo to launch this curriculum at your school.
          </p>
          <button className="btn btn-primary overlay-trigger" data-target="overlay-demo" style={{ padding: "0.8rem 2rem" }}>
            <span className="btn-text">BOOK SCHOOL DEMO</span>
          </button>
        </div>

      </div>
    </div>
  </div>

  {/* Overlay Projects & FAQ Panel */}
  <div className="overlay-panel" id="overlay-projects">
    <div className="overlay-nav">
      <a href="#" className="logo overlay-nav-logo">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7" />
          <polygon points="2 7 12 12 12 22 2 17" />
          <polygon points="12 12 22 7 22 17 12 22" />
        </svg>
        <span>CREDIBLE // CREATE</span>
      </a>
      <nav className="overlay-nav-links">
        <ul>
          <li><a className="overlay-trigger" data-target="overlay-programs">Programs</a></li>
          <li><a className="overlay-trigger" data-target="overlay-about">About</a></li>
          <li><a className="overlay-trigger overlay-nav-active" data-target="overlay-projects">Projects & FAQ</a></li>
          <li><a className="overlay-trigger" data-target="overlay-verify">Verify</a></li>
          <li><a className="overlay-trigger btn btn-primary" data-target="overlay-demo" style={{ padding: "0.45rem 1.25rem", fontSize: "0.65rem" }}><span className="btn-text">Book Demo</span></a></li>
        </ul>
      </nav>
      <button className="close-btn overlay-nav-close" aria-label="Close panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <div className="overlay-container">
      <div className="overlay-header">
        <span className="overlay-tag">Student Work & FAQ</span>
        <h3 className="overlay-title">Cohort Projects & Information</h3>
      </div>

      <div className="c-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="c-card apple-card-hover" style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(0,0,0,0.08)" }}>
          <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#10b981" }}>CH-01 // ROBOTICS</span>
          <h4 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0.5rem 0" }}>Autonomous Line Follower</h4>
          <p style={{ fontSize: "0.85rem", color: "#5a5a5a" }}>ESP32 chassis with infrared array telemetry engineered by Class 8 cohort.</p>
        </div>
        <div className="c-card apple-card-hover" style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(0,0,0,0.08)" }}>
          <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#4f46e5" }}>CH-02 // COGNITIVE</span>
          <h4 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0.5rem 0" }}>AI Vision Sorter</h4>
          <p style={{ fontSize: "0.85rem", color: "#5a5a5a" }}>OpenCV Python camera module classifying recyclables in real time.</p>
        </div>
        <div className="c-card apple-card-hover" style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(0,0,0,0.08)" }}>
          <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "#06b6d4" }}>CH-03 // AEROSPACE</span>
          <h4 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "0.5rem 0" }}>Quadcopter Flight Controller</h4>
          <p style={{ fontSize: "0.85rem", color: "#5a5a5a" }}>Custom PCB assembly with gyro stabilization tested in drone lab.</p>
        </div>
      </div>
    </div>
  </div>

  
  <div className="overlay-panel" id="overlay-verify">
    
    <div className="overlay-nav">
      <a href="#" className="logo overlay-nav-logo">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7" />
          <polygon points="2 7 12 12 12 22 2 17" />
          <polygon points="12 12 22 7 22 17 12 22" />
        </svg>
        <span>CREDIBLE // CREATE</span>
      </a>
      <nav className="overlay-nav-links">
        <ul>
          <li><a className="overlay-trigger" data-target="overlay-programs">Programs</a></li>
          <li><a className="overlay-trigger" data-target="overlay-about">About</a></li>
          <li><a className="overlay-trigger" data-target="overlay-projects">Projects</a></li>
          <li><a className="overlay-trigger overlay-nav-active" data-target="overlay-verify">Verify</a></li>
          <li><a className="overlay-trigger btn btn-primary" data-target="overlay-demo" style={{ padding: "0.45rem 1.25rem", fontSize: "0.65rem" }}><span className="btn-text">Book Demo</span></a></li>
        </ul>
      </nav>
      <button className="close-btn overlay-nav-close" aria-label="Close panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
    <div className="overlay-container">
      <div className="overlay-header">
        <span className="overlay-tag">Secure Portal</span>
        <h3 className="overlay-title">Certificate Verification</h3>
      </div>

      <div className="verification-box">
        <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "0.9rem" }}>Enter the unique credential code
          found on your Credible Create certificate to authenticate the achievement details.</p>

        <div className="search-bar">
          <input type="text" id="cert-input" placeholder="e.g. CC-101" aria-label="Certificate Code" />
          <button id="cert-btn"><span className="btn-text">Verify</span></button>
        </div>

        <div className="error-message" id="cert-error">Certificate not found. Try searching with code &quot;CC-101&quot;.</div>

        
        <div className="verification-result" id="cert-result">
          <div className="cert-card">
                      <div className="cert-label">Recipient Name</div>
            <div className="cert-val" id="cert-holder">Jane Doe</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1rem" }}>
              <div>
                <div className="cert-label">Course Title</div>
                <div className="cert-val" id="cert-course">Robotics & Cybernetics Cohort</div>
              </div>
              <div>
                <div className="cert-label">Issue Date</div>
                <div className="cert-val" id="cert-date">June 2026</div>
              </div>
            </div>

            <div className="cert-label">Credential ID</div>
            <div className="cert-id" id="cert-id-val">CC-101</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Overlay Book Demo Panel */}
  <div className="overlay-panel" id="overlay-demo">
    <div className="overlay-nav">
      <a href="#" className="logo overlay-nav-logo">
        <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7" />
          <polygon points="2 7 12 12 12 22 2 17" />
          <polygon points="12 12 22 7 22 17 12 22" />
        </svg>
        <span>CREDIBLE // CREATE</span>
      </a>
      <nav className="overlay-nav-links">
        <ul>
          <li><a className="overlay-trigger" data-target="overlay-programs">Programs</a></li>
          <li><a className="overlay-trigger" data-target="overlay-about">About</a></li>
          <li><a className="overlay-trigger" data-target="overlay-projects">Projects</a></li>
          <li><a className="overlay-trigger" data-target="overlay-verify">Verify</a></li>
          <li><a className="overlay-trigger btn btn-primary overlay-nav-active" data-target="overlay-demo" style={{ padding: "0.45rem 1.25rem", fontSize: "0.65rem" }}><span className="btn-text">Book Demo</span></a></li>
        </ul>
      </nav>
      <button className="close-btn overlay-nav-close" aria-label="Close panel">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
    <div className="overlay-container">
      <div className="demo-page">
        
        <div className="demo-header">
          <span className="demo-pretitle">— Book a Demo</span>
          <h1 className="demo-headline">Let&apos;s build something<br />extraordinary.</h1>
          <p className="demo-subline">Schedule a live walkthrough of our robotics labs, AI studios, or aerospace programs. We&apos;ll tailor the session to your institution&apos;s goals.</p>
        </div>

        <div className="demo-mascot-inline">
          <img src="/assets/image.png" alt="Credible Create Robot" className="floating-mascot-img" />
        </div>

        <div className="demo-form-card">
          <form id="demo-form" onSubmit={(e) => e.preventDefault()}>
            <div className="demo-form-row">
              <div className="floating-group">
                <input type="text" id="form-name" required placeholder=" " />
                <label htmlFor="form-name">Full Name</label>
              </div>
              <div className="floating-group">
                <input type="email" id="form-email" required placeholder=" " />
                <label htmlFor="form-email">Email Address</label>
              </div>
            </div>

            <div className="floating-group">
              <input type="text" id="form-org" required placeholder=" " />
              <label htmlFor="form-org">Institution / Organization</label>
            </div>

            <span className="selection-title">Domain of Interest</span>
            <div className="chips-container">
              <div className="chip-item selected" data-val="robotics">Robotics</div>
              <div className="chip-item" data-val="ai">AI & Smart Labs</div>
              <div className="chip-item" data-val="drones">Drones & Aerospace</div>
              <div className="chip-item" data-val="school-partnerships">Full Curriculum</div>
              <div className="chip-item" data-val="other">Other</div>
            </div>
            <input type="hidden" id="form-interest" value="robotics" />

            <span className="selection-title">Audience Level</span>
            <div className="chips-container">
              <div className="chip-item chip-level selected" data-val="foundation">Class 6–8</div>
              <div className="chip-item chip-level" data-val="advanced">Class 9–11</div>
              <div className="chip-item chip-level" data-val="university">Higher Ed</div>
              <div className="chip-item chip-level" data-val="custom">Custom</div>
            </div>
            <input type="hidden" id="form-level" value="foundation" />

            <div className="floating-group">
              <textarea id="form-message" rows={3} required placeholder=" "></textarea>
              <label htmlFor="form-message">Tell us about your goals</label>
            </div>

            <button type="submit" className="btn-demo-cta" id="form-submit-btn">
              <span className="btn-demo-cta-text">Request a Demo →</span>
            </button>
          </form>

          <div className="demo-success-container" id="form-success">
            <div className="demo-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <h4 className="demo-success-title">Request Received</h4>
            <p className="demo-success-text">Our team will reach out within 24 hours to schedule your session.</p>
          </div>
        </div>

        <div className="trust-bar">
          <div className="trust-stat"><span className="trust-num" data-count="10000">0</span><span className="trust-label">Students</span></div>
          <div className="trust-divider"></div>
          <div className="trust-stat"><span className="trust-num" data-count="50">0</span><span className="trust-label">Cohorts</span></div>
          <div className="trust-divider"></div>
          <div className="trust-stat"><span className="trust-num" data-count="5">0</span><span className="trust-label">Hackathons</span></div>
          <div className="trust-divider"></div>
          <div className="trust-stat"><span className="trust-num" data-count="99">0</span><span className="trust-label">Satisfaction %</span></div>
        </div>
      </div>
    </div>
  </div>

    </>
  );
}
