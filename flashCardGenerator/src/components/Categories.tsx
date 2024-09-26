import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
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

const Categories = () => {
  const [getCategories, setCategories] = useState<Cards[]>([]); 
  const useNav = useNavigate();
  
  useEffect(() => {
    (async (): Promise<void> => {
      const getter = await fetch(`http://localhost:2020/getAllSetCards`, {
        method: 'GET',
      });

      const response = await getter.json();
      setCategories(response.message);
    })();
  }, []);

  const showCards = async (cardId: number, categoryName: string): Promise<void> => {
    useNav(`/categories/${categoryName}/${cardId}`, { replace: true });
  }

  const deleteCard = async (e: any, categoryId: number, index: number): Promise<void> => {
    console.log('clicked delete', categoryId);
    e.stopPropagation();

    const deleter = await fetch(`http://localhost:2020/deleteCard?categoryId=${categoryId}`, {
      method: 'POST',
    });

    const response = await deleter.json();
    console.log(response);

    let tempArr = [...getCategories];
    tempArr.splice(index, 1);
    console.log(tempArr);
    setCategories(tempArr);
  }

  return (
    <div id='categoryOuterContainer'>
      <div id="categoryInnerContainer">
      {getCategories.map((e, index) => (
          <div className='categoryItem' key={index} onClick={() => showCards(e.category_id, e.category_name)}>
            <div className="categoryName">{e.category_name}</div>
            <FontAwesomeIcon onClick={(element) => deleteCard(element, e.category_id, index)} className="categoryDelete" icon={faTrashCan} style={{color: "#ffffff",}} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;