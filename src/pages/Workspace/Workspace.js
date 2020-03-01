import React, { useRef } from 'react'
import AppsIcon from '@material-ui/icons/Apps'
import Activity from '../../containers/Activity'
import UserAppsMenu from '../../containers/UserAppsMenu'
import { useSelector } from 'react-redux'
import UserSurfaceTab from '../../components/Workspace/UserSurfaceTab'
import Tabs from '@material-ui/core/Tabs'
import { makeStyles } from '@material-ui/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Typography from '@material-ui/core/Typography'
import LocalWorkspace from '../../containers/Workspace/LocalScene'

const useStyles = makeStyles(theme => ({
  grow: {
    flex: '1 1 auto'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    boxSizing: 'border-box',
    color: '#fff',
    margin: '0 auto',
    padding: 5,
    textAlign: 'center',
    top: '90%',
    bottom: '5%'
  }
}))

const Workspace = React.memo(() => {
  const classes = useStyles()
  const mainRef = useRef(null)

  const compositorInitialized = useSelector(({ compositor }) => compositor.initialized)
  const userSurfaces = useSelector(({ compositor }) => Object.values(compositor.userSurfaces))
  const activeUserSurface = useSelector(({ compositor }) => Object.values(compositor.userSurfaces)
    .find(userSurface => userSurface.active))

  const activeSceneId = useSelector(({ compositor }) => compositor.activeSceneId)
  // TODO map scenes from store.

  // TODO i18n
  return (
    <Activity
      isLoading={!compositorInitialized}
      pageTitle='Greenfield - Workspace'
      appBarContent={
        <>
          <Tabs
            className={classes.grow}
            variant='fullWidth'
            value={activeUserSurface ? activeUserSurface.key : false}
          >
            {
              userSurfaces.map(({ key, title }) => (
                <UserSurfaceTab
                  key={key}
                  value={key}
                  userSurfaceTitle={title}
                />
              ))
            }
          </Tabs>
          <UserAppsMenu anchorElRef={mainRef} />
        </>
      }
      mainRef={mainRef}
    >
      {
        userSurfaces.length === 0 &&
        <>
            <Backdrop open className={classes.backdrop} timeout={5000}>
              <Typography variant='subtitle1'>
                No applications are running. To launch an application, press the  <AppsIcon /> icon in the top right corner.
              </Typography>
            </Backdrop>
          </>
      }
      {
        activeSceneId && <LocalWorkspace mainRef={mainRef} sceneId={activeSceneId} />
      }
    </Activity>
  )
})

export default Workspace
