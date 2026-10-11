import React, { useMemo, useState } from 'react';
import attractions, { heroPhoto } from './data/attractions';
import { AttractionArtwork, AttractionCard } from './components/AttractionCard';
import EnquiryForm from './components/EnquiryForm';
import Footer from './components/Footer';
import './App.css';

const categories = ['All places', ...new Set(attractions.map((attraction) => attraction.category))];

function Header({ onNavigate }) {
  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <a className="brand" href="#home" aria-label="Maloti Tour Guides home" onClick={(event) => onNavigate(event, 'home')}>
          <span className="brand__text"><strong>Maloti Tour Guides</strong><small>Local knowledge. Highland discovery.</small></span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#attractions" onClick={(event) => onNavigate(event, 'attractions')}>Discover</a>
          <a href="#experiences" onClick={(event) => onNavigate(event, 'experiences')}>Experiences</a>
          <a href="#about" onClick={(event) => onNavigate(event, 'about')}>About Lesotho</a>
        </nav>
        <a className="header-cta" href="#enquiries" onClick={(event) => onNavigate(event, 'enquiries')}>Plan a visit <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}

function Hero() {
  const [photoLoaded, setPhotoLoaded] = useState(false);

  return (
    <section className={`hero${photoLoaded ? ' hero--photo-loaded' : ''}`} id="home" aria-labelledby="hero-title">
      <img className="hero__photo" src={heroPhoto.imagePath} alt="" onLoad={() => setPhotoLoaded(true)} onError={() => setPhotoLoaded(false)} />
      <div className="hero__landscape" aria-hidden="true"><span /><i /></div>
      <div className="hero__content page-shell">
        <p className="eyebrow hero__eyebrow"><span /> THE KINGDOM IN THE SKY</p>
        <h1 id="hero-title">A little closer<br />to <em>the extraordinary.</em></h1>
        <p className="hero__intro">Find your own way through Lesotho, a highland kingdom of wide-open horizons, living heritage and unforgettable paths.</p>
        <a className="button button--light" href="#attractions">Explore the atlas <span aria-hidden="true">↓</span></a>
      </div>
      <div className="hero__caption"><span>29°36′S &nbsp; 28°14′E</span><span>THE MALOTI MOUNTAINS, LESOTHO</span></div>
      <a className="hero__scroll" href="#intro" aria-label="Scroll to introduction">↓</a>
    </section>
  );
}

function Intro() {
  return (
    <section className="intro section-pad" id="intro">
      <div className="page-shell intro__grid">
        <div className="intro__copy">
          <p className="eyebrow"><span /> MADE FOR THE CURIOUS</p>
          <h2>Small country.<br /><em>Limitless feeling.</em></h2>
          <p>Lesotho rises above the clouds. Trace winding mountain roads, meet the stories held in ancient stone, and take the long way to a view that stays with you.</p>
          <a className="text-link" href="#about">Get to know Lesotho <span aria-hidden="true">↗</span></a>
        </div>
        <figure className="intro__mountain-card">
          <img src="/images/thabana-ntlenyana.jpg" alt="Approaching the summit of Thabana Ntlenyana, Lesotho" />
          <figcaption><span>THABANA NTLENYANA</span><strong>3,482 m <i>·</i> Lesotho</strong></figcaption>
        </figure>
      </div>
    </section>
  );
}

function AttractionsSection({ onSelect }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All places');
  const filteredAttractions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return attractions.filter((attraction) => {
      const matchesName = attraction.name.toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === 'All places' || attraction.category === category;
      return matchesName && matchesCategory;
    });
  }, [query, category]);

  return (
    <section className="attractions-section section-pad" id="attractions">
      <div className="page-shell">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> FIND YOUR SOMEWHERE</p><h2>Places that <em>stay with you.</em></h2></div>
          <p className="section-heading__aside">From the first light over a mountain pass to the quiet of a village afternoon.</p>
        </div>
        <div className="explore-tools">
          <label className="search-field"><span className="visually-hidden">Search attractions by name</span><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places..." /></label>
          <div className="category-list" aria-label="Filter attractions by category">
            {categories.map((item) => <button key={item} type="button" className={`category-chip${category === item ? ' is-active' : ''}`} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}
          </div>
        </div>
        {filteredAttractions.length ? (
          <div className="attraction-grid">{filteredAttractions.map((attraction) => <AttractionCard key={attraction.id} attraction={attraction} onSelect={onSelect} />)}</div>
        ) : (
          <div className="empty-state"><span aria-hidden="true">⌕</span><h3>No places found</h3><p>Try another name or choose a different category.</p></div>
        )}
        <p className="results-note">Showing {filteredAttractions.length} of {attractions.length} places</p>
      </div>
    </section>
  );
}

function Experiences() {
  const experiences = [
    { number: '01', title: 'Take the high road', text: 'Follow mountain passes where every bend opens onto another horizon.', tag: 'OUTDOORS', image: '/images/sani-pass.jpg', imageAlt: 'Mountain road through Sani Pass' },
    { number: '02', title: 'Walk through time', text: 'Discover the stories, art and living traditions woven through the highlands.', tag: 'CULTURE', image: '/images/ha-kome-cave-dwellings.jpg', imageAlt: 'Traditional Ha Kome cave dwellings' },
    { number: '03', title: 'Meet the moment', text: 'Slow down, share a meal and find a warmer way to see the world.', tag: 'LOCAL LIFE', image: '/images/tsehlanyane-buildings.jpg', imageAlt: 'Thatched lodge veranda looking across a Lesotho mountain valley' },
  ];
  return (
    <section className="experiences-section section-pad" id="experiences">
      <div className="page-shell">
        <div className="section-heading section-heading--light"><div><p className="eyebrow"><span /> MORE THAN A VIEW</p><h2>Find your kind <em>of adventure.</em></h2></div><p className="section-heading__aside">The best journeys here are measured in moments, not miles.</p></div>
        <div className="experience-grid">{experiences.map((experience) => <ExperienceCard key={experience.number} experience={experience} />)}</div>
      </div>
    </section>
  );
}

function ExperienceCard({ experience }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="experience-card">
      {!imageFailed && <img className="experience-card__photo" src={experience.image} alt={experience.imageAlt} onError={() => setImageFailed(true)} />}
      <div className="experience-card__top"><span>{experience.number}</span><span aria-hidden="true">↗</span></div>
      <div className="experience-card__body"><p className="experience-card__tag">{experience.tag}</p><h3>{experience.title}</h3><p>{experience.text}</p></div>
    </article>
  );
}

function About() {
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <section className="about-section section-pad" id="about">
      <div className="page-shell about-grid">
        <div className={`about-art${photoLoaded ? ' about-art--photo-loaded' : ''}`}>
          {!photoFailed && <img className={`about-art__photo${photoLoaded ? ' is-loaded' : ''}`} src="/images/maloti-mountain-hero.jpg" alt="Snow-capped Maloti Mountains above a Lesotho highland valley" onLoad={() => setPhotoLoaded(true)} onError={() => setPhotoFailed(true)} />}
          <div className="about-art__sun" aria-hidden="true" /><div className="about-art__ridge about-art__ridge--back" aria-hidden="true" /><div className="about-art__ridge about-art__ridge--front" aria-hidden="true" /><span>LESOTHO · 1966</span>
        </div>
        <div className="about-copy"><p className="eyebrow"><span /> A KINGDOM APART</p><h2>Rooted in the<br /><em>highlands.</em></h2><p>Completely surrounded by South Africa, the Kingdom of Lesotho is a place shaped by elevation, resilience and a deep sense of belonging. Sesotho culture is present in the language, the blanket, the song and the welcome.</p><p>Come prepared for changing weather, winding roads and altitudes that ask you to take your time. Travel thoughtfully, listen locally and leave the mountains as you found them.</p><a className="text-link" href="#enquiries">Start planning <span aria-hidden="true">↗</span></a></div>
      </div>
    </section>
  );
}

function AttractionDetail({ attraction, onBack, onEnquire }) {
  return (
    <main className="detail-page page-shell">
      <button className="back-link" type="button" onClick={onBack}><span aria-hidden="true">←</span> Back to all places</button>
      <div className="detail-grid"><div className="detail-artwork"><AttractionArtwork attraction={attraction} compact />{attraction.imageCaption && <p className="image-caption">{attraction.imageCaption}</p>}</div><div className="detail-copy"><p className="eyebrow"><span /> {attraction.category.toUpperCase()}</p><h1>{attraction.name}</h1><p className="detail-location">⌖ &nbsp;{attraction.location}</p><p className="detail-description">{attraction.description}</p><h2>Make a day of it</h2><ul className="activity-list">{attraction.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul><div className="cost-note"><span>ESTIMATED COST</span><p>{attraction.estimatedCost}</p></div><button className="button button--dark" type="button" onClick={() => onEnquire(attraction.name)}>Enquire about this place <span aria-hidden="true">↗</span></button></div></div>
    </main>
  );
}

function App() {
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [enquiryDestination, setEnquiryDestination] = useState('');

  function navigateSection(event, sectionId) {
    event.preventDefault();
    setSelectedAttraction(null);
    window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  function selectAttraction(attraction) {
    setSelectedAttraction(attraction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function startEnquiry(destination) {
    setEnquiryDestination(destination);
    setSelectedAttraction(null);
    window.setTimeout(() => document.getElementById('enquiries')?.scrollIntoView({ behavior: 'smooth' }), 0);
  }

  return (
    <div className="app-shell">
      <Header onNavigate={navigateSection} />
      {selectedAttraction ? (
        <AttractionDetail attraction={selectedAttraction} onBack={() => setSelectedAttraction(null)} onEnquire={startEnquiry} />
      ) : (
        <main>
          <Hero />
          <Intro />
          <AttractionsSection onSelect={selectAttraction} />
          <Experiences />
          <About />
          <EnquiryForm selectedDestination={enquiryDestination} />
        </main>
      )}
      <Footer onNavigate={navigateSection} />
    </div>
  );
}

export default App;
