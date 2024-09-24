import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styles/cards.css';

interface Cardss {
  qa_id: number,
  category_id: number,
  user_id: number,
  question: string,
  answer: string,
  qa_timestamp: string,
}

const Cards = () => {
  const [cardStatus, setCardStatus] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [getCards, setCards] = useState<Cardss[]>([]);
  const params = useParams();

  useEffect(() => {
    (async () => {
      const getter = await fetch(`http://localhost:2020/getCards?cardId=${params.category_id}`, {
        method: 'GET',
      });
      
      const response = await getter.json();
      console.log(response.message);
      setCards(response.message);
    })();
  }, []);

  const nextCard = (): void => {
    if (getCards.length - 1 !== counter) {
      setCounter(counter + 1);
      setCardStatus(false);
    } else {
      console.log('reached');
    }
  }

  return (
    <div id='cardsOuterContainer'>
      <div id="cardsInnerContainer">
        <div id='cardCounter'>{counter + 1} of {getCards.length}</div>
        
        <div className="card">
          {getCards.length !== 0 && getCards[counter].question}
        </div>
        
        <div id="cardHandlersContainer">
          <div id="answerCardHandler" onClick={() => setCardStatus(!cardStatus)}>show answer</div>
          <div id="nextCard" onClick={nextCard}>next card</div>
        </div>

        {cardStatus === true && <div className="card">{getCards[counter].answer}</div>}
      </div>
    </div>
  );
}

export default Cards;