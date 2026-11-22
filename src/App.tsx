import { useState } from 'react';
import HouseSection from './components/HouseSection';
import QuoteForm from './components/QuoteForm';
import { serviceTowns } from './data/services';

function Header() {
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="Nashoba Power Wash, home">
        <img src="/logo.webp" alt="Nashoba Power Wash" width={150} height={70} />
      </a>
      <nav aria-label="Main">
        <a href="#house">Services</a>
        <a href="#about">About</a>
        <a href="#area">Service area</a>
        <a href="#faq">FAQ</a>
        <a className="btn btn-primary btn-sm" href="#quote">
          Free quote
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  const [videoOk, setVideoOk] = useState(true);
  return (
    <section className="hero" id="top">
      <div className="hero-media" aria-hidden="true">
        {videoOk && (
          // Hero video made with Higgsfield. Drop the file at public/video/hero.mp4 (prompt: docs/higgsfield-hero-video.md).
          <video
            className="hero-video"
            src="/video/hero.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoOk(false)}
          />
        )}
        <div className="hero-shade" />
      </div>
      <div className="hero-inner">
        <p className="eyebrow eyebrow-light">Westford, MA · Owner-operated</p>
        <h1>
          Clean it right.
          <br />
          <em>See the difference.</em>
        </h1>
        <p className="hero-lede">
          House washes, paver patio restoration, decks and fences, done by hand by a local owner who plans every job
          before the water goes on.
        </p>
        <div className="hero-cta">
          <a className="btn btn-primary btn-lg" href="#quote">
            Book a free quote
          </a>
          <a className="btn btn-outline-light btn-lg" href="#house">
            See how I clean it
          </a>
        </div>
        <ul className="hero-facts">
          <li>Free in-person estimates</li>
          <li>Patio joint restoration</li>
          <li>Serving towns within about 20 miles of Westford</li>
        </ul>
      </div>
    </section>
  );
}

function Highlight() {
  return (
    <section className="highlight" aria-labelledby="highlight-title">
      <div className="wrap highlight-inner">
        <div>
          <p className="eyebrow">Favorite job</p>
          <h2 id="highlight-title">Patio restoration is where it really shows.</h2>
          <p>
            I clean the mold out of every joint, let the patio dry, then sweep in fresh polymeric sand. Most power washing
            companies don’t offer this, and it’s the job I enjoy most because the patio comes out looking brand new.
          </p>
          <a className="text-link" href="#process-patio">
            See the patio process →
          </a>
        </div>
        {/* TODO(owner): pick the most dramatic before/after and put it here as the site's showcase. */}
        <div className="highlight-photo" role="img" aria-label="Showcase before and after photo coming soon">
          <span className="ba-tag ba-tag-before">Before</span>
          <span className="ba-tag ba-tag-after">After</span>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="wrap about-inner">
        {/* TODO(owner): add a photo of Doug (and later the gear) at public/images/doug.webp. */}
        <div className="about-photo" role="img" aria-label="Photo of Doug coming soon">
          <span>Doug</span>
        </div>
        <div>
          <p className="eyebrow">About</p>
          <h2 id="about-title">I’m Doug. I do every job myself.</h2>
          <p>
            I started Nashoba Power Wash in the summer of 2025, out of Westford. I do every job myself: I’m the one
            who quotes it, plans it and cleans it.
          </p>
          <p>
            A lot of people don’t realize how much of a difference a good wash makes until they see it. Mold and grime
            don’t just look bad either. Left alone, they break surfaces down and cost more to fix later.
          </p>
          <p>
            I work with a small number of homeowners each summer, so your job matters a lot to me. I take the time to get
            to know you, map out a plan before I start, and explain clearly what I’m doing and why.
          </p>
        </div>
      </div>
    </section>
  );
}

function Area() {
  return (
    <section id="area" className="area" aria-labelledby="area-title">
      <div className="wrap">
        <p className="eyebrow">Service area</p>
        <h2 id="area-title">Westford and towns within about 20 miles</h2>
        <ul className="towns">
          {serviceTowns.map((t) => (
            <li key={t}>{t}</li>
          ))}
          <li className="towns-more">and nearby towns</li>
        </ul>
        <p className="muted">Not sure if you’re in range? Ask in your quote request. Travel is included in the estimate.</p>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: 'How much does it cost?',
    a: 'Every job is different, so I give free estimates in person to get you an accurate price. If you send photos, I can give you a price range first.',
  },
  {
    q: 'When are you available?',
    a: 'My busy season runs from mid-May to the end of August. I start booking estimates in the spring, so reaching out early gets you the best pick of dates.',
  },
  {
    q: 'What do I need to have ready?',
    a: 'An outdoor water source (a working spigot) and a clear list of what you want cleaned. Move anything fabric, like cushions or rugs, away from the area if you can.',
  },
  {
    q: 'What if it rains?',
    a: 'A light sprinkle is fine, but I don’t wash in the rain. If the forecast turns, we reschedule.',
  },
  {
    q: 'Will pressure washing damage my surfaces?',
    a: 'Not the way I do it. On siding, a mold-killing solution does the heavy work, so I don’t have to blast it. Wood gets extra care, and I check every surface first. If something like oxidized siding or a chewed-up deck could get worse, I’ll tell you honestly instead of risking it.',
  },
  {
    q: 'I have a pool. Is that a problem?',
    a: 'Not at all. I’ll just let you know ahead of time that some dirt may get into the water.',
  },
  {
    q: 'How can I pay?',
    a: 'Cash, check or Venmo.',
  },
];

function Faq() {
  return (
    <section id="faq" className="faq" aria-labelledby="faq-title">
      <div className="wrap faq-inner">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">Good questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section id="quote" className="quote" aria-labelledby="quote-title">
      <div className="wrap quote-inner">
        <div className="quote-copy">
          <p className="eyebrow eyebrow-light">Free estimate</p>
          <h2 id="quote-title">Get your free quote</h2>
          <p>
            Tell me what you want cleaned and I’ll set up a time to come take a look. Estimates are free and done in
            person, so the price is accurate.
          </p>
        </div>
        <QuoteForm />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <img src="/logo.webp" alt="Nashoba Power Wash" width={140} height={66} loading="lazy" />
        <p>Power washing in Westford, MA and nearby towns.</p>
        {/* TODO(owner): add phone, email and your Facebook page link when you're ready to publish them. */}
        <p className="muted">© {new Date().getFullYear()} Nashoba Power Wash</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip" href="#house">
        Skip to services
      </a>
      <Header />
      <main>
        <Hero />
        <HouseSection />
        <Highlight />
        <About />
        <Area />
        <Faq />
        <Quote />
      </main>
      <Footer />
    </>
  );
}
