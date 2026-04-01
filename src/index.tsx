import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>VSK — Virtuelle Stadt Königsberg</title>
  <meta name="description" content="Virtuelle Stadt Königsberg — a persistent digital civic environment for universities, institutes, competitions, and international academic activity." />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cinzel:wght@400;500;600;700;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet" />
  <style>
    :root {
      --gold: #C5A028;
      --gold-light: #E2C96A;
      --gold-pale: #F5E9B8;
      --prussian: #0A1628;
      --prussian-mid: #162240;
      --prussian-light: #1E3560;
      --stone: #E8E0D0;
      --stone-dark: #C8BC9E;
      --cream: #F9F5EC;
      --ink: #1A1410;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'EB Garamond', Georgia, serif;
      background-color: var(--prussian);
      color: var(--stone);
      overflow-x: hidden;
    }

    /* ─── TYPOGRAPHY ─── */
    .font-cinzel { font-family: 'Cinzel', serif; }
    .font-garamond { font-family: 'EB Garamond', serif; }
    .font-inter { font-family: 'Inter', sans-serif; }

    /* ─── HERO SVG SCENE ─── */
    .hero-scene {
      position: relative;
      width: 100%;
      height: 100vh;
      min-height: 700px;
      background: linear-gradient(180deg,
        #040C1A 0%,
        #0A1628 30%,
        #0D1E38 60%,
        #1A2E40 80%,
        #1C3344 100%
      );
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* Stars */
    .stars-layer {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none;
    }
    .star { position: absolute; border-radius: 50%; background: white; animation: twinkle var(--d, 3s) var(--delay, 0s) infinite ease-in-out; }
    @keyframes twinkle {
      0%, 100% { opacity: var(--min-op, 0.3); transform: scale(1); }
      50% { opacity: 1; transform: scale(1.3); }
    }

    /* Water shimmer */
    .water-shimmer {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 220px;
      background: linear-gradient(180deg,
        rgba(26,46,70,0.0) 0%,
        rgba(10,28,60,0.85) 40%,
        rgba(5,18,45,0.98) 100%
      );
    }

    /* Bridge SVG animation */
    .bridge-glow {
      filter: drop-shadow(0 0 6px rgba(197, 160, 40, 0.5));
    }
    .bridge-arch {
      animation: bridge-pulse 4s ease-in-out infinite;
    }
    @keyframes bridge-pulse {
      0%, 100% { filter: drop-shadow(0 0 4px rgba(197,160,40,0.3)); }
      50% { filter: drop-shadow(0 0 12px rgba(197,160,40,0.7)); }
    }

    /* Castle glow */
    .castle-glow {
      animation: castle-light 6s ease-in-out infinite;
    }
    @keyframes castle-light {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(197,160,40,0.2)) drop-shadow(0 0 20px rgba(197,160,40,0.1)); }
      50% { filter: drop-shadow(0 0 16px rgba(197,160,40,0.45)) drop-shadow(0 0 40px rgba(197,160,40,0.2)); }
    }

    /* Window flicker */
    .win-flicker { animation: win-flicker var(--wf, 3s) var(--wd, 0s) ease-in-out infinite; }
    @keyframes win-flicker {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    /* ─── HERO TEXT ─── */
    .hero-text-block {
      position: relative;
      z-index: 20;
      text-align: center;
      padding: 0 1.5rem;
      margin-top: -60px;
    }

    .hero-kicker {
      font-family: 'Inter', sans-serif;
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--gold);
      opacity: 0.9;
      margin-bottom: 1rem;
    }

    .hero-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(2.8rem, 7vw, 6rem);
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.06em;
      line-height: 1.05;
      text-shadow: 0 2px 40px rgba(197,160,40,0.25), 0 0 80px rgba(197,160,40,0.1);
    }

    .hero-subtitle {
      font-family: 'Cinzel', serif;
      font-size: clamp(0.75rem, 1.8vw, 1.1rem);
      font-weight: 400;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold-light);
      margin-top: 0.75rem;
      opacity: 0.85;
    }

    .hero-rule {
      display: flex; align-items: center; gap: 1.2rem;
      justify-content: center; margin: 1.5rem 0;
    }
    .hero-rule-line {
      width: 80px; height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
    }
    .hero-rule-diamond {
      width: 8px; height: 8px;
      background: var(--gold);
      transform: rotate(45deg);
    }

    .hero-tagline {
      font-family: 'EB Garamond', serif;
      font-size: clamp(1rem, 2vw, 1.3rem);
      font-style: italic;
      color: var(--stone-dark);
      max-width: 580px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    .hero-cta {
      display: inline-flex; align-items: center; gap: 0.6rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--prussian);
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      padding: 0.75rem 2rem;
      border: none; cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }
    .hero-cta:hover {
      background: linear-gradient(135deg, var(--gold-light), var(--gold));
      box-shadow: 0 4px 20px rgba(197,160,40,0.4);
      transform: translateY(-1px);
    }

    /* ─── SECTION SHARED ─── */
    .section-pad { padding: 5rem 1.5rem; }
    .section-pad-lg { padding: 7rem 1.5rem; }
    .max-content { max-width: 1200px; margin: 0 auto; }
    .max-text { max-width: 760px; margin: 0 auto; }

    /* ─── SECTION LABEL ─── */
    .section-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.65rem;
      font-weight: 500;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 1rem;
    }

    .section-title {
      font-family: 'Cinzel', serif;
      font-size: clamp(1.8rem, 4vw, 3rem);
      font-weight: 600;
      color: #FFFFFF;
      line-height: 1.2;
      margin-bottom: 1.5rem;
    }

    .section-body {
      font-family: 'EB Garamond', serif;
      font-size: 1.15rem;
      line-height: 1.8;
      color: var(--stone-dark);
    }

    /* ─── DIVIDER ─── */
    .gold-divider {
      width: 60px; height: 2px;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      margin: 1.5rem 0;
    }
    .gold-divider-center { margin: 1.5rem auto; }

    /* ─── NAV ─── */
    .site-nav {
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 1rem 2rem;
      display: flex; align-items: center; justify-content: space-between;
      background: rgba(5, 12, 28, 0.0);
      transition: background 0.4s ease, padding 0.4s ease;
    }
    .site-nav.scrolled {
      background: rgba(5, 12, 28, 0.97);
      padding: 0.75rem 2rem;
      border-bottom: 1px solid rgba(197,160,40,0.15);
    }
    .nav-logo {
      font-family: 'Cinzel', serif;
      font-size: 1rem;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 0.15em;
      text-decoration: none;
    }
    .nav-links {
      display: flex; gap: 2rem; list-style: none;
    }
    .nav-links a {
      font-family: 'Inter', sans-serif;
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--stone-dark);
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: var(--gold); }

    /* ─── ABOUT SECTION ─── */
    .about-section {
      background: linear-gradient(180deg, var(--prussian) 0%, var(--prussian-mid) 100%);
      border-top: 1px solid rgba(197,160,40,0.12);
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
      align-items: start;
    }
    @media (max-width: 900px) {
      .about-grid { grid-template-columns: 1fr; gap: 3rem; }
      .nav-links { display: none; }
    }

    .about-facts {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-top: 2.5rem;
    }

    .fact-card {
      padding: 1.5rem;
      border: 1px solid rgba(197,160,40,0.2);
      background: rgba(197,160,40,0.04);
      transition: border-color 0.3s, background 0.3s;
    }
    .fact-card:hover {
      border-color: rgba(197,160,40,0.45);
      background: rgba(197,160,40,0.08);
    }
    .fact-card-num {
      font-family: 'Cinzel', serif;
      font-size: 1.6rem;
      font-weight: 700;
      color: var(--gold);
      display: block;
    }
    .fact-card-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--stone-dark);
      margin-top: 0.3rem;
    }

    /* ─── PILLARS ─── */
    .pillars-section {
      background: var(--prussian-mid);
      border-top: 1px solid rgba(197,160,40,0.1);
      border-bottom: 1px solid rgba(197,160,40,0.1);
    }

    .pillars-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
      margin-top: 4rem;
    }
    @media (max-width: 768px) {
      .pillars-grid { grid-template-columns: 1fr; }
    }

    .pillar-card {
      padding: 3rem 2.5rem;
      background: rgba(10,22,40,0.6);
      border: 1px solid rgba(197,160,40,0.12);
      position: relative;
      overflow: hidden;
      transition: background 0.3s, border-color 0.3s;
    }
    .pillar-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .pillar-card:hover { background: rgba(10,22,40,0.9); border-color: rgba(197,160,40,0.3); }
    .pillar-card:hover::before { opacity: 1; }

    .pillar-icon {
      font-size: 1.8rem;
      color: var(--gold);
      margin-bottom: 1.5rem;
      display: block;
    }
    .pillar-number {
      font-family: 'Cinzel', serif;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.25em;
      color: rgba(197,160,40,0.5);
      margin-bottom: 0.5rem;
      display: block;
    }
    .pillar-title {
      font-family: 'Cinzel', serif;
      font-size: 1.4rem;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 1rem;
    }
    .pillar-body {
      font-family: 'EB Garamond', serif;
      font-size: 1.05rem;
      line-height: 1.75;
      color: var(--stone-dark);
      margin-bottom: 1.5rem;
    }
    .pillar-features {
      list-style: none;
      margin-top: 1rem;
    }
    .pillar-features li {
      font-family: 'Inter', sans-serif;
      font-size: 0.72rem;
      font-weight: 400;
      letter-spacing: 0.05em;
      color: var(--stone-dark);
      padding: 0.5rem 0;
      border-bottom: 1px solid rgba(197,160,40,0.1);
      display: flex; align-items: center; gap: 0.6rem;
    }
    .pillar-features li::before {
      content: '';
      width: 4px; height: 4px;
      background: var(--gold);
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* ─── DISTRICTS ─── */
    .districts-section {
      background: var(--prussian);
      border-top: 1px solid rgba(197,160,40,0.1);
    }

    .city-map-container {
      position: relative;
      width: 100%;
      margin-top: 3rem;
    }

    /* Map SVG background */
    .map-svg-bg {
      width: 100%;
      height: auto;
      max-height: 520px;
    }

    .districts-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 3rem;
    }
    @media (max-width: 900px) {
      .districts-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 560px) {
      .districts-grid { grid-template-columns: 1fr; }
    }

    .district-card {
      position: relative;
      padding: 2rem 1.75rem;
      background: rgba(10,22,40,0.5);
      border: 1px solid rgba(197,160,40,0.15);
      overflow: hidden;
      transition: all 0.35s ease;
      cursor: default;
    }
    .district-card::after {
      content: '';
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--gold), var(--gold-light));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.35s ease;
    }
    .district-card:hover {
      background: rgba(14,28,54,0.9);
      border-color: rgba(197,160,40,0.35);
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    }
    .district-card:hover::after { transform: scaleX(1); }

    .district-bg-num {
      position: absolute; top: -10px; right: 12px;
      font-family: 'Cinzel', serif;
      font-size: 5rem;
      font-weight: 900;
      color: rgba(197,160,40,0.05);
      pointer-events: none;
      user-select: none;
    }
    .district-tag {
      font-family: 'Inter', sans-serif;
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 0.75rem;
    }
    .district-name {
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 0.75rem;
      line-height: 1.3;
    }
    .district-desc {
      font-family: 'EB Garamond', serif;
      font-size: 1rem;
      line-height: 1.65;
      color: var(--stone-dark);
    }
    .district-venues {
      margin-top: 1rem;
      display: flex; flex-wrap: wrap; gap: 0.4rem;
    }
    .venue-tag {
      font-family: 'Inter', sans-serif;
      font-size: 0.58rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--gold);
      background: rgba(197,160,40,0.1);
      border: 1px solid rgba(197,160,40,0.2);
      padding: 0.2rem 0.6rem;
    }

    /* ─── ETO SECTION ─── */
    .eto-section {
      background: linear-gradient(135deg, var(--prussian-mid) 0%, #0D1E30 50%, var(--prussian) 100%);
      border-top: 1px solid rgba(197,160,40,0.15);
      border-bottom: 1px solid rgba(197,160,40,0.15);
      position: relative;
      overflow: hidden;
    }
    .eto-section::before {
      content: 'ETO';
      position: absolute;
      right: -2rem; bottom: -3rem;
      font-family: 'Cinzel', serif;
      font-size: 18rem;
      font-weight: 900;
      color: rgba(197,160,40,0.03);
      pointer-events: none;
    }

    .eto-grid {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 5rem;
      align-items: center;
    }
    @media (max-width: 900px) { .eto-grid { grid-template-columns: 1fr; gap: 3rem; } }

    .eto-badge {
      display: inline-flex; align-items: center; gap: 0.75rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--prussian);
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      padding: 0.5rem 1.2rem;
      margin-bottom: 1.5rem;
    }

    .eto-date-block {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .eto-date-item {
      text-align: center;
      padding: 1.5rem 1rem;
      border: 1px solid rgba(197,160,40,0.2);
      background: rgba(197,160,40,0.05);
    }
    .eto-date-num {
      font-family: 'Cinzel', serif;
      font-size: 2rem;
      font-weight: 700;
      color: var(--gold);
      display: block;
    }
    .eto-date-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.62rem;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--stone-dark);
      margin-top: 0.3rem;
      display: block;
    }

    .eto-features-list {
      list-style: none;
      margin-top: 2rem;
    }
    .eto-features-list li {
      font-family: 'EB Garamond', serif;
      font-size: 1.1rem;
      line-height: 1.6;
      color: var(--stone-dark);
      padding: 0.8rem 0;
      border-bottom: 1px solid rgba(197,160,40,0.1);
      display: flex; align-items: flex-start; gap: 0.8rem;
    }
    .eto-features-list li i {
      color: var(--gold); font-size: 0.75rem; margin-top: 0.3rem; flex-shrink: 0;
    }

    /* ─── INSTITUTIONS SECTION ─── */
    .institutions-section {
      background: var(--prussian-mid);
      border-top: 1px solid rgba(197,160,40,0.1);
    }

    .participation-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-top: 3rem;
    }
    @media (max-width: 900px) { .participation-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) { .participation-grid { grid-template-columns: 1fr; } }

    .participation-card {
      padding: 2rem 1.5rem;
      border: 1px solid rgba(197,160,40,0.15);
      background: rgba(10,22,40,0.4);
      text-align: center;
      transition: all 0.3s;
    }
    .participation-card:hover {
      border-color: rgba(197,160,40,0.4);
      background: rgba(10,22,40,0.7);
      transform: translateY(-2px);
    }
    .participation-card i {
      font-size: 1.8rem;
      color: var(--gold);
      margin-bottom: 1rem;
      display: block;
    }
    .participation-card-title {
      font-family: 'Cinzel', serif;
      font-size: 0.9rem;
      font-weight: 600;
      color: #FFFFFF;
      margin-bottom: 0.75rem;
    }
    .participation-card-desc {
      font-family: 'EB Garamond', serif;
      font-size: 0.95rem;
      line-height: 1.6;
      color: var(--stone-dark);
    }

    /* ─── FOOTER ─── */
    .site-footer {
      background: #040B18;
      border-top: 1px solid rgba(197,160,40,0.2);
      padding: 4rem 1.5rem 2rem;
    }
    .footer-inner {
      max-width: 1200px; margin: 0 auto;
    }
    .footer-top {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr;
      gap: 4rem;
      padding-bottom: 3rem;
      border-bottom: 1px solid rgba(197,160,40,0.1);
    }
    @media (max-width: 768px) { .footer-top { grid-template-columns: 1fr; gap: 2rem; } }

    .footer-logo {
      font-family: 'Cinzel', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 0.1em;
      margin-bottom: 1rem;
      display: block;
    }
    .footer-tagline {
      font-family: 'EB Garamond', serif;
      font-size: 1rem;
      font-style: italic;
      color: var(--stone-dark);
      line-height: 1.7;
      max-width: 300px;
    }
    .footer-col-title {
      font-family: 'Cinzel', serif;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 1.25rem;
    }
    .footer-links { list-style: none; }
    .footer-links li { margin-bottom: 0.6rem; }
    .footer-links a {
      font-family: 'Inter', sans-serif;
      font-size: 0.78rem;
      color: var(--stone-dark);
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links a:hover { color: var(--gold); }

    .footer-bottom {
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 1rem;
      padding-top: 2rem;
    }
    .footer-copy {
      font-family: 'Inter', sans-serif;
      font-size: 0.68rem;
      font-weight: 400;
      letter-spacing: 0.05em;
      color: rgba(200,188,158,0.45);
    }
    .footer-badges {
      display: flex; gap: 1.5rem;
    }
    .footer-badge {
      font-family: 'Inter', sans-serif;
      font-size: 0.6rem;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: rgba(197,160,40,0.5);
      border: 1px solid rgba(197,160,40,0.2);
      padding: 0.3rem 0.8rem;
    }

    /* ─── HORIZONTAL RULE ORNAMENT ─── */
    .ornament-rule {
      display: flex; align-items: center; gap: 1rem;
      margin: 2.5rem 0;
    }
    .ornament-line {
      flex: 1; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(197,160,40,0.3), transparent);
    }
    .ornament-glyph {
      font-family: 'Cinzel', serif;
      font-size: 0.9rem;
      color: var(--gold);
      opacity: 0.6;
    }

    /* ─── QUOTE BLOCK ─── */
    .quote-block {
      border-left: 3px solid var(--gold);
      padding: 1.5rem 2rem;
      background: rgba(197,160,40,0.05);
      margin: 2rem 0;
    }
    .quote-text {
      font-family: 'EB Garamond', serif;
      font-size: 1.25rem;
      font-style: italic;
      color: var(--stone);
      line-height: 1.7;
    }
    .quote-attribution {
      font-family: 'Inter', sans-serif;
      font-size: 0.68rem;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--gold);
      margin-top: 0.75rem;
    }

    /* ─── SCROLL INDICATOR ─── */
    .scroll-indicator {
      position: absolute;
      bottom: 2.5rem; left: 50%;
      transform: translateX(-50%);
      z-index: 20;
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    }
    .scroll-label {
      font-family: 'Inter', sans-serif;
      font-size: 0.6rem;
      font-weight: 500;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(197,160,40,0.6);
    }
    .scroll-line {
      width: 1px; height: 40px;
      background: linear-gradient(180deg, rgba(197,160,40,0.6), transparent);
      animation: scroll-drop 2s ease-in-out infinite;
    }
    @keyframes scroll-drop {
      0% { transform: scaleY(0); transform-origin: top; }
      50% { transform: scaleY(1); transform-origin: top; }
      51% { transform: scaleY(1); transform-origin: bottom; }
      100% { transform: scaleY(0); transform-origin: bottom; }
    }

    /* ─── NETWORK MAP SECTION ─── */
    .network-section {
      background: var(--prussian);
      border-top: 1px solid rgba(197,160,40,0.08);
    }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 768px) {
      .hero-cta { padding: 0.65rem 1.5rem; font-size: 0.65rem; }
      .about-facts { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 480px) {
      .about-facts { grid-template-columns: 1fr; }
      .eto-date-block { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <!-- ═══════════════════════════════════════════
       NAVIGATION
  ════════════════════════════════════════════ -->
  <nav class="site-nav" id="site-nav">
    <a href="#" class="nav-logo">VSK</a>
    <ul class="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#pillars">Pillars</a></li>
      <li><a href="#districts">Districts</a></li>
      <li><a href="#eto2026">ETO 2026</a></li>
      <li><a href="#participate">Participate</a></li>
    </ul>
  </nav>

  <!-- ═══════════════════════════════════════════
       HERO — KÖNIGSBERG CITYSCAPE
  ════════════════════════════════════════════ -->
  <section class="hero-scene" id="hero">
    <!-- Stars -->
    <div class="stars-layer" id="stars-layer"></div>

    <!-- SVG Cityscape -->
    <svg
      viewBox="0 0 1400 500"
      preserveAspectRatio="xMidYMax meet"
      style="position:absolute;bottom:0;left:0;width:100%;height:auto;max-height:75%;z-index:5;"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#040C1A"/>
          <stop offset="100%" stop-color="#0D1E38"/>
        </linearGradient>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0A1E3C" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#050E20" stop-opacity="1"/>
        </linearGradient>
        <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2C3A50"/>
          <stop offset="100%" stop-color="#1A2438"/>
        </linearGradient>
        <linearGradient id="towerGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3A4A62"/>
          <stop offset="100%" stop-color="#1C2C44"/>
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1E2E42"/>
          <stop offset="100%" stop-color="#131E2E"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#E8C84A"/>
          <stop offset="100%" stop-color="#C5A028"/>
        </linearGradient>
        <filter id="glow-gold">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="soft-shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.5"/>
        </filter>
        <!-- Water reflection -->
        <linearGradient id="reflectGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1A3050" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#050E20" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- ── RIVER (Pregel) ── -->
      <rect x="0" y="390" width="1400" height="110" fill="url(#waterGrad)"/>
      <!-- Water surface shimmer lines -->
      <line x1="0" y1="395" x2="1400" y2="400" stroke="rgba(100,150,200,0.08)" stroke-width="1.5"/>
      <line x1="0" y1="410" x2="1400" y2="407" stroke="rgba(100,150,200,0.06)" stroke-width="1"/>
      <line x1="0" y1="425" x2="1400" y2="422" stroke="rgba(100,150,200,0.05)" stroke-width="1"/>
      <!-- Island in river -->
      <ellipse cx="700" cy="395" rx="200" ry="20" fill="#1A2438" opacity="0.6"/>

      <!-- ── BACK CITY (far buildings) ── -->
      <!-- Left wing buildings -->
      <rect x="10" y="260" width="30" height="130" fill="#1E2A3A"/>
      <rect x="40" y="240" width="25" height="150" fill="#1C2838"/>
      <rect x="65" y="270" width="35" height="120" fill="#1E2A3A"/>
      <polygon points="40,240 52.5,220 65,240" fill="#161E2E"/>
      <!-- Far right buildings -->
      <rect x="1340" y="265" width="35" height="125" fill="#1E2A3A"/>
      <rect x="1315" y="245" width="28" height="145" fill="#1C2838"/>
      <polygon points="1315,245 1329,225 1343,245" fill="#161E2E"/>

      <!-- ── CITY BLOCK — LEFT ── -->
      <!-- Tower cluster left -->
      <rect x="95" y="295" width="45" height="100" fill="url(#stoneGrad)" filter="url(#soft-shadow)"/>
      <polygon points="95,295 117.5,265 140,295" fill="url(#roofGrad)"/>
      <rect x="100" y="300" width="8" height="10" fill="rgba(197,160,40,0.4)" class="win-flicker" style="--wf:4s;--wd:0.5s"/>
      <rect x="115" y="300" width="8" height="10" fill="rgba(197,160,40,0.35)" class="win-flicker" style="--wf:3.5s;--wd:1s"/>
      <rect x="130" y="300" width="8" height="10" fill="rgba(197,160,40,0.4)" class="win-flicker" style="--wf:5s;--wd:0.2s"/>
      <rect x="100" y="320" width="8" height="10" fill="rgba(197,160,40,0.3)" class="win-flicker" style="--wf:4.5s;--wd:0.7s"/>
      <rect x="130" y="320" width="8" height="10" fill="rgba(197,160,40,0.35)" class="win-flicker" style="--wf:3.8s;--wd:1.2s"/>

      <rect x="140" y="280" width="55" height="115" fill="url(#stoneGrad)"/>
      <polygon points="140,280 167.5,255 195,280" fill="url(#roofGrad)"/>
      <!-- Round tower -->
      <rect x="142" y="255" width="14" height="30" fill="url(#towerGrad)"/>
      <ellipse cx="149" cy="254" rx="8" ry="6" fill="#1C2A40"/>
      <line x1="149" y1="248" x2="149" y2="238" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="149" cy="237" r="2.5" fill="#C5A028" filter="url(#glow-gold)"/>

      <!-- ── MAIN CASTLE (CENTER) ── -->
      <!-- Castle base / curtain wall -->
      <rect x="520" y="310" width="360" height="85" fill="url(#stoneGrad)" class="castle-glow" filter="url(#soft-shadow)"/>

      <!-- Battlements on wall -->
      <rect x="520" y="303" width="12" height="10" fill="url(#stoneGrad)"/>
      <rect x="537" y="303" width="12" height="10" fill="url(#stoneGrad)"/>
      <rect x="554" y="303" width="12" height="10" fill="url(#stoneGrad)"/>
      <rect x="571" y="303" width="12" height="10" fill="url(#stoneGrad)"/>
      <!-- (continue across) -->
      <rect x="760" y="303" width="12" height="10" fill="url(#stoneGrad)"/>
      <rect x="777" y="303" width="12" height="10" fill="url(#stoneGrad)"/>
      <rect x="794" y="303" width="12" height="10" fill="url(#stoneGrad)"/>
      <rect x="811" y="303" width="12" height="10" fill="url(#stoneGrad)"/>
      <rect x="848" y="303" width="12" height="10" fill="url(#stoneGrad)"/>
      <rect x="865" y="303" width="12" height="10" fill="url(#stoneGrad)"/>

      <!-- Castle main keep (left wing) -->
      <rect x="540" y="245" width="90" height="68" fill="url(#towerGrad)"/>
      <polygon points="540,245 585,215 630,245" fill="url(#roofGrad)"/>
      <!-- Windows keep left -->
      <rect x="555" y="255" width="12" height="16" fill="rgba(197,160,40,0.5)" class="win-flicker" style="--wf:4s;--wd:0.3s"/>
      <rect x="575" y="255" width="12" height="16" fill="rgba(197,160,40,0.45)" class="win-flicker" style="--wf:3.5s;--wd:0.8s"/>
      <rect x="595" y="255" width="12" height="16" fill="rgba(197,160,40,0.5)" class="win-flicker" style="--wf:5s;--wd:0.1s"/>
      <rect x="555" y="278" width="12" height="12" fill="rgba(197,160,40,0.35)" class="win-flicker" style="--wf:4.5s;--wd:1.2s"/>
      <rect x="595" y="278" width="12" height="12" fill="rgba(197,160,40,0.4)" class="win-flicker" style="--wf:3.8s;--wd:0.5s"/>
      <!-- Spire on keep -->
      <line x1="585" y1="215" x2="585" y2="188" stroke="#2A3C56" stroke-width="3"/>
      <line x1="585" y1="188" x2="585" y2="175" stroke="url(#goldGrad)" stroke-width="2" filter="url(#glow-gold)"/>
      <polygon points="580,188 585,175 590,188" fill="#C5A028" filter="url(#glow-gold)"/>

      <!-- Castle main keep (CENTER TOWER - tallest) -->
      <rect x="645" y="195" width="110" height="120" fill="url(#towerGrad)" filter="url(#soft-shadow)"/>
      <polygon points="645,195 700,155 755,195" fill="url(#roofGrad)"/>
      <!-- Center tower windows -->
      <rect x="658" y="210" width="15" height="20" fill="rgba(197,160,40,0.6)" class="win-flicker" style="--wf:3.5s;--wd:0s"/>
      <rect x="682" y="210" width="15" height="20" fill="rgba(197,160,40,0.65)" class="win-flicker" style="--wf:4s;--wd:0.5s"/>
      <rect x="706" y="210" width="15" height="20" fill="rgba(197,160,40,0.6)" class="win-flicker" style="--wf:3.8s;--wd:1s"/>
      <rect x="730" y="210" width="15" height="20" fill="rgba(197,160,40,0.5)" class="win-flicker" style="--wf:5s;--wd:0.3s"/>
      <rect x="658" y="240" width="15" height="16" fill="rgba(197,160,40,0.45)" class="win-flicker" style="--wf:4.5s;--wd:1.1s"/>
      <rect x="682" y="240" width="15" height="16" fill="rgba(197,160,40,0.5)" class="win-flicker" style="--wf:3.2s;--wd:0.7s"/>
      <rect x="706" y="240" width="15" height="16" fill="rgba(197,160,40,0.45)" class="win-flicker" style="--wf:4.2s;--wd:0.2s"/>
      <rect x="730" y="240" width="15" height="16" fill="rgba(197,160,40,0.5)" class="win-flicker" style="--wf:3.7s;--wd:1.4s"/>
      <rect x="658" y="265" width="15" height="14" fill="rgba(197,160,40,0.4)" class="win-flicker" style="--wf:5.5s;--wd:0.4s"/>
      <rect x="706" y="265" width="15" height="14" fill="rgba(197,160,40,0.4)" class="win-flicker" style="--wf:4.8s;--wd:0.9s"/>
      <!-- Gate arch -->
      <path d="M680,312 Q700,295 720,312" fill="none" stroke="#0A1628" stroke-width="3"/>
      <rect x="686" y="293" width="28" height="22" fill="#0A1628" opacity="0.8"/>
      <!-- Main spire -->
      <line x1="700" y1="155" x2="700" y2="128" stroke="#2A3C56" stroke-width="4"/>
      <line x1="700" y1="128" x2="700" y2="108" stroke="url(#goldGrad)" stroke-width="2.5" filter="url(#glow-gold)"/>
      <polygon points="694,128 700,108 706,128" fill="#C5A028" filter="url(#glow-gold)" class="bridge-arch"/>
      <!-- Flag -->
      <polygon points="700,108 720,115 700,122" fill="#C5A028" opacity="0.8" filter="url(#glow-gold)"/>

      <!-- Castle keep (right wing) -->
      <rect x="770" y="250" width="90" height="65" fill="url(#towerGrad)"/>
      <polygon points="770,250 815,220 860,250" fill="url(#roofGrad)"/>
      <rect x="782" y="260" width="12" height="16" fill="rgba(197,160,40,0.5)" class="win-flicker" style="--wf:4.2s;--wd:0.6s"/>
      <rect x="800" y="260" width="12" height="16" fill="rgba(197,160,40,0.45)" class="win-flicker" style="--wf:3.5s;--wd:1.3s"/>
      <rect x="818" y="260" width="12" height="16" fill="rgba(197,160,40,0.5)" class="win-flicker" style="--wf:5.2s;--wd:0.4s"/>
      <rect x="836" y="260" width="12" height="16" fill="rgba(197,160,40,0.4)" class="win-flicker" style="--wf:4s;--wd:0.9s"/>
      <!-- Spire right -->
      <line x1="815" y1="220" x2="815" y2="198" stroke="#2A3C56" stroke-width="3"/>
      <line x1="815" y1="198" x2="815" y2="185" stroke="url(#goldGrad)" stroke-width="2" filter="url(#glow-gold)"/>
      <polygon points="810,198 815,185 820,198" fill="#C5A028" filter="url(#glow-gold)"/>

      <!-- Corner towers on castle wall -->
      <rect x="520" y="278" width="22" height="35" fill="url(#towerGrad)"/>
      <ellipse cx="531" cy="277" rx="13" ry="8" fill="#1A2A40"/>
      <rect x="858" y="278" width="22" height="35" fill="url(#towerGrad)"/>
      <ellipse cx="869" cy="277" rx="13" ry="8" fill="#1A2A40"/>

      <!-- ── CITY BLOCK — RIGHT ── -->
      <rect x="920" y="280" width="60" height="115" fill="url(#stoneGrad)" filter="url(#soft-shadow)"/>
      <polygon points="920,280 950,255 980,280" fill="url(#roofGrad)"/>
      <rect x="924" y="285" width="10" height="14" fill="rgba(197,160,40,0.4)" class="win-flicker" style="--wf:4s;--wd:0.4s"/>
      <rect x="940" y="285" width="10" height="14" fill="rgba(197,160,40,0.35)" class="win-flicker" style="--wf:3.5s;--wd:1.1s"/>
      <rect x="956" y="285" width="10" height="14" fill="rgba(197,160,40,0.4)" class="win-flicker" style="--wf:5s;--wd:0.2s"/>
      <rect x="924" y="308" width="10" height="12" fill="rgba(197,160,40,0.3)" class="win-flicker" style="--wf:4.5s;--wd:0.8s"/>
      <rect x="956" y="308" width="10" height="12" fill="rgba(197,160,40,0.35)" class="win-flicker" style="--wf:3.8s;--wd:1.5s"/>
      <!-- Round tower right side -->
      <rect x="980" y="258" width="18" height="38" fill="url(#towerGrad)"/>
      <ellipse cx="989" cy="257" rx="10" ry="7" fill="#1C2A40"/>
      <line x1="989" y1="250" x2="989" y2="240" stroke="url(#goldGrad)" stroke-width="1.5"/>
      <circle cx="989" cy="239" r="2.5" fill="#C5A028" filter="url(#glow-gold)"/>

      <rect x="998" y="268" width="50" height="127" fill="url(#stoneGrad)"/>
      <polygon points="998,268 1023,248 1048,268" fill="url(#roofGrad)"/>
      <rect x="1048" y="278" width="45" height="117" fill="url(#stoneGrad)"/>
      <polygon points="1048,278 1070,260 1093,278" fill="url(#roofGrad)"/>
      <!-- Spire far right -->
      <line x1="1070" y1="260" x2="1070" y2="242" stroke="#2A3C56" stroke-width="2.5"/>
      <line x1="1070" y1="242" x2="1070" y2="230" stroke="url(#goldGrad)" stroke-width="1.5" filter="url(#glow-gold)"/>
      <polygon points="1066,242 1070,230 1074,242" fill="#C5A028" filter="url(#glow-gold)"/>

      <rect x="1093" y="290" width="55" height="105" fill="url(#stoneGrad)"/>
      <polygon points="1093,290 1120,270 1148,290" fill="url(#roofGrad)"/>
      <rect x="1148" y="295" width="40" height="100" fill="url(#stoneGrad)"/>

      <!-- Far right more buildings -->
      <rect x="1200" y="300" width="60" height="95" fill="url(#stoneGrad)"/>
      <polygon points="1200,300 1230,278 1260,300" fill="url(#roofGrad)"/>
      <rect x="1260" y="285" width="50" height="110" fill="url(#stoneGrad)"/>
      <polygon points="1260,285 1285,265 1310,285" fill="url(#roofGrad)"/>
      <rect x="1310" y="305" width="90" height="90" fill="url(#stoneGrad)"/>

      <!-- ── CHURCH / CATHEDRAL (left of castle) ── -->
      <rect x="370" y="270" width="70" height="125" fill="url(#towerGrad)" filter="url(#soft-shadow)"/>
      <polygon points="370,270 405,235 440,270" fill="url(#roofGrad)"/>
      <!-- Bell towers -->
      <rect x="370" y="235" width="18" height="40" fill="url(#towerGrad)"/>
      <polygon points="370,235 379,218 388,235" fill="#1A2638"/>
      <rect x="422" y="235" width="18" height="40" fill="url(#towerGrad)"/>
      <polygon points="422,235 431,218 440,235" fill="#1A2638"/>
      <!-- Cross -->
      <line x1="379" y1="218" x2="379" y2="205" stroke="#C5A028" stroke-width="2" filter="url(#glow-gold)"/>
      <line x1="374" y1="210" x2="384" y2="210" stroke="#C5A028" stroke-width="2" filter="url(#glow-gold)"/>
      <line x1="431" y1="218" x2="431" y2="205" stroke="#C5A028" stroke-width="2" filter="url(#glow-gold)"/>
      <line x1="426" y1="210" x2="436" y2="210" stroke="#C5A028" stroke-width="2" filter="url(#glow-gold)"/>
      <!-- Cathedral windows -->
      <rect x="380" y="280" width="12" height="18" rx="6" fill="rgba(197,160,40,0.5)" class="win-flicker" style="--wf:4s;--wd:0.2s"/>
      <rect x="400" y="280" width="12" height="18" rx="6" fill="rgba(197,160,40,0.45)" class="win-flicker" style="--wf:3.8s;--wd:0.9s"/>
      <rect x="420" y="280" width="12" height="18" rx="6" fill="rgba(197,160,40,0.5)" class="win-flicker" style="--wf:5s;--wd:0.4s"/>
      <!-- Rose window -->
      <circle cx="405" cy="250" r="10" fill="none" stroke="rgba(197,160,40,0.4)" stroke-width="2"/>
      <circle cx="405" cy="250" r="4" fill="rgba(197,160,40,0.3)"/>

      <!-- ── SEVEN BRIDGES ── -->
      <!-- Bridge 1 (far left, over to left bank) -->
      <g class="bridge-arch">
        <rect x="180" y="390" width="60" height="18" fill="#2A3A52" opacity="0.9"/>
        <path d="M180,392 Q210,375 240,392" fill="none" stroke="#3A4E6A" stroke-width="3" opacity="0.8"/>
        <rect x="180" y="385" width="5" height="23" fill="#3A4E6A"/>
        <rect x="235" y="385" width="5" height="23" fill="#3A4E6A"/>
        <!-- Lamp posts -->
        <line x1="188" y1="385" x2="188" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="188" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
        <line x1="232" y1="385" x2="232" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="232" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
      </g>

      <!-- Bridge 2 -->
      <g class="bridge-arch">
        <rect x="285" y="390" width="65" height="18" fill="#2A3A52" opacity="0.9"/>
        <path d="M285,392 Q317,374 350,392" fill="none" stroke="#3A4E6A" stroke-width="3" opacity="0.8"/>
        <rect x="285" y="385" width="5" height="23" fill="#3A4E6A"/>
        <rect x="345" y="385" width="5" height="23" fill="#3A4E6A"/>
        <line x1="294" y1="385" x2="294" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="294" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
        <line x1="340" y1="385" x2="340" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="340" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
      </g>

      <!-- Bridge 3 (connects island left) -->
      <g class="bridge-arch">
        <rect x="470" y="390" width="60" height="18" fill="#2A3A52" opacity="0.9"/>
        <path d="M470,392 Q500,373 530,392" fill="none" stroke="#3A4E6A" stroke-width="3" opacity="0.8"/>
        <rect x="470" y="385" width="5" height="23" fill="#3A4E6A"/>
        <rect x="525" y="385" width="5" height="23" fill="#3A4E6A"/>
        <line x1="480" y1="385" x2="480" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="480" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
        <line x1="520" y1="385" x2="520" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="520" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
      </g>

      <!-- Bridge 4 (main castle bridge) -->
      <g class="bridge-arch">
        <rect x="650" y="390" width="100" height="18" fill="#2A3A52" opacity="0.95"/>
        <path d="M650,392 Q700,365 750,392" fill="none" stroke="#4A6080" stroke-width="4" opacity="0.9"/>
        <!-- Additional arch detail -->
        <path d="M660,392 Q700,372 740,392" fill="none" stroke="#3A4E6A" stroke-width="2" opacity="0.6"/>
        <rect x="650" y="382" width="7" height="27" fill="#3A4E6A"/>
        <rect x="743" y="382" width="7" height="27" fill="#3A4E6A"/>
        <line x1="663" y1="382" x2="663" y2="374" stroke="#C5A028" stroke-width="2"/>
        <circle cx="663" cy="373" r="2.5" fill="#C5A028" filter="url(#glow-gold)"/>
        <line x1="700" y1="380" x2="700" y2="372" stroke="#C5A028" stroke-width="2"/>
        <circle cx="700" cy="371" r="2.5" fill="#C5A028" filter="url(#glow-gold)"/>
        <line x1="737" y1="382" x2="737" y2="374" stroke="#C5A028" stroke-width="2"/>
        <circle cx="737" cy="373" r="2.5" fill="#C5A028" filter="url(#glow-gold)"/>
      </g>

      <!-- Bridge 5 -->
      <g class="bridge-arch">
        <rect x="855" y="390" width="65" height="18" fill="#2A3A52" opacity="0.9"/>
        <path d="M855,392 Q887,374 920,392" fill="none" stroke="#3A4E6A" stroke-width="3" opacity="0.8"/>
        <rect x="855" y="385" width="5" height="23" fill="#3A4E6A"/>
        <rect x="915" y="385" width="5" height="23" fill="#3A4E6A"/>
        <line x1="865" y1="385" x2="865" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="865" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
        <line x1="910" y1="385" x2="910" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="910" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
      </g>

      <!-- Bridge 6 -->
      <g class="bridge-arch">
        <rect x="1020" y="390" width="60" height="18" fill="#2A3A52" opacity="0.9"/>
        <path d="M1020,392 Q1050,373 1080,392" fill="none" stroke="#3A4E6A" stroke-width="3" opacity="0.8"/>
        <rect x="1020" y="385" width="5" height="23" fill="#3A4E6A"/>
        <rect x="1075" y="385" width="5" height="23" fill="#3A4E6A"/>
        <line x1="1030" y1="385" x2="1030" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="1030" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
        <line x1="1070" y1="385" x2="1070" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="1070" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
      </g>

      <!-- Bridge 7 (far right) -->
      <g class="bridge-arch">
        <rect x="1180" y="390" width="65" height="18" fill="#2A3A52" opacity="0.9"/>
        <path d="M1180,392 Q1212,374 1245,392" fill="none" stroke="#3A4E6A" stroke-width="3" opacity="0.8"/>
        <rect x="1180" y="385" width="5" height="23" fill="#3A4E6A"/>
        <rect x="1240" y="385" width="5" height="23" fill="#3A4E6A"/>
        <line x1="1190" y1="385" x2="1190" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="1190" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
        <line x1="1235" y1="385" x2="1235" y2="378" stroke="#C5A028" stroke-width="1.5"/>
        <circle cx="1235" cy="377" r="2" fill="#C5A028" opacity="0.7" filter="url(#glow-gold)"/>
      </g>

      <!-- River reflections (vertical shimmers) -->
      <line x1="700" y1="408" x2="700" y2="500" stroke="rgba(197,160,40,0.15)" stroke-width="2"/>
      <line x1="690" y1="408" x2="685" y2="500" stroke="rgba(197,160,40,0.06)" stroke-width="1"/>
      <line x1="710" y1="408" x2="715" y2="500" stroke="rgba(197,160,40,0.06)" stroke-width="1"/>
      <line x1="585" y1="408" x2="583" y2="500" stroke="rgba(197,160,40,0.08)" stroke-width="1.5"/>
      <line x1="815" y1="408" x2="817" y2="500" stroke="rgba(197,160,40,0.08)" stroke-width="1.5"/>

      <!-- Foreground ground plane -->
      <rect x="0" y="390" width="1400" height="8" fill="#1C2C44" opacity="0.5"/>

      <!-- "7 bridges" label -->
      <text x="700" y="475" text-anchor="middle" font-family="'Cinzel', serif" font-size="9" fill="rgba(197,160,40,0.35)" letter-spacing="4">PREGEL · VII BRIDGES</text>

    </svg>

    <!-- ── MOON ── -->
    <svg viewBox="0 0 100 100" style="position:absolute;top:8%;right:12%;width:clamp(50px,8vw,100px);z-index:4;opacity:0.85;" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="38" fill="#E8C84A" opacity="0.15"/>
      <circle cx="50" cy="50" r="28" fill="#F5E0A0" opacity="0.2"/>
      <circle cx="50" cy="50" r="18" fill="#FFF8E0" opacity="0.25"/>
    </svg>

    <!-- Hero text -->
    <div class="hero-text-block" style="z-index:20;">
      <p class="hero-kicker">Virtuelle Stadt</p>
      <h1 class="hero-title">KÖNIGSBERG</h1>
      <p class="hero-subtitle">VSK — Persistent Digital Civic Environment</p>
      <div class="hero-rule">
        <div class="hero-rule-line"></div>
        <div class="hero-rule-diamond"></div>
        <div class="hero-rule-line"></div>
      </div>
      <p class="hero-tagline">A virtual city built for universities, institutes,<br>competitions, and international academic activity.</p>
      <a href="#about" class="hero-cta">
        <i class="fas fa-compass" style="font-size:0.8rem;"></i>
        Explore VSK
      </a>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-indicator">
      <span class="scroll-label">Discover</span>
      <div class="scroll-line"></div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════
       ABOUT VSK
  ════════════════════════════════════════════ -->
  <section class="about-section section-pad-lg" id="about">
    <div class="max-content">
      <div class="about-grid">
        <div>
          <p class="section-label">About VSK</p>
          <h2 class="section-title">What is Virtuelle Stadt Königsberg?</h2>
          <div class="gold-divider"></div>
          <p class="section-body" style="margin-bottom:1.25rem;">
            Virtuelle Stadt Königsberg (VSK) is a persistent digital civic environment designed to host universities, institutes, competitions, and international academic activity. It is not a temporary event page or a single-use platform — it is venue infrastructure.
          </p>
          <p class="section-body" style="margin-bottom:1.25rem;">
            VSK provides the spatial and institutional framework for programs connected to the KBI Emerging Technologies Olympiad and the broader European University of Königsberg (EUK) ecosystem. It operates as a structured environment where learning, convening, research, and public-facing institutional activity can take place in digital form.
          </p>
          <p class="section-body">
            Established under the auspices of the KBI Foundation, VSK draws its identity from the historic city of Königsberg — a centre of Enlightenment scholarship, the birthplace of Immanuel Kant, and the site of the famous seven bridges problem that gave rise to modern graph theory. That intellectual heritage informs VSK's ambition: a city built for connected thinking.
          </p>

          <div class="ornament-rule">
            <div class="ornament-line"></div>
            <span class="ornament-glyph">✦</span>
            <div class="ornament-line"></div>
          </div>

          <div class="quote-block">
            <p class="quote-text">"VSK is built for organizations that need more than a static website or a temporary event page — a persistent environment where institutions can host activity, establish digital presence, and collaborate across borders."</p>
            <p class="quote-attribution">— KBI Foundation · VSK Charter</p>
          </div>
        </div>

        <div>
          <div class="about-facts">
            <div class="fact-card">
              <span class="fact-card-num">7</span>
              <span class="fact-card-label">Districts</span>
            </div>
            <div class="fact-card">
              <span class="fact-card-num">∞</span>
              <span class="fact-card-label">Persistent Presence</span>
            </div>
            <div class="fact-card">
              <span class="fact-card-num">EUK</span>
              <span class="fact-card-label">Affiliated Institution</span>
            </div>
            <div class="fact-card">
              <span class="fact-card-num">KBI</span>
              <span class="fact-card-label">Founding Body</span>
            </div>
          </div>

          <div style="margin-top:2.5rem; padding:2rem; border:1px solid rgba(197,160,40,0.2); background:rgba(197,160,40,0.04);">
            <p class="section-label" style="margin-bottom:1rem;">Core Mission</p>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:0.85rem;">
              <li style="display:flex;align-items:flex-start;gap:0.75rem;font-family:'EB Garamond',serif;font-size:1.05rem;line-height:1.6;color:var(--stone-dark);">
                <i class="fas fa-landmark" style="color:var(--gold);font-size:0.75rem;margin-top:0.35rem;flex-shrink:0;"></i>
                Provide persistent digital venue infrastructure for academic institutions
              </li>
              <li style="display:flex;align-items:flex-start;gap:0.75rem;font-family:'EB Garamond',serif;font-size:1.05rem;line-height:1.6;color:var(--stone-dark);">
                <i class="fas fa-globe-europe" style="color:var(--gold);font-size:0.75rem;margin-top:0.35rem;flex-shrink:0;"></i>
                Enable cross-border collaboration and international exchange
              </li>
              <li style="display:flex;align-items:flex-start;gap:0.75rem;font-family:'EB Garamond',serif;font-size:1.05rem;line-height:1.6;color:var(--stone-dark);">
                <i class="fas fa-trophy" style="color:var(--gold);font-size:0.75rem;margin-top:0.35rem;flex-shrink:0;"></i>
                Host the KBI Emerging Technologies Olympiad and affiliated programs
              </li>
              <li style="display:flex;align-items:flex-start;gap:0.75rem;font-family:'EB Garamond',serif;font-size:1.05rem;line-height:1.6;color:var(--stone-dark);">
                <i class="fas fa-building-columns" style="color:var(--gold);font-size:0.75rem;margin-top:0.35rem;flex-shrink:0;"></i>
                Establish institutional digital presence within a coherent civic framework
              </li>
              <li style="display:flex;align-items:flex-start;gap:0.75rem;font-family:'EB Garamond',serif;font-size:1.05rem;line-height:1.6;color:var(--stone-dark);">
                <i class="fas fa-network-wired" style="color:var(--gold);font-size:0.75rem;margin-top:0.35rem;flex-shrink:0;"></i>
                Participate in a broader academic and civic ecosystem
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════
       THREE PILLARS
  ════════════════════════════════════════════ -->
  <section class="pillars-section section-pad-lg" id="pillars">
    <div class="max-content">
      <div style="text-align:center; max-width:680px; margin:0 auto;">
        <p class="section-label">Functional Pillars</p>
        <h2 class="section-title">Three Domains of Activity</h2>
        <div class="gold-divider gold-divider-center"></div>
        <p class="section-body">
          VSK organises its activity around three principal domains. Each pillar corresponds to dedicated districts, venue types, and institutional functions within the virtual city.
        </p>
      </div>

      <div class="pillars-grid">
        <!-- EDUCATION -->
        <div class="pillar-card">
          <span class="pillar-number">01</span>
          <i class="fas fa-university pillar-icon"></i>
          <h3 class="pillar-title">Education</h3>
          <p class="pillar-body">
            VSK's educational infrastructure mirrors the spatial logic of a university campus. Faculty spaces, lecture halls, and seminar rooms provide persistent digital venues for structured academic delivery across disciplines and institutions.
          </p>
          <ul class="pillar-features">
            <li>Virtual classrooms &amp; lecture halls</li>
            <li>Seminar rooms &amp; tutorial spaces</li>
            <li>Faculty &amp; departmental offices</li>
            <li>Student study commons</li>
            <li>Open courseware repositories</li>
            <li>Visiting scholar residencies</li>
          </ul>
        </div>

        <!-- RESEARCH -->
        <div class="pillar-card">
          <span class="pillar-number">02</span>
          <i class="fas fa-flask pillar-icon"></i>
          <h3 class="pillar-title">Research</h3>
          <p class="pillar-body">
            The Research District supports colloquia, interdisciplinary exchange, and active inquiry. Digital labs, forum spaces, and working group environments enable long-term collaborative investigation across institutional and national borders.
          </p>
          <ul class="pillar-features">
            <li>Research labs &amp; working groups</li>
            <li>Academic colloquia &amp; symposia</li>
            <li>Interdisciplinary exchange forums</li>
            <li>Peer review &amp; publication spaces</li>
            <li>Data &amp; archive repositories</li>
            <li>Joint institute partnerships</li>
          </ul>
        </div>

        <!-- EVENTS -->
        <div class="pillar-card">
          <span class="pillar-number">03</span>
          <i class="fas fa-medal pillar-icon"></i>
          <h3 class="pillar-title">Events</h3>
          <p class="pillar-body">
            From international competitions to civic gatherings, VSK's event infrastructure provides conference grounds, exhibition halls, and dedicated competition venues. These spaces serve as the primary stage for VSK's public-facing institutional activity.
          </p>
          <ul class="pillar-features">
            <li>Conference &amp; convention grounds</li>
            <li>Exhibition halls &amp; galleries</li>
            <li>Competition venues &amp; arenas</li>
            <li>Civic gathering &amp; assembly spaces</li>
            <li>Award ceremonies &amp; public forums</li>
            <li>International press &amp; media facilities</li>
          </ul>
        </div>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════
       DISTRICTS
  ════════════════════════════════════════════ -->
  <section class="districts-section section-pad-lg" id="districts">
    <div class="max-content">
      <div style="max-width:680px;">
        <p class="section-label">Urban Districts</p>
        <h2 class="section-title">The City of Königsberg</h2>
        <div class="gold-divider"></div>
        <p class="section-body">
          VSK is organised into seven distinct districts, each serving a defined institutional purpose. Visitors and participating organisations can identify which district hosts their activity, establish presence, and navigate the city's civic infrastructure.
        </p>
      </div>

      <!-- City Map Schematic -->
      <div class="city-map-container">
        <svg viewBox="0 0 1100 360" preserveAspectRatio="xMidYMid meet" class="map-svg-bg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#070F1E"/>
              <stop offset="100%" stop-color="#0D1A2E"/>
            </linearGradient>
            <filter id="map-glow">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          <!-- Map background -->
          <rect x="0" y="0" width="1100" height="360" fill="url(#mapBg)" rx="4"/>

          <!-- Grid lines (city planning grid) -->
          <g stroke="rgba(197,160,40,0.05)" stroke-width="1">
            <line x1="0" y1="60" x2="1100" y2="60"/>
            <line x1="0" y1="120" x2="1100" y2="120"/>
            <line x1="0" y1="180" x2="1100" y2="180"/>
            <line x1="0" y1="240" x2="1100" y2="240"/>
            <line x1="0" y1="300" x2="1100" y2="300"/>
            <line x1="100" y1="0" x2="100" y2="360"/>
            <line x1="220" y1="0" x2="220" y2="360"/>
            <line x1="380" y1="0" x2="380" y2="360"/>
            <line x1="520" y1="0" x2="520" y2="360"/>
            <line x1="660" y1="0" x2="660" y2="360"/>
            <line x1="800" y1="0" x2="800" y2="360"/>
            <line x1="940" y1="0" x2="940" y2="360"/>
          </g>

          <!-- River band -->
          <rect x="0" y="290" width="1100" height="50" fill="rgba(10,28,60,0.6)"/>
          <line x1="0" y1="293" x2="1100" y2="293" stroke="rgba(100,160,220,0.2)" stroke-width="2"/>

          <!-- District blocks -->
          <!-- 1: Academic Quarter -->
          <rect x="20" y="20" width="190" height="180" fill="rgba(197,160,40,0.06)" stroke="rgba(197,160,40,0.3)" stroke-width="1.5" rx="2"/>
          <rect x="30" y="30" width="170" height="50" fill="rgba(197,160,40,0.08)" rx="1"/>
          <text x="115" y="60" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#E2C96A" letter-spacing="1">ACADEMIC</text>
          <text x="115" y="74" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#E2C96A" letter-spacing="1">QUARTER</text>
          <!-- Mini buildings -->
          <rect x="35" y="90" width="22" height="30" fill="rgba(197,160,40,0.15)" stroke="rgba(197,160,40,0.2)" stroke-width="0.5"/>
          <rect x="62" y="80" width="18" height="40" fill="rgba(197,160,40,0.12)" stroke="rgba(197,160,40,0.2)" stroke-width="0.5"/>
          <rect x="85" y="95" width="25" height="25" fill="rgba(197,160,40,0.1)" stroke="rgba(197,160,40,0.2)" stroke-width="0.5"/>
          <rect x="115" y="85" width="30" height="35" fill="rgba(197,160,40,0.15)" stroke="rgba(197,160,40,0.2)" stroke-width="0.5"/>
          <rect x="150" y="92" width="20" height="28" fill="rgba(197,160,40,0.1)" stroke="rgba(197,160,40,0.2)" stroke-width="0.5"/>
          <rect x="35" y="140" width="60" height="20" fill="rgba(197,160,40,0.06)" stroke="rgba(197,160,40,0.15)" stroke-width="0.5"/>
          <text x="65" y="154" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" fill="rgba(197,160,40,0.5)" letter-spacing="1">Lecture Halls</text>
          <rect x="110" y="140" width="70" height="20" fill="rgba(197,160,40,0.06)" stroke="rgba(197,160,40,0.15)" stroke-width="0.5"/>
          <text x="145" y="154" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" fill="rgba(197,160,40,0.5)" letter-spacing="1">Faculty</text>

          <!-- 2: Research District -->
          <rect x="230" y="20" width="190" height="180" fill="rgba(100,180,255,0.04)" stroke="rgba(100,180,255,0.25)" stroke-width="1.5" rx="2"/>
          <rect x="240" y="30" width="170" height="50" fill="rgba(100,180,255,0.06)" rx="1"/>
          <text x="325" y="60" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#A0C8F0" letter-spacing="1">RESEARCH</text>
          <text x="325" y="74" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#A0C8F0" letter-spacing="1">DISTRICT</text>
          <!-- Lab shapes -->
          <circle cx="270" cy="115" r="18" fill="rgba(100,180,255,0.06)" stroke="rgba(100,180,255,0.2)" stroke-width="0.5"/>
          <circle cx="310" cy="105" r="14" fill="rgba(100,180,255,0.08)" stroke="rgba(100,180,255,0.2)" stroke-width="0.5"/>
          <rect x="330" y="90" width="30" height="35" fill="rgba(100,180,255,0.06)" stroke="rgba(100,180,255,0.15)" stroke-width="0.5"/>
          <rect x="365" y="98" width="20" height="27" fill="rgba(100,180,255,0.06)" stroke="rgba(100,180,255,0.15)" stroke-width="0.5"/>
          <rect x="245" y="140" width="75" height="18" fill="rgba(100,180,255,0.04)" stroke="rgba(100,180,255,0.15)" stroke-width="0.5"/>
          <text x="282" y="153" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" fill="rgba(100,180,255,0.45)" letter-spacing="1">Labs</text>
          <rect x="325" y="140" width="75" height="18" fill="rgba(100,180,255,0.04)" stroke="rgba(100,180,255,0.15)" stroke-width="0.5"/>
          <text x="362" y="153" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" fill="rgba(100,180,255,0.45)" letter-spacing="1">Colloquia</text>

          <!-- 3: Civic Forum -->
          <rect x="440" y="20" width="210" height="180" fill="rgba(220,160,255,0.04)" stroke="rgba(220,160,255,0.2)" stroke-width="1.5" rx="2"/>
          <rect x="450" y="30" width="190" height="50" fill="rgba(220,160,255,0.06)" rx="1"/>
          <text x="545" y="60" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#D4A8F5" letter-spacing="1">CIVIC</text>
          <text x="545" y="74" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#D4A8F5" letter-spacing="1">FORUM</text>
          <!-- Civic plaza -->
          <ellipse cx="545" cy="120" rx="50" ry="35" fill="rgba(220,160,255,0.04)" stroke="rgba(220,160,255,0.18)" stroke-width="1"/>
          <ellipse cx="545" cy="120" rx="28" ry="18" fill="rgba(220,160,255,0.07)" stroke="rgba(220,160,255,0.25)" stroke-width="0.5"/>
          <circle cx="545" cy="120" r="5" fill="rgba(220,160,255,0.3)"/>
          <rect x="455" y="155" width="65" height="18" fill="rgba(220,160,255,0.04)" stroke="rgba(220,160,255,0.15)" stroke-width="0.5"/>
          <text x="487" y="167" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" fill="rgba(220,160,255,0.45)" letter-spacing="1">Assembly</text>
          <rect x="525" y="155" width="65" height="18" fill="rgba(220,160,255,0.04)" stroke="rgba(220,160,255,0.15)" stroke-width="0.5"/>
          <text x="557" y="167" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" fill="rgba(220,160,255,0.45)" letter-spacing="1">Forum</text>

          <!-- 4: Exhibition District (spans mid-lower) -->
          <rect x="670" y="20" width="180" height="180" fill="rgba(255,200,100,0.04)" stroke="rgba(255,200,100,0.2)" stroke-width="1.5" rx="2"/>
          <rect x="680" y="30" width="160" height="50" fill="rgba(255,200,100,0.06)" rx="1"/>
          <text x="760" y="60" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#F5CA80" letter-spacing="1">EXHIBITION</text>
          <text x="760" y="74" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#F5CA80" letter-spacing="1">DISTRICT</text>
          <rect x="685" y="88" width="40" height="55" fill="rgba(255,200,100,0.06)" stroke="rgba(255,200,100,0.2)" stroke-width="0.5"/>
          <rect x="730" y="88" width="40" height="55" fill="rgba(255,200,100,0.06)" stroke="rgba(255,200,100,0.2)" stroke-width="0.5"/>
          <rect x="775" y="88" width="40" height="55" fill="rgba(255,200,100,0.06)" stroke="rgba(255,200,100,0.2)" stroke-width="0.5"/>
          <rect x="685" y="152" width="130" height="18" fill="rgba(255,200,100,0.04)" stroke="rgba(255,200,100,0.15)" stroke-width="0.5"/>
          <text x="750" y="165" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" fill="rgba(255,200,100,0.45)" letter-spacing="1">Galleries · Pavilions</text>

          <!-- 5: Event Grounds (bottom right) -->
          <rect x="865" y="20" width="220" height="180" fill="rgba(255,120,120,0.04)" stroke="rgba(255,120,120,0.2)" stroke-width="1.5" rx="2"/>
          <rect x="875" y="30" width="200" height="50" fill="rgba(255,120,120,0.06)" rx="1"/>
          <text x="975" y="60" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#F5A0A0" letter-spacing="1">EVENT</text>
          <text x="975" y="74" text-anchor="middle" font-family="'Cinzel',serif" font-size="11" fill="#F5A0A0" letter-spacing="1">GROUNDS</text>
          <!-- Stadium shape -->
          <ellipse cx="975" cy="130" rx="70" ry="40" fill="rgba(255,120,120,0.04)" stroke="rgba(255,120,120,0.2)" stroke-width="1"/>
          <ellipse cx="975" cy="130" rx="45" ry="25" fill="rgba(255,120,120,0.07)" stroke="rgba(255,120,120,0.15)" stroke-width="0.5"/>
          <text x="975" y="134" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" fill="rgba(255,120,120,0.4)" letter-spacing="1">Arena</text>
          <rect x="875" y="162" width="90" height="18" fill="rgba(255,120,120,0.04)" stroke="rgba(255,120,120,0.12)" stroke-width="0.5"/>
          <text x="920" y="175" text-anchor="middle" font-family="'Inter',sans-serif" font-size="7" fill="rgba(255,120,120,0.4)" letter-spacing="1">Conf. Halls</text>

          <!-- 6: Institutional Houses (lower left) -->
          <rect x="20" y="215" width="190" height="68" fill="rgba(100,220,180,0.04)" stroke="rgba(100,220,180,0.2)" stroke-width="1.5" rx="2"/>
          <text x="115" y="248" text-anchor="middle" font-family="'Cinzel',serif" font-size="10" fill="#90DEC0" letter-spacing="1">INSTITUTIONAL HOUSES</text>
          <rect x="30" y="255" width="25" height="22" fill="rgba(100,220,180,0.08)" stroke="rgba(100,220,180,0.2)" stroke-width="0.5"/>
          <rect x="60" y="255" width="25" height="22" fill="rgba(100,220,180,0.08)" stroke="rgba(100,220,180,0.2)" stroke-width="0.5"/>
          <rect x="90" y="255" width="25" height="22" fill="rgba(100,220,180,0.08)" stroke="rgba(100,220,180,0.2)" stroke-width="0.5"/>
          <rect x="120" y="255" width="25" height="22" fill="rgba(100,220,180,0.08)" stroke="rgba(100,220,180,0.2)" stroke-width="0.5"/>
          <rect x="150" y="255" width="25" height="22" fill="rgba(100,220,180,0.08)" stroke="rgba(100,220,180,0.2)" stroke-width="0.5"/>

          <!-- 7: ETO 2026 Zone (lower right, special highlight) -->
          <rect x="230" y="215" width="840" height="68" fill="rgba(197,160,40,0.08)" stroke="rgba(197,160,40,0.4)" stroke-width="2" rx="2"/>
          <text x="280" y="248" text-anchor="start" font-family="'Cinzel',serif" font-size="10" fill="#E2C96A" letter-spacing="2">ETO 2026 VENUE ZONE</text>
          <text x="1050" y="248" text-anchor="end" font-family="'Inter',sans-serif" font-size="9" fill="rgba(197,160,40,0.6)" letter-spacing="1">Dec 18–20, 2026</text>
          <!-- Dots for ETO venues -->
          <circle cx="320" cy="265" r="4" fill="#C5A028" filter="url(#map-glow)"/>
          <circle cx="420" cy="265" r="4" fill="#C5A028" filter="url(#map-glow)"/>
          <circle cx="540" cy="265" r="4" fill="#C5A028" filter="url(#map-glow)"/>
          <circle cx="650" cy="265" r="4" fill="#C5A028" filter="url(#map-glow)"/>
          <circle cx="760" cy="265" r="4" fill="#C5A028" filter="url(#map-glow)"/>
          <circle cx="870" cy="265" r="4" fill="#C5A028" filter="url(#map-glow)"/>
          <circle cx="980" cy="265" r="4" fill="#C5A028" filter="url(#map-glow)"/>

          <!-- Connecting roads -->
          <line x1="210" y1="110" x2="230" y2="110" stroke="rgba(197,160,40,0.25)" stroke-width="2"/>
          <line x1="420" y1="110" x2="440" y2="110" stroke="rgba(197,160,40,0.25)" stroke-width="2"/>
          <line x1="650" y1="110" x2="670" y2="110" stroke="rgba(197,160,40,0.25)" stroke-width="2"/>
          <line x1="850" y1="110" x2="865" y2="110" stroke="rgba(197,160,40,0.25)" stroke-width="2"/>
          <line x1="115" y1="200" x2="115" y2="215" stroke="rgba(197,160,40,0.25)" stroke-width="2"/>

          <!-- River bridges on map -->
          <rect x="90" y="285" width="40" height="8" fill="rgba(197,160,40,0.3)" rx="1"/>
          <rect x="270" y="285" width="40" height="8" fill="rgba(197,160,40,0.3)" rx="1"/>
          <rect x="470" y="285" width="40" height="8" fill="rgba(197,160,40,0.3)" rx="1"/>
          <rect x="620" y="285" width="40" height="8" fill="rgba(197,160,40,0.3)" rx="1"/>
          <rect x="780" y="285" width="40" height="8" fill="rgba(197,160,40,0.3)" rx="1"/>
          <rect x="930" y="285" width="40" height="8" fill="rgba(197,160,40,0.3)" rx="1"/>
          <rect x="1040" y="285" width="40" height="8" fill="rgba(197,160,40,0.3)" rx="1"/>

          <!-- Compass rose -->
          <g transform="translate(1060,35)">
            <circle r="18" fill="none" stroke="rgba(197,160,40,0.3)" stroke-width="1"/>
            <line x1="0" y1="-14" x2="0" y2="14" stroke="rgba(197,160,40,0.5)" stroke-width="1"/>
            <line x1="-14" y1="0" x2="14" y2="0" stroke="rgba(197,160,40,0.5)" stroke-width="1"/>
            <polygon points="0,-14 3,-6 0,-8 -3,-6" fill="#C5A028" opacity="0.8"/>
            <text x="0" y="-18" text-anchor="middle" font-family="'Cinzel',serif" font-size="8" fill="rgba(197,160,40,0.7)">N</text>
          </g>

          <!-- Legend -->
          <text x="20" y="350" font-family="'Inter',sans-serif" font-size="8" fill="rgba(197,160,40,0.4)" letter-spacing="2">VIRTUELLE STADT KÖNIGSBERG · CITY PLAN · SCHEMATIC</text>
        </svg>
      </div>

      <!-- District Cards -->
      <div class="districts-grid" style="margin-top:3rem;">

        <!-- 1 Academic Quarter -->
        <div class="district-card">
          <span class="district-bg-num">01</span>
          <p class="district-tag">District I</p>
          <h3 class="district-name">Academic Quarter</h3>
          <p class="district-desc">The educational core of VSK. Universities and institutes establish faculty presence here, hosting lectures, seminars, and degree-linked programs in a coherent campus setting.</p>
          <div class="district-venues">
            <span class="venue-tag">Lecture Halls</span>
            <span class="venue-tag">Seminar Rooms</span>
            <span class="venue-tag">Faculty Offices</span>
            <span class="venue-tag">Study Commons</span>
          </div>
        </div>

        <!-- 2 Research District -->
        <div class="district-card">
          <span class="district-bg-num">02</span>
          <p class="district-tag">District II</p>
          <h3 class="district-name">Research District</h3>
          <p class="district-desc">Purpose-built for interdisciplinary exchange. Research labs, working groups, and colloquia spaces enable long-term collaborative inquiry across institutional and national boundaries.</p>
          <div class="district-venues">
            <span class="venue-tag">Research Labs</span>
            <span class="venue-tag">Colloquia</span>
            <span class="venue-tag">Forums</span>
            <span class="venue-tag">Archives</span>
          </div>
        </div>

        <!-- 3 Civic Forum -->
        <div class="district-card">
          <span class="district-bg-num">03</span>
          <p class="district-tag">District III</p>
          <h3 class="district-name">Civic Forum</h3>
          <p class="district-desc">The public square of VSK. Open assemblies, public lectures, policy discussions, and cross-sector convening take place in the Civic Forum — accessible to all participants.</p>
          <div class="district-venues">
            <span class="venue-tag">Assembly Hall</span>
            <span class="venue-tag">Public Forum</span>
            <span class="venue-tag">Debate Chambers</span>
          </div>
        </div>

        <!-- 4 Exhibition District -->
        <div class="district-card">
          <span class="district-bg-num">04</span>
          <p class="district-tag">District IV</p>
          <h3 class="district-name">Exhibition District</h3>
          <p class="district-desc">Galleries, pavilions, and curated display environments for projects, artefacts, and institutional presentations. Institutions may mount permanent or rotating exhibitions within this district.</p>
          <div class="district-venues">
            <span class="venue-tag">Galleries</span>
            <span class="venue-tag">Pavilions</span>
            <span class="venue-tag">Project Spaces</span>
          </div>
        </div>

        <!-- 5 Event Grounds -->
        <div class="district-card">
          <span class="district-bg-num">05</span>
          <p class="district-tag">District V</p>
          <h3 class="district-name">Event Grounds</h3>
          <p class="district-desc">Large-capacity conference halls, competition arenas, and civic gathering spaces for VSK's major calendar events. Primary venue for the KBI Emerging Technologies Olympiad.</p>
          <div class="district-venues">
            <span class="venue-tag">Conference Hall</span>
            <span class="venue-tag">Competition Arena</span>
            <span class="venue-tag">Press Centre</span>
            <span class="venue-tag">Award Hall</span>
          </div>
        </div>

        <!-- 6 Institutional Houses -->
        <div class="district-card">
          <span class="district-bg-num">06</span>
          <p class="district-tag">District VI</p>
          <h3 class="district-name">Institutional Houses</h3>
          <p class="district-desc">Dedicated address spaces for universities, think tanks, academies, and organisations establishing persistent digital presence within VSK. Each institution receives its own house within the district.</p>
          <div class="district-venues">
            <span class="venue-tag">Org. Headquarters</span>
            <span class="venue-tag">Embassy Row</span>
            <span class="venue-tag">Affiliate Offices</span>
          </div>
        </div>

        <!-- 7 ETO 2026 (spans 3 cols on desktop, at bottom) -->
        <div class="district-card" style="grid-column: 1 / -1; border-color: rgba(197,160,40,0.35); background: rgba(197,160,40,0.06);">
          <p class="district-tag">Special Venue · 2026</p>
          <h3 class="district-name" style="color: var(--gold-light);">ETO 2026 — Emerging Technologies Olympiad</h3>
          <p class="district-desc" style="max-width: 800px;">The ETO 2026 venue zone activates facilities across all VSK districts for the three-day Olympiad, December 18–20, 2026. Competition rounds, keynote addresses, award ceremonies, and international delegations convene across the city's purpose-built event infrastructure.</p>
          <div class="district-venues">
            <span class="venue-tag">Competition Rounds</span>
            <span class="venue-tag">Keynote Theatre</span>
            <span class="venue-tag">International Delegations</span>
            <span class="venue-tag">Awards Ceremony</span>
            <span class="venue-tag">Opening Ceremony</span>
            <span class="venue-tag">Media &amp; Press</span>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════
       ETO 2026
  ════════════════════════════════════════════ -->
  <section class="eto-section section-pad-lg" id="eto2026">
    <div class="max-content">
      <div class="eto-grid">
        <div>
          <div class="eto-badge">
            <i class="fas fa-trophy"></i>
            KBI Emerging Technologies Olympiad
          </div>
          <h2 class="section-title">ETO 2026<br>in Virtuelle Stadt Königsberg</h2>
          <div class="gold-divider"></div>
          <p class="section-body" style="margin-bottom:1.25rem;">
            The Emerging Technologies Olympiad 2026 will be held in the Virtual City of Königsberg from <strong style="color:var(--gold-light);">December 18 to 20, 2026</strong>. VSK serves as the designated host environment for the event, providing a shared digital venue for participation, visibility, and international exchange.
          </p>
          <p class="section-body" style="margin-bottom:1.25rem;">
            ETO 2026 brings together student teams, research institutions, and technology organisations from across the world to compete, exhibit, and convene within VSK's purpose-built civic infrastructure. The Olympiad operates as the flagship annual event of the KBI Emerging Technologies program.
          </p>
          <p class="section-body">
            As VSK's primary hosted event, ETO 2026 activates the full breadth of the city's districts — from the Academic Quarter's lecture facilities to the Event Grounds' competition arenas and the Civic Forum's public assembly spaces.
          </p>

          <ul class="eto-features-list">
            <li><i class="fas fa-check-circle"></i> International student competition across emerging technology disciplines</li>
            <li><i class="fas fa-check-circle"></i> Keynote addresses by leading researchers and technologists</li>
            <li><i class="fas fa-check-circle"></i> Exhibition of student and institutional projects</li>
            <li><i class="fas fa-check-circle"></i> Formal awards ceremony and delegation assembly</li>
            <li><i class="fas fa-check-circle"></i> Open sessions accessible to the public and media</li>
          </ul>
        </div>

        <div>
          <div class="eto-date-block">
            <div class="eto-date-item">
              <span class="eto-date-num">18</span>
              <span class="eto-date-label">December</span>
              <span class="eto-date-label">Opening Day</span>
            </div>
            <div class="eto-date-item">
              <span class="eto-date-num">19</span>
              <span class="eto-date-label">December</span>
              <span class="eto-date-label">Competition Day</span>
            </div>
            <div class="eto-date-item">
              <span class="eto-date-num">20</span>
              <span class="eto-date-label">December</span>
              <span class="eto-date-label">Awards Day</span>
            </div>
          </div>

          <div style="margin-top:2rem; padding:2rem; border:1px solid rgba(197,160,40,0.25); background:rgba(197,160,40,0.05);">
            <p class="section-label" style="margin-bottom:1.5rem;">Program Overview</p>
            <div style="display:flex;flex-direction:column;gap:1.2rem;">
              <div style="display:flex;gap:1rem;align-items:flex-start;">
                <div style="width:36px;height:36px;border:1px solid rgba(197,160,40,0.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i class="fas fa-flag" style="color:var(--gold);font-size:0.75rem;"></i>
                </div>
                <div>
                  <p style="font-family:'Cinzel',serif;font-size:0.8rem;font-weight:600;color:white;margin-bottom:0.25rem;">Opening Ceremony</p>
                  <p style="font-family:'EB Garamond',serif;font-size:0.95rem;color:var(--stone-dark);">Dec 18 · Civic Forum, VSK — Official welcome, institutional addresses, delegation parade</p>
                </div>
              </div>
              <div style="display:flex;gap:1rem;align-items:flex-start;">
                <div style="width:36px;height:36px;border:1px solid rgba(197,160,40,0.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i class="fas fa-laptop-code" style="color:var(--gold);font-size:0.75rem;"></i>
                </div>
                <div>
                  <p style="font-family:'Cinzel',serif;font-size:0.8rem;font-weight:600;color:white;margin-bottom:0.25rem;">Competition Rounds</p>
                  <p style="font-family:'EB Garamond',serif;font-size:0.95rem;color:var(--stone-dark);">Dec 18–19 · Event Grounds — Technical challenges, judging panels, live scoring</p>
                </div>
              </div>
              <div style="display:flex;gap:1rem;align-items:flex-start;">
                <div style="width:36px;height:36px;border:1px solid rgba(197,160,40,0.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i class="fas fa-microphone-alt" style="color:var(--gold);font-size:0.75rem;"></i>
                </div>
                <div>
                  <p style="font-family:'Cinzel',serif;font-size:0.8rem;font-weight:600;color:white;margin-bottom:0.25rem;">Keynotes &amp; Symposia</p>
                  <p style="font-family:'EB Garamond',serif;font-size:0.95rem;color:var(--stone-dark);">Dec 19 · Academic Quarter — Open lectures, research presentations, panel discussions</p>
                </div>
              </div>
              <div style="display:flex;gap:1rem;align-items:flex-start;">
                <div style="width:36px;height:36px;border:1px solid rgba(197,160,40,0.4);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <i class="fas fa-award" style="color:var(--gold);font-size:0.75rem;"></i>
                </div>
                <div>
                  <p style="font-family:'Cinzel',serif;font-size:0.8rem;font-weight:600;color:white;margin-bottom:0.25rem;">Awards Ceremony</p>
                  <p style="font-family:'EB Garamond',serif;font-size:0.95rem;color:var(--stone-dark);">Dec 20 · Grand Hall, Event Grounds — Medals, citations, institutional recognitions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════
       INSTITUTIONAL PARTICIPATION
  ════════════════════════════════════════════ -->
  <section class="institutions-section section-pad-lg" id="participate">
    <div class="max-content">
      <div style="text-align:center; max-width:680px; margin:0 auto;">
        <p class="section-label">Participation</p>
        <h2 class="section-title">How Institutions Participate</h2>
        <div class="gold-divider gold-divider-center"></div>
        <p class="section-body">
          VSK is built for organisations that require more than a static website or a temporary event page. It provides a persistent environment where institutions can host activity, establish digital presence, collaborate across borders, and participate in a broader academic and civic ecosystem.
        </p>
      </div>

      <div class="participation-grid">
        <div class="participation-card">
          <i class="fas fa-building-columns"></i>
          <p class="participation-card-title">Universities</p>
          <p class="participation-card-desc">Establish faculty presence, host courses and seminars, and maintain a persistent academic address within the Academic Quarter.</p>
        </div>
        <div class="participation-card">
          <i class="fas fa-microscope"></i>
          <p class="participation-card-title">Research Institutes</p>
          <p class="participation-card-desc">Operate labs and working groups within the Research District, host colloquia, and engage in interdisciplinary exchange programs.</p>
        </div>
        <div class="participation-card">
          <i class="fas fa-trophy"></i>
          <p class="participation-card-title">Competition Teams</p>
          <p class="participation-card-desc">Register delegations for ETO 2026 and future Olympiad editions. Access competition facilities, team prep rooms, and official scoring infrastructure.</p>
        </div>
        <div class="participation-card">
          <i class="fas fa-handshake"></i>
          <p class="participation-card-title">Partner Organisations</p>
          <p class="participation-card-desc">Establish an Institutional House in District VI, participate in the Civic Forum, and co-host exhibitions, forums, and programs across VSK.</p>
        </div>
      </div>

      <div style="margin-top:4rem; padding:3rem; border:1px solid rgba(197,160,40,0.2); background:rgba(197,160,40,0.04); text-align:center;">
        <p class="section-label" style="margin-bottom:1rem;">Institutional Enquiries</p>
        <h3 style="font-family:'Cinzel',serif;font-size:1.5rem;font-weight:600;color:white;margin-bottom:1rem;">Establish Your Presence in VSK</h3>
        <p style="font-family:'EB Garamond',serif;font-size:1.1rem;line-height:1.75;color:var(--stone-dark);max-width:600px;margin:0 auto 2rem;">
          Organisations seeking to participate in VSK — whether as academic partners, ETO 2026 competitors, or institutional residents — are invited to contact the KBI Foundation to discuss their participation framework.
        </p>
        <div style="display:flex;align-items:center;justify-content:center;gap:1rem;flex-wrap:wrap;">
          <span style="font-family:'Inter',sans-serif;font-size:0.7rem;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);padding:0.75rem 2rem;border:1px solid rgba(197,160,40,0.4);background:rgba(197,160,40,0.08);">
            <i class="fas fa-envelope" style="margin-right:0.5rem;"></i>KBI Foundation · Institutional Affairs
          </span>
          <span style="font-family:'Inter',sans-serif;font-size:0.7rem;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:var(--stone-dark);padding:0.75rem 2rem;border:1px solid rgba(197,160,40,0.15);">
            <i class="fas fa-globe" style="margin-right:0.5rem;color:var(--gold);"></i>EUK Affiliated Program
          </span>
        </div>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════
       FOOTER
  ════════════════════════════════════════════ -->
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div>
          <span class="footer-logo">VSK</span>
          <p class="footer-tagline">Virtuelle Stadt Königsberg — a persistent digital civic environment for education, research, events, and institutional presence.</p>
          <div style="margin-top:1.5rem; display:flex; align-items:center; gap:0.75rem;">
            <div style="width:28px;height:1px;background:rgba(197,160,40,0.4);"></div>
            <span style="font-family:'Inter',sans-serif;font-size:0.62rem;font-weight:500;letter-spacing:0.15em;text-transform:uppercase;color:rgba(197,160,40,0.6);">KBI Foundation · EUK</span>
          </div>
        </div>
        <div>
          <p class="footer-col-title">Districts</p>
          <ul class="footer-links">
            <li><a href="#districts">Academic Quarter</a></li>
            <li><a href="#districts">Research District</a></li>
            <li><a href="#districts">Civic Forum</a></li>
            <li><a href="#districts">Exhibition District</a></li>
            <li><a href="#districts">Event Grounds</a></li>
            <li><a href="#districts">Institutional Houses</a></li>
          </ul>
        </div>
        <div>
          <p class="footer-col-title">Programs</p>
          <ul class="footer-links">
            <li><a href="#eto2026">ETO 2026</a></li>
            <li><a href="#pillars">Education</a></li>
            <li><a href="#pillars">Research</a></li>
            <li><a href="#pillars">Events</a></li>
            <li><a href="#participate">Participate</a></li>
            <li><a href="#about">About VSK</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copy">© 2026 Virtuelle Stadt Königsberg · KBI Foundation · All rights reserved · Königsberg, Prussia 1255 — VSK, Digital 2026</p>
        <div class="footer-badges">
          <span class="footer-badge">KBI</span>
          <span class="footer-badge">EUK</span>
          <span class="footer-badge">ETO 2026</span>
        </div>
      </div>
    </div>
  </footer>

  <!-- ═══════════════════════════════════════════
       SCRIPTS
  ════════════════════════════════════════════ -->
  <script>
    // ── STAR FIELD ──
    const starsLayer = document.getElementById('stars-layer');
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() < 0.05 ? Math.random() * 3 + 2 : Math.random() * 1.8 + 0.4;
      const x = Math.random() * 100;
      const y = Math.random() * 65;
      const delay = Math.random() * 5;
      const duration = 2.5 + Math.random() * 4;
      const minOp = 0.15 + Math.random() * 0.4;
      star.style.cssText = [
        'width:' + size + 'px',
        'height:' + size + 'px',
        'left:' + x + '%',
        'top:' + y + '%',
        '--d:' + duration + 's',
        '--delay:' + delay + 's',
        '--min-op:' + minOp
      ].join(';');
      starsLayer.appendChild(star);
    }

    // ── NAV SCROLL ──
    const nav = document.getElementById('site-nav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  </script>

</body>
</html>`)
})

export default app
