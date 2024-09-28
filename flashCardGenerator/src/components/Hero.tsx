import React from "react";
import { signInWithPopup, GoogleAuthProvider, getAuth, setPersistence, browserSessionPersistence  } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { firebaseApp } from "../firebase";
import { useNavigate } from "react-router-dom";
import { UserDetails } from "./Interfaces";
import { StatusProps } from "./Interfaces";
import '../styles/hero.css';

const Hero: React.FC<StatusProps> = ({ setStatus }) => {
  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();
  const useNav = useNavigate();  

  const authenticate = () => {
    setPersistence(auth, browserSessionPersistence)
      .then(async () => {
        return await signInWithPopup(auth, provider).then((result) => {
          const user = result.user;
          if (user !== null) {
            setStatus(true);
            createUserLocal({
              uid: user.uid,
              displayName: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
            });
            useNav('/generate', { replace: true });
          } else {
            useNav('/', { replace: true });
          }
        });
      })
      .catch(err => console.log(err));
  }

  const createUserLocal = async ({uid, displayName, email, photoURL}: UserDetails): Promise<void> => {
    const setter = await fetch('http://localhost:2020/createUserLocal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: uid,
        displayName: displayName,
        email: email,
        photoURL: photoURL,
      })
    }); 

    const response = await setter.json();
    console.log(response.message);
  }

  console.log(window.innerWidth);

  return (
    <div id='heroOuterContainer'>
      <div id="heroInnerContainer">
        <div id='heroHeader'>Gawa kana flash cards :)</div>
        <div id='googleSignIn' onClick={authenticate}>
          <FontAwesomeIcon icon={faGoogle} />
          <span>Sign in ka with Google</span>
        </div>
      </div>
    </div>
  );
}

export default Hero;
