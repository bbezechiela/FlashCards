import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { firebaseApp } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { StatusProps } from "./Interfaces";
import '../styles/categories.css';

interface Cards {
  category_id: number,
  user_id: number,
  category_name: string,
  number_of_cards: number,
  category_status: string,
  category_timestamp: string,

  qa_id: number,
  question: string,
  answer: string,
}

const Categories: React.FC<StatusProps> = ({ setStatus }) => {
  const [getCategories, setCategories] = useState<Cards[]>([]); 
  const useNav = useNavigate();

  console.log(window.innerWidth);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, (user) => {
      if (user !== null) {
        setStatus(true);
        getter(user.uid);
      } else {
        useNav('/', { replace: true });
      }
    });
  }, []);
  
  const getter = async (uid: string): Promise<void> => {
    const getter = await fetch(`https://flashcardsapi.onrender.com/getAllSetCards?uid=${uid}`, {
      method: 'GET',
    });

    const response = await getter.json();
    setCategories(response.message);
  };

  const showCards = async (cardId: number, categoryName: string): Promise<void> => {
    useNav(`/categories/${categoryName}/${cardId}`, { replace: true });
  }

  const deleteCard = async (e: any, categoryId: number, index: number): Promise<void> => {
    e.stopPropagation();

    await fetch(`https://flashcardsapi.onrender.com/deleteCard?categoryId=${categoryId}`, {
      method: 'POST',
    });

    let tempArr = [...getCategories];
    tempArr.splice(index, 1);
    setCategories(tempArr);
  }

  return (
    <div id='categoryOuterContainer'>
      <div id="categoryInnerContainer">
      {getCategories.length !== 0 ? getCategories.map((e, index) => (
          <div className='categoryItem' key={index} onClick={() => showCards(e.category_id, e.category_name)}>
            <div className="categoryName">{e.category_name}</div>
            <FontAwesomeIcon onClick={(element) => deleteCard(element, e.category_id, index)} className="categoryDelete" icon={faTrashCan} style={{color: "#ffffff",}} />
          </div>
        )): <div id='gawakaCards'>Gawa ka muna cards :)</div>}
      </div>
    </div>
  );
}

export default Categories;