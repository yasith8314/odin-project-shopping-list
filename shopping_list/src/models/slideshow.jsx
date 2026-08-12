import { useState } from "react";
import "./styles.css";

export default function Slideshow({ screenshots }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (!screenshots?.length) return null;
  const nextSlide = () => setCurrentIndex((index) => (index + 1) % screenshots.length);
  const prevSlide = () => setCurrentIndex((index) => (index - 1 + screenshots.length) % screenshots.length);
  return <div className="slideshow-container" aria-label="Game screenshots"><button type="button" className="nav prev" onClick={prevSlide} aria-label="Previous screenshot">‹</button><div className="slide-wrapper">{screenshots.map((screenshot, index) => <img key={screenshot} src={screenshot} alt={`Game screenshot ${index + 1}`} className={`slide ${index === currentIndex ? "active" : ""}`} />)}</div><button type="button" className="nav next" onClick={nextSlide} aria-label="Next screenshot">›</button><div className="slide-count" aria-live="polite">{currentIndex + 1} / {screenshots.length}</div></div>;
}
