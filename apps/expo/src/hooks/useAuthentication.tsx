import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { User, getIdToken } from "@firebase/auth";
import { setAuthIdToken } from "../utils/trpc";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig, "strength-journey-frontend");
const auth = getAuth(app);

interface AuthenticationContextInterface {
  signin: (email: string, password: string) => void;
  signout: () => void;
  user: User | null;
}

const AuthenticationContext = createContext<AuthenticationContextInterface>({
  signin: () => {},
  signout: () => {},
  user: null,
});

const AuthenticationProvider = (props: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const signin = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password);
  };

  const signout = () => {
    auth.signOut();
  };

  useEffect(() => {
    auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const idToken = await getIdToken(authUser);
        setAuthIdToken(idToken);
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <AuthenticationContext.Provider value={{ signin, signout, user }}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};

const useAuthentication = () => {
  const context = useContext(AuthenticationContext);

  return context;
};

export { AuthenticationProvider };
export default useAuthentication;
