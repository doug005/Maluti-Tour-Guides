import React, { useState } from 'react';

function AttractionArtwork({ attraction, compact = false }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className={`artwork artwork--${attraction.id}${compact ? ' artwork--compact' : ''}`} aria-label={`${attraction.name} image area`}>
      {!imageFailed && (
        <img
          className={`artwork__photo${imageLoaded ? ' is-loaded' : ''}`}
          src={attraction.imagePath}
          alt={attraction.imageAlt || attraction.name}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageFailed(true)}
        />
      )}
      <div className="artwork__fallback" aria-hidden="true">
        <span className="artwork__fallback-label">Maloti Tour Guides <i>·</i> {attraction.category}</span>
      </div>
      {!compact && <span className="artwork__number">{attraction.number}</span>}
    </div>
  );
}

export function AttractionCard({ attraction, onSelect }) {
  return (
    <article className="attraction-card">
      <button className="attraction-card__button" type="button" onClick={() => onSelect(attraction)} aria-label={`View details for ${attraction.name}`}>
        <AttractionArtwork attraction={attraction} />
        <div className="attraction-card__body">
          <div className="attraction-card__meta">
            <span>{attraction.category}</span>
            <span className="attraction-card__arrow" aria-hidden="true">↗</span>
          </div>
          <h3>{attraction.name}</h3>
          <p className="attraction-card__location">{attraction.location}</p>
          <p className="attraction-card__description">{attraction.description}</p>
          {attraction.imageCaption && <p className="attraction-card__image-note">{attraction.imageCaption}</p>}
        </div>
      </button>
    </article>
  );
}

export { AttractionArtwork };
