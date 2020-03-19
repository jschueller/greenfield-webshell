import { createAction, createSlice } from '@reduxjs/toolkit'

/**
 * @typedef {{id:number, clientId: string, title:string, appId:string, mapped:boolean, active: boolean, unresponsive: boolean, minimized: boolean, key: string, lastActive: number}}UserSurface
 */
/**
 * @typedef {{userSurfaceKey:string, sceneId: string}}UserSurfaceView
 */
/**
 * @typedef {{views: UserSurfaceView[], sharing: 'public'|'private', shared_with: string[]}}LocalSceneState
 */
/**
 * @typedef {{shared_by: string, access: 'pending'|'granted'|'denied'}}RemoteSceneState
 */
/**
 * @typedef {{name: string, id: string, type: 'local'|'remote', lastActive: number, state: LocalSceneState|RemoteSceneState}}Scene
 */
/**
 * @typedef {{id:number, variant: 'web'|'remote'}}WaylandClient
 */
/**
 * Keyboard keymap information ie keyboard layout
 * @typedef {{name: string, rules: string, model: string, layout: string, variant: string, options: string}}nrmlvo
 */
/**
 * @typedef {{nrmlvoEntries: nrmlvo[], defaultNrmlvo: nrmlvo}}UserKeyboard
 */
/**
 * @typedef {{pointerGrab: ?string, keyboardFocus: ?string, userKeyboard: UserKeyboard}}UserSeat
 */
/**
 * @typedef {{scrollFactor:number, keyboardLayout: ?string}}UserConfiguration
 */
/**
 * @typedef {{
 * clients: Object.<string,WaylandClient>,
 * initialized: boolean,
 * peerId: string,
 * seat: UserSeat,
 * userSurfaces: Object.<string,UserSurface>,
 * userConfiguration: UserConfiguration,
 * scenes: Object.<string, Scene>,
 * }}CompositorState
 */
/**
 * @type {CompositorState}
 */
const initialState = {
  clients: {},
  initialized: false,
  peerId: null,
  seat: {
    pointerGrab: null,
    keyboardFocus: null,
    keyboard: {
      nrmlvoEntries: [],
      defaultNrmlvo: null
    }
  },
  userSurfaces: {},
  userConfiguration: {
    scrollFactor: 1,
    keyboardLayoutName: null
  },
  scenes: {}
}

/**
 * @typedef {{type:string,payload:*}}Action
 */
const reducers = {
  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  initializeCompositor: (state, action) => {
    const { peerId } = action.payload
    state.peerId = peerId
    state.initialized = true
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  createClient: (state, action) => {
    const client = action.payload
    state.clients[client.id] = client
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  destroyClient: (state, action) => {
    const client = action.payload
    delete state.clients[client.id]
  },

  // TODO upsert?
  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  createUserSurface: (state, action) => {
    // TODO put userSurface in property
    const userSurface = action.payload
    state.userSurfaces[userSurface.key] = userSurface
  },

  // TODO upsert?
  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  updateUserSurface: (state, action) => {
    // TODO put userSurface in property
    const userSurface = action.payload
    state.userSurfaces[userSurface.key] = userSurface
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  destroyUserSurface: (state, action) => {
    const userSurfaceKey = action.payload
    delete state.userSurfaces[userSurfaceKey]
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  updateUserSeat: (state, action) => {
    const { keyboardFocus, pointerGrab, keyboard } = action.payload
    state.seat = { pointerGrab, keyboardFocus, keyboard }
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  updateUserConfiguration: (state, action) => {
    state.userConfiguration = { ...state.userConfiguration, ...action.payload }
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  createUserSurfaceView: (state, action) => {
    const { userSurfaceKey, sceneId } = action.payload
    state.scenes[sceneId].state.views.push({ userSurfaceKey, sceneId })
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  destroyUserSurfaceView: (state, action) => {
    const { userSurfaceKey, sceneId } = action.payload
    state.scenes[sceneId].state.views = state.scenes[sceneId].state.views.filter(view =>
      view.userSurfaceKey !== userSurfaceKey && view.sceneId !== sceneId)
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  createScene: (state, action) => {
    const { name, id, type } = action.payload
    const scene = { name, id, type }
    if (type === 'local') {
      scene.state = { views: [], sharing: 'private', shared_with: [] }
    } else if (type === 'remote') {
      scene.state = { shared_by: null, access: 'pending' }
    }
    state.scenes[id] = scene
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  destroyScene: (state, action) => {
    const id = action.payload
    delete state.scenes[id]
  },

  /**
   * @param {CompositorState}state
   * @param {{payload: {grantingUserId: string, remoteSceneId: string}}}action
   */
  grantedSceneAccess: (state, action) => {
    const { grantingUserId, remoteSceneId } = action.payload
    state.scenes[remoteSceneId].state.access = 'granted'
    state.scenes[remoteSceneId].state.shared_by = grantingUserId
  },

  /**
   * @param {CompositorState}state
   * @param {{payload: {remoteSceneId: string}}}action
   */
  deniedSceneAccess: (state, action) => {
    const { remoteSceneId } = action.payload
    state.scenes[remoteSceneId].state.access = 'denied'
    state.scenes[remoteSceneId].state.shared_by = null
  },

  /**
   * @param {CompositorState}state
   * @param {{payload: {localSceneId: string, requestingUserId:string, peerId:string, remoteSceneId:string, access: 'denied'|'granted'}}}action
   */
  requestedSceneAccess: (state, action) => {
    const { sceneId, requestingUserId, access } = action.payload
    const scene = state.scenes[sceneId]
    if (access === 'granted') {
      scene.state.shared_with.push(requestingUserId)
    } else if (access === 'denied') {
      scene.state.shared_with = scene.state.shared_with.filter(uid => uid !== requestingUserId)
    }
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  changeSceneName: (state, action) => {
    const { sceneId, name } = action.payload
    state.scenes[sceneId].name = name
  },

  /**
   * @param {CompositorState}state
   * @param {{payload: {sceneId: string, sharing: string}}}action
   */
  shareScene: (state, action) => {
    const { sceneId, sharing } = action.payload
    state.scenes[sceneId].state.sharing = sharing
  },

  /**
   * @param {CompositorState}state
   * @param {Action}action
   */
  markSceneLastActive: (state, action) => {
    const id = action.payload
    Object.values(state.scenes).find(scene => scene.id === id).lastActive = Date.now()
  }
}

// actions handled by compositor middleware

/**
 * @type {function(payload: string):string}
 */
export const requestUserSurfaceActive = createAction('requestUserSurfaceActive')

/**
 * @type {function(payload: string):string}
 */
export const refreshScene = createAction('refreshScene')

/**
 * @type {function(payload: {sceneId: string}):string}
 */
export const requestingSceneAccess = createAction('requestingSceneAccess')

/**
 * @type {function(payload: string):string}
 */
export const notifyUserSurfaceInactive = createAction('notifyUserSurfaceInactive')

/**
 * @type {function(payload: string):string}
 */
export const userSurfaceKeyboardFocus = createAction('userSurfaceKeyboardFocus')

/**
 * @type {function(payload: string):string}
 */
export const terminateClient = createAction('terminateClient')

/**
 * @type {function(payload: {url: string, type: 'web'|'remote'}):string}
 */
export const launchApp = createAction('launchApp')

// TODO application launching

const slice = createSlice({
  reducers,
  initialState,
  name: 'greenfield/compositor'
})

export const {
  initializeCompositor,

  createClient,
  destroyClient,

  createUserSurface,
  updateUserSurface,
  destroyUserSurface,

  updateUserSeat,

  updateUserConfiguration,
  createUserSurfaceView,
  destroyUserSurfaceView,

  createScene,
  requestedSceneAccess,
  grantedSceneAccess,
  deniedSceneAccess,
  changeSceneName,
  shareScene,
  destroyScene,
  markSceneLastActive
} = slice.actions

export default slice.reducer
