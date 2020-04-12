import { createStore, applyMiddleware } from 'redux'

import rootReducer from './root-reducer'
import { persistStore } from 'redux-persist'

import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

export const store = createStore(
  rootReducer,
  {},
  composeWithDevTools(applyMiddleware(...[thunk]))
)

export const persistor = persistStore(store)

//

if (process.env.NODE_ENV !== 'production' && module.hot)
  module.hot.accept('./root-reducer', () => store.replaceReducer(rootReducer))
