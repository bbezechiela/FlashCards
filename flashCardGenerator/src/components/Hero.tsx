import { signInWithPopup, GoogleAuthProvider, getAuth, setPersistence, browserSessionPersistence  } from "firebase/auth";
import { firebaseApp } from "../firebase.js";

const Hero = () => {

  const auth = getAuth(firebaseApp);



  return (
    <>


    </>
  );
}

export default Hero;
