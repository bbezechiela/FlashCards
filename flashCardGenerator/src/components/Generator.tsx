import React, { useEffect, useState } from 'react';
import { firebaseApp } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { UserDetails, StatusProps } from './Interfaces';
import '../styles/generator.css';

const Generator: React.FC<StatusProps> = ({ setStatus }) => {
  const [getTitle, setTitle] = useState<string>(''); 
  const [counter, setCounter] = useState<number>(1);
  const [getNumberOfCards, setNumberOfCards] = useState([{ cardNumber: 1, cardQuestion: '', cardAnswer: ''}]);
  const [addLine, setAddLine] = useState<boolean>(false);
  // temporary
  const [getCurrentUser, setCurrentUser] = useState<UserDetails>();
  const useNav = useNavigate();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setStatus(true);
        setCurrentUser(user);
      } else {  
        useNav('/', { replace: true });
      }
    });

    (async () => {
      const getter = await fetch('https://flashcardsapi.onrender.com/demoPostMan');

      const response = await getter.json();
      console.log(response);
    })();
  }, []);

  console.log(window.innerWidth);

  const submitForm: React.FormEventHandler<HTMLFormElement> = async (e): Promise<void> => {
    e.preventDefault();

    let status: boolean = false;
    if (getTitle !== '') {
      for (let i in getNumberOfCards) {
        if (getNumberOfCards[i].cardQuestion !== '' && getNumberOfCards[i].cardAnswer !== '') {
          status = true;
        } else {
          status = false;
          console.log('card number has empty qa ', i);
          break;
        }
      }
    } else {
      console.log('title is empty');
    }

    if (status) {
      const sender = await fetch('https://flashcardsapi.onrender.com/createCards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({uid: getCurrentUser?.uid, title: getTitle, allCards: getNumberOfCards, numberOfCards: getNumberOfCards.length}),
      });
  
      const response = await sender.json();
      if (response.message) { 
        setNumberOfCards([{ cardNumber: 1, cardQuestion: '', cardAnswer: ''}])
        setTitle('');
        console.log(response.message);
      };
    }
  }

  const handleQA = (e: React.ChangeEvent<HTMLTextAreaElement>, cardNumber: number): void => {
    let name = e.target.name;
    let value = e.target.value;

    // hahahahahahahahahahahahahaha dapat setter function it gin aaccess dri it getter :)))))
    // name === 'cardQuestion' ? getNumberOfCards[cardNumber].cardQuestion = value : getNumberOfCards[cardNumber].cardAnswer = value;

    // look into this
    setNumberOfCards(
      getNumberOfCards.map((element, index) => (
        index === cardNumber ? { ...element, [name]: value } : element
      ))
    );
  }

  const addCard = (): void => {
    setAddLine(true);
    if (getNumberOfCards.length !== 0) {
      setCounter(counter + 1);
      setNumberOfCards([...getNumberOfCards, { cardNumber:  counter + 1, cardQuestion: '', cardAnswer: ''}]);
    } else {
      setNumberOfCards([...getNumberOfCards, { cardNumber:  counter, cardQuestion: '', cardAnswer: ''}]);
    }
  }

  const deleteCard = (index: number): void => {
    let cards = [...getNumberOfCards];
    cards.splice(index, 1);
    cards.filter((e, index) => {
      if (e.cardNumber > index) {
        cards[index].cardNumber = index + 1;
        setCounter(index + 1);
      }
    })
    setNumberOfCards(cards);
  }

  return (
    <div id="generatorOuterContainer">
        <div id="generatorInnerContainer">
          <form id='flashCardForm' onSubmit={submitForm}>
            <div id="sectionOne">
              <input 
                id='titleInputField'
                type="text" 
                value={getTitle}
                placeholder='Whats the title of the flash cards...'
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <button 
                id='nextButton'
                type='submit'
              >Do the magic :)</button>
            </div>
            <div id="sectionTwo">
              {getNumberOfCards.map((card, index) => (
                <div id='cardContainer' key={index}>
                  <div id="cardNumber">{card.cardNumber}</div>  
                  <div id='card'>
                    {addLine == true && <div id="horizontalLine"></div> }
                    <textarea id="cardQuestion" name="cardQuestion" placeholder='Write the flash card "Question" here...' rows={6} cols={57}
                    onChange={(e) => handleQA(e, index)}
                    value={card.cardQuestion}
                    required
                    />
                    <textarea id="cardAnswer" name="cardAnswer" placeholder='Write the flash card "Answer" here...' rows={6} cols={57}
                    value={card.cardAnswer}
                    onChange={(e) => handleQA(e, index)}
                    required
                    />      
                  </div>
                  <div id="deleteCard" onClick={() => deleteCard(index)}>X</div>
                </div>
              ))}
            </div>
          </form>
          <button 
            id='addCard'                
            type='button'
            onClick={addCard}
          >+</button>
        </div>
    </div>
  );
}

export default Generator;