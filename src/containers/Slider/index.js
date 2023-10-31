import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [byDateDesc, setByDateDesc] = useState([]);

  function updateDateSorted() {
    if (data?.focus) {
      const sortedDate = data?.focus.sort((evtA, evtB) =>
        new Date(evtA.date) > new Date(evtB.date) ? 1 : -1
      );
      setByDateDesc(sortedDate);
    }
  }
  const nextCard = () => {
    setTimeout(() => setIndex(index < byDateDesc.length ? index + 1 : 0), 5000);
  };
  useEffect(() => {
    nextCard();
    updateDateSorted();
  });
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((outerEvent, idx) => (
        <div
          id={`${`Slide`}-${outerEvent.title}`}
          key={`${`Slide`}-${outerEvent.id}`}
        >
          <div
            key={outerEvent.title}
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={outerEvent.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{outerEvent.title}</h3>
                <p>{outerEvent.description}</p>
                <div>{getMonth(new Date(outerEvent.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((innerEvent, radioIdx) => (
                <input
                  key={`${innerEvent.id}`}
                  type="radio"
                  name="radio-button"
                  checked={idx === radioIdx}
                  readOnly
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Slider;
