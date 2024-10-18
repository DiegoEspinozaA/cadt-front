import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, update, onChildAdded, get, onValue, set} from 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyAQ5tzPJ5S58Qc3XTIA5f6EEzJHvlZiz3c",
    authDomain: "cadt-victoria.firebaseapp.com",
    projectId: "cadt-victoria",
    storageBucket: "cadt-victoria.appspot.com",
    messagingSenderId: "334797574295",
    appId: "1:334797574295:web:0ec362bbc55d7d8d7819d2"
  };

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, push, update, onChildAdded, get, onValue, set};