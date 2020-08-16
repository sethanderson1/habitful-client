// Toast/Snack
import { NoSsr, Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import React, { useEffect, useState } from "react";

export default function Snack(props) {
  const { message, severity = "success" } = props
  const [open, setOpen] = React.useState(null);

  useEffect(() => {
    setOpen(!!message)
    console.log('eff')
    console.log(open, message, severity)
  }, [props])

  // const handleClick = () => {
  //   setOpen(true);
  // };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  return (<Snackbar
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    open={open && !!message} autoHideDuration={6000} onClose={handleClose}>
    <Alert
      elevation={6} variant="filled"
      onClose={handleClose} severity={severity}>
      {message}
    </Alert>
  </Snackbar>)
}

export const ToastContext = React.createContext({})
export const ToastProvider = ({ children }) => {
  const [props, setSnackProps] = useState({ message: null, severity: 'success' })
  const value = {
    snackProps: props,
    setSnackProps,
  }

 
  useEffect(() => {
    let timer
    if (props.message) {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        console.log('self-clearing snack')
        setSnackProps({})
      }, 6100)
    }

    return (() => {
      window.clearTimeout(timer)
    })

  }, [!!props.message])

  return <ToastContext.Provider value={value}>
    <NoSsr>
      <Snack {...props} />
    </NoSsr>
    {children}
  </ToastContext.Provider>
}



// essential app



//HabitContextProvider START
const [habits, setHabits] = useState([])

//the shape of HabitContextProvider value
const AppCtxValue = {
  habits, //in-memory store
  fetchHabits: () => {
    const habits = axios.get('/habits')
    setHabits(habits)
  },
  updateHabit: async (id, date, enabled) => {
    const response = await axios.post(`/habits/${id}`, {date, enabled})
    await AppCtxValue.fetchHabits()
    return response
  },
}
//HabitContextProvider END

//the shape of ToastProvider value
const ToastProviderCtxValue = {
  setToast(message, errLevel /* warning|errror|info */)
}

// usePromiseState.js

//or, better yet, use https://www.npmjs.com/package/react-promise-hooks instead
const usePromiseState = (promiseFn, lazy=false) => {
  const [data, setData] = useState(undefined)
  const [error, setError] = useState(undefined)
  const doIt = async (...args) => {
  //reset error
  setError(undefined)
  setData(undefined)
  let response, error  
  try {
      response = await promiseFn(...args)
      setData(response)
    } catch (e) {
      error = e
      setError(error) //maybe normalize the error?   
    }
    return {data:response, error}
  }

  React.useEffect(()=>{
    if(!lazy){
      doIt()
    }
  },[])

  return {
    doIt,
    data,
    error,
  }
}


const HabitsPage = () => {
  const AppCtxValue = useContext('appCtx')
  const ToastProviderCtxValue = useContext('toastCtx')

  const { data, error } = usePromiseState( AppCtxValue.fetchHabits)
  if (error) {
    ToastProviderCtxValue.setToast(error.message, 'ERROR')
    return <div>failed to load</div>
  }
  if (!data) { return <div>loading...</div> }
  return <div>hello {JSON.stringify(data)}</div>

}

const HabitsCard = ({ habit }) => {
  const ToastProviderCtxValue = useContext('toastCtx')
  const {doIt } = usePromiseState(AppCtxValue.updateHabit, true)
  const toggleHabit = async () => {
    const { data, error, } = await doIt(habit.id, habit.date, !habit.enabled)
    if (!data) {
      ToastProviderCtxValue.setToast('Loading...', 'INFO')
    }
    if (error) {
      ToastProviderCtxValue.setToast(error.message, 'ERROR')
    }
  }
  return <div onClick={toggleHabit}>hello {JSON.stringify(data)}</div>

}

//index.js

ReactDOM.render(
  <HabitContextProvider>
    <ToastProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </HabitContextProvider>
  , document.getElementById('root'));