import { useEffect, useState, Fragment } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
  );

  const nextCard = () => {
    // La condition vérifie si byDateDesc est défini avant d'exécuter nextCard
    if (byDateDesc) {
      setTimeout(
        // length - 1 après l'affichage de la dernière image, l'index sera ramené à 0
        () => setIndex(index < byDateDesc.length - 1 ? index + 1 : 0),
        5000
      );
    }
  };

  useEffect(() => {
    nextCard();
  });
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        // ajout d'une key unique au composant Fragment
        <Fragment key={event.title}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3 data-testid="slide-card-title">{event.title}</h3>
                <p data-testid="slide-card-description">{event.description}</p>
                <div data-testid="slide-card-month">
                  {getMonth(new Date(event.date))}
                </div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                  // ajout d'une key unique
                  key={_.date}
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx}
                  readOnly
                />
              ))}
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default Slider;
