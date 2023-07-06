/* import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './style.css'
ReactDOM.createRoot(document.getElementById('root')).render(<App />) */
import ReactDOM from 'react-dom/client'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import App from './App'
import blogReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

import './style.css'

const rootReducer = combineReducers({
  blogs: blogReducer,
  user: userReducer,

})
const store = createStore(rootReducer, applyMiddleware(thunk))
store.subscribe(() => console.log(store.getState()))

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
