import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firebaseApp } from "../firebase";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { StatusProps } from "./Interfaces";
import '../styles/cards.css';

interface Cardss {
  qa_id: number,
  category_id: number,
  user_id: number,
  question: string,
  answer: string,
  qa_timestamp: string,
}

const Cards: React.FC<StatusProps> = ({ setStatus }) => {
  const [cardStatus, setCardStatus] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [getCards, setCards] = useState<Cardss[]>([]);
  const params = useParams();
  const useNav = useNavigate();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setStatus(true);
        getAllCards();
      } else {
        useNav('/', { replace: true });
      }
    });
    
  }, []);

  console.log(window.innerWidth);

  const getAllCards = async (): Promise<void> => {
    const getter = await fetch(`https://flashcardsapi.onrender.com/getCards?cardId=${params.category_id}`, {
      method: 'GET',
    });
    
    const response = await getter.json();
    console.log(response.message);
    setCards(response.message);
  };
  
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
        <div id="cardCategoryName">{params.category_name}</div>
        
        <div id='cardCounter'>{counter + 1} of {getCards.length}</div>
        
        <div id="cardCard">
          {getCards.length !== 0 && getCards[counter].question}
        </div>
        
        <div id="cardHandlersContainer">
          <div id="answerCardHandler" onClick={() => setCardStatus(!cardStatus)}>show answer</div>
          <div id="nextCard" onClick={nextCard}>next card</div>
        </div>

        {cardStatus === true && <div id="cardCard">{getCards[counter].answer}</div>}
      </div>
    </div>
  );
}

export default Cards;