import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  notifyUserSurfaceInactive,
  refreshScene,
  requestUserSurfaceActive,
  userSurfaceKeyboardFocus
} from '../../store/compositor'

const configureSceneElement = sceneElement => {
  sceneElement.style.display = 'inline'
  sceneElement.style.width = '100%'
  // sceneElement.style.height = '100%'
  sceneElement.style.overflow = 'hidden'
  sceneElement.style.flex = 1
  sceneElement.style.order = 100
  sceneElement.style.outline = 'none'

  return sceneElement
}

const LocalScene = React.memo(({ contentRef, sceneId }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (sceneId === null) {
      return
    }

    const contentElement = /** @type  {HTMLElement} */contentRef.current
    const sceneElement = document.getElementById(sceneId)
    const resizeListener = () => dispatch(refreshScene(sceneId))

    if (sceneElement.parentElement !== contentElement) {
      configureSceneElement(sceneElement)
      contentElement.appendChild(sceneElement)
      dispatch(refreshScene(sceneId))
      window.addEventListener('resize', resizeListener)
    }
    sceneElement.focus()

    return () => {
      window.removeEventListener('resize', resizeListener)
      sceneElement.style.display = 'none'
      document.body.appendChild(sceneElement)
    }
  }, [contentRef, dispatch, sceneId])

  const activeUserSurfaceKeyRef = useRef(null)

  // TODO move "keyboard focus follows active surface" to middleware
  const currentActiveUserSurface = useSelector(({ compositor }) => Object.values(compositor.userSurfaces).reduce((previousValue, currentValue) => {
    if (currentValue.active && ((previousValue && currentValue.lastActive > previousValue.lastActive) || previousValue === null)) {
      return currentValue
    } else {
      return previousValue
    }
  }, null) || null)
  if (activeUserSurfaceKeyRef.current && currentActiveUserSurface && activeUserSurfaceKeyRef.current !== currentActiveUserSurface.key) {
    dispatch(notifyUserSurfaceInactive(activeUserSurfaceKeyRef.current))
    dispatch(userSurfaceKeyboardFocus(currentActiveUserSurface.key))
  } else if (activeUserSurfaceKeyRef.current && currentActiveUserSurface === null) {
    dispatch(notifyUserSurfaceInactive(activeUserSurfaceKeyRef.current))
  } else if (activeUserSurfaceKeyRef.current === null && currentActiveUserSurface) {
    dispatch(userSurfaceKeyboardFocus(currentActiveUserSurface.key))
  }
  activeUserSurfaceKeyRef.current = currentActiveUserSurface ? currentActiveUserSurface.key : null

  // TODO move "surface with pointer grab becomes active" to middleware
  const pointerGrabIsActive = useSelector(({ compositor }) => compositor.seat.pointerGrab ? compositor.userSurfaces[compositor.seat.pointerGrab].active : false)
  const pointerGrab = useSelector(({ compositor }) => compositor.seat.pointerGrab)
  if (!pointerGrabIsActive && pointerGrab) {
    dispatch(requestUserSurfaceActive(pointerGrab))
  }

  return null
})

export default LocalScene
