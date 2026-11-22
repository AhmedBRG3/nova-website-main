// ─────────────────────────────────────────
//  App.jsx
//  Root component — owns the preloader state
//  and routes between the single-page home
//  layout and individual case-study pages.
//
//  When Preloader calls onDone(), we add the
//  `loaded` class to <body>. Almost every
//  entrance animation in GlobalStyles.jsx is
//  written as `body.loaded .some-class{...}`,
//  so that single class flip is what choreographs
//  the nav fading in, the hero headline chars
//  cascading up, the subtitle/buttons sliding
//  in, etc. — no per-component prop threading
//  needed.
//
//  To run:
//    npm create vite@latest nova-site -- --template react
//    cd nova-site
//    cp -r ../nova-components-v2/src/. ./src/
//    npm install
//    npm run dev
//
//  Also add to index.html <head>:
//    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Bodoni+Moda:ital,opsz,wght@1,6..96,500;1,6..96,600&display=swap" rel="stylesheet">
//    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
// ─────────────────────────────────────────
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import Preloader from './components/Preloader';
import Grain from './components/Grain';
import Cursor from './components/Cursor';
import SceneDirector from './components/SceneDirector';
import RouteWipe from './components/RouteWipe';
import WhatsAppButton from './components/WhatsAppButton';
import ProgressBar from './components/ProgressBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Clients from './components/Clients';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ProjectDetail from './components/ProjectDetail';
import { IEIBlock, SMSBlock, FFWBlock, YBEBlock } from './components/story';
import useSeo from './hooks/useSeo';
import { SEO_CONTENT as seo } from './data/caseStudies';

function HomePage() {
  const location = useLocation();
  useSeo({ ...seo.home, image: seo.home.ogImage, path: '/' });

  // Coming back from a case-study page via a nav link like "/#about" —
  // scroll to that section once the home layout has mounted.
  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    el?.scrollIntoView({ behavior: 'smooth' });
  }, [location.hash]);

  return (
    <>
      <SceneDirector />
      <Hero />

      <div id="story-wrapper">
        <IEIBlock />
        <SMSBlock />
        <FFWBlock />
        <YBEBlock />
      </div>

      <Services />
      <About />
      <Portfolio />
      <Clients />
      <Contact />
    </>
  );
}

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderDone = () => {
    document.body.classList.add('loaded');
    // Preloader keeps rendering briefly so its own
    // curtain-lift transition can play out fully.
    setTimeout(() => setShowPreloader(false), 1000);
  };

  return (
    <BrowserRouter>
      <GlobalStyles />

      {showPreloader && <Preloader onDone={handlePreloaderDone} />}

      <a href="#main-content" className="skip-link">Skip to content</a>

      <Grain />
      <Cursor />
      <RouteWipe />
      <WhatsAppButton />
      <ProgressBar />
      <Navbar />

      <main id="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
