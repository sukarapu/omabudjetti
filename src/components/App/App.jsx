import Header from '../Header'
import Menu from '../Menu'
import Content from '../Content'
import { ButtonContainer, FloatingButton } from '../../shared/ui/buttons'
import Items from '../../pages/Items'
import Stats from '../../pages/Stats'
import Settings from '../../pages/Settings'
import AppRouter from '../../router/AppRouter'
import useLocalStorage from '../../shared/hooks/uselocalstorage'
import firebase, { auth } from './firebase.js'
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import Startup from '../../pages/Startup'

function App() {

  // Sovellukseen kirjautuneen käyttäjän tiedot.
  const [user, setUser] = useState()

  // Sovelluksen merkintädata, joka välitetään eteenpäin reitittäjälle.
  const [data, setData] = useState([])

  // Sovelluksen kulutyypit, jotka välitetään eteenpäin reitittäjälle.
  const [typelist, setTypelist] = useState([])

  // Tallentaa uuden tyypin Firestore-tietokannan type-kokoelmaan.
  const handleTypeSubmit = async (type) => {
    await addDoc(collection(firestore,`user/${user.uid}/type`),{type: type})
  }

  // Alustetaan Firestore-tietokantayhteys annetulla Firebase-sovelluksella.
  const firestore = getFirestore(firebase)

  useEffect( () => {
    if (user) {
      const unsubscribe = onSnapshot(query(collection(firestore,`user/${user.uid}/item`),
                                           orderBy('paymentDate', 'desc')),
                                     snapshot => {
        const newData = []
        snapshot.forEach( doc => {
          newData.push({ ...doc.data(), id: doc.id })
        })
        setData(newData)
      })
      return unsubscribe
    } else {
      setData([])
    }
  }, [user])

  useEffect( () => {
    if (user) {
      const unsubscribe = onSnapshot(query(collection(firestore,`user/${user.uid}/type`),
                                           orderBy('type')),
                                     snapshot => {
        const newTypelist = []
        snapshot.forEach( doc => {
          newTypelist.push(doc.data().type)
        })
        setTypelist(newTypelist)
      })
      return unsubscribe
    } else {
      setTypelist([])
    }
  }, [user])

  // useEffect-kuuntelija, joka seuraa Firebase Authenticationin
  // kirjautumistilan muutoksia ja tallentaa kirjautuneen käyttäjän
  // tiedot user-muuttujaan.
  useEffect( () => {
    onAuthStateChanged(auth, user => {
      setUser(user)
    })
  }, [])

  // Poistaa olemassa olevan tuotteen Firestore-tietokannasta
  // item-kokoelmasta annetun dokumentin id-tunnisteen perusteella.
  const handleItemDelete = async (id) => {
    await deleteDoc(doc(firestore, `user/${user.uid}/item`, id))
  }

  // Tallentaa uuden tai päivitetyn tuotteen Firestore-tietokannan
  // item-kokoelmaan. Dokumentin tunnisteena käytetään newitem-olion
  // id-arvoa.
  const handleItemSubmit = async (newitem) => {
    await setDoc(doc(firestore, `user/${user.uid}/item`, newitem.id), newitem)
  }

  return (
    <>
      { user ?
          <AppRouter data={data}
                     typelist={typelist}
                     onItemSubmit={handleItemSubmit}
                     onItemDelete={handleItemDelete}
                     onTypeSubmit={handleTypeSubmit}
                     auth={auth}
                     user={user} />
        : <Startup auth={auth} />
      }
    </>
  )
}

export default App