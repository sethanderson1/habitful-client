import React, { useEffect, useContext } from 'react';
import { Route } from 'react-router-dom'
import dayjs from 'dayjs';
import HabitCardList from '../HabitCardList/HabitCardList'
import LandingPage from '../LandingPage/LandingPage';
import HabitProgressPage from '../HabitProgressPage/HabitProgressPage';
import MainNav from '../MainNav/MainNav';
import AddHabit from '../AddHabit/AddHabit';
import EditHabit from '../EditHabit/EditHabit';
import Login from '../Login/Login';
import SignUp from '../SignUp/SignUp';
import { HabitContext } from '../../context/HabitContext';
import './App.css'
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import axios from 'axios';
import config from '../../config';
import { ToastContainer } from 'react-toastify';

const isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
const utc = require('dayjs/plugin/utc')
dayjs.extend(utc);

const App = () => {


  const context = useContext(HabitContext);
  const { isLoggedIn, setIsLoggedIn } = context;
  useEffect(() => {

    // do warm up ping to wake up heroku 
    // upon first arriving to page
    const warmUpPing = async () => {
      // console.log('warmUpPing ran')
      const url = `${config.API_ENDPOINT}/ping`
      const res = await axios.get(url)
      // console.log('res', res)
    }

    warmUpPing();

  }, [])

  useEffect(() => {

    const authToken = localStorage.getItem('authToken');
    const loggedInStatus = authToken ? true : false;
    setIsLoggedIn(loggedInStatus);

  }, [isLoggedIn])

  // function loginRoute() {
  //   console.log('isLoggedIn', isLoggedIn)
  //   if (!isLoggedIn) {
  //     return (
  //       <Redirect to={'/'} />
  //     )
  //   } else {
  //     return (
  //       <Route
  //         exact
  //         path={'/login'}
  //         component={Login}
  //       />
  //     )
  //   }
  // }

  // function loginPath() {
  //   if (!isLoggedIn) {
  //     return '/'
  //   } else {
  //     return '/login'
  //   }
  // }

  function loginComponent() {
    if (isLoggedIn) {
      return LandingPage
    } else {
      return Login
    }
  }



  return (
    <main className='App'>
<ToastContainer limit={1} />
      <Route
        path={'/'}
        component={MainNav}
      />
      <section className="main-content">
        <Route
          exact
          path={'/'}
          component={LandingPage}
        />
        <PrivateRoute>
          <Route
            exact
            path={'/habits'}
            component={HabitCardList}
          />
        </PrivateRoute>
        <Route
          exact
          path={'/habits/:habit_id/habit-data'}
          component={HabitProgressPage}
        />
        <PrivateRoute>
          <Route
            exact
            path={'/add-habit'}
            component={AddHabit}
          />
        </PrivateRoute>
        <PrivateRoute>
          <Route
            exact
            path={'/:habit_id/edit-habit'}
            component={EditHabit}
          />
        </PrivateRoute>
        <Route
          exact
          path={'/login'}
          component={loginComponent()}
        />
        <Route
          exact
          path={'/signup'}
          component={SignUp}
        />
      </section>

    </main>
  )
}

export default App;