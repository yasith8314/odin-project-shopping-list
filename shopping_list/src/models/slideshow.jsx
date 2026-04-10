import { useState } from "react";
import "./styles.css";

export default function Slideshow({ screenshots }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  };

  return (
    <div className="slideshow-container">
      <button className="nav prev" onClick={prevSlide}>❮</button>

      <div className="slide-wrapper">
        {screenshots.map((screenshot, index) => (
          <img
            key={screenshot}
            src={screenshot}
            alt="game"
            className={`slide ${
              index === currentIndex ? "active" : ""
            }`}
          />
        ))}
      </div>

      <button className="nav next" onClick={nextSlide}>❯</button>
    </div>
  );
}