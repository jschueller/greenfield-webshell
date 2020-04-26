import dialogs from './dialogs'
import { firebaseReducer as firebase } from 'react-redux-firebase'
import locale from './locale'
import persistentValues from './persistentValues/reducer'
import simpleValues from './simpleValues/reducer'
import themeSource from './themeSource'
import drawer from './drawer'
import { combineReducers } from 'redux'
import addToHomeScreen from './addToHomeScreen'
import compositor from './compositor'
import notification from './notification'
import serviceWorker from './serviceworker'
import { connectRouter } from 'connected-react-router'

const createRootReducer = (history) =>
  combineReducers({
    firebase,
    dialogs,
    locale,
    persistentValues,
    simpleValues,
    drawer,
    themeSource,
    addToHomeScreen,
    compositor,
    notification,
    serviceWorker,
    router: connectRouter(history),
  })

export default createRootReducer
