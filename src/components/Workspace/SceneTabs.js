import * as React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { makeStyles } from '@material-ui/styles'
import { useDispatch, useSelector } from 'react-redux'
import { Add, Delete, Edit } from '@material-ui/icons'
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon'
import SpeedDial from '@material-ui/lab/SpeedDial'
import { Box, ClickAwayListener, Toolbar } from '@material-ui/core'
import EditScene from './EditScene'
import {
  activateScene,
  createScene,
  deleteScene,
} from '../../middleware/compositor/actions'

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 'auto',
    order: 999,
    backgroundColor: theme.palette.background.default,
  },
  sceneTabsContainer: {
    display: 'flex',
  },
  sceneTabs: {
    flex: '1 0 auto',
  },
  tabIndicator: {
    backgroundColor: theme.palette.primary.main,
  },
  speedDial: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}))

const SceneTabs = React.memo(({ id }) => {
  const dispatch = useDispatch()

  const [speedDialOpen, setSpeedDialOpen] = React.useState(false)
  const [editSceneOpen, setEditSceneOpen] = React.useState(false)

  const scenes = useSelector(({ compositor }) => compositor.scenes)

  const handleEditSceneClose = () => setEditSceneOpen(false)
  const handleSpeedDialClose = () => setSpeedDialOpen(false)
  const handleSpeedDialOpen = () => setSpeedDialOpen(true)

  const addScene = () =>
    dispatch(createScene({ scene: { name: 'new scene', type: 'local' } }))
  const removeScene = () => dispatch(deleteScene({ scene: { id } }))
  const editScene = () => setEditSceneOpen(true)
  const makeSceneActive = (id) => dispatch(activateScene({ scene: { id } }))

  const sceneActionOptions = [
    Object.keys(scenes).length > 1
      ? {
          icon: <Delete />,
          name: 'Remove This Scene',
          action: removeScene,
        }
      : null,
    { icon: <Edit />, name: 'Edit This Scene', action: editScene },
    { icon: <Add />, name: 'Add New Scene', action: addScene },
  ]

  const classes = useStyles()
  return (
    <Box
      component="div"
      boxShadow={10}
      zIndex="appBar"
      className={classes.root}
    >
      <EditScene
        open={editSceneOpen}
        handleClose={handleEditSceneClose}
        id={id}
      />
      <Toolbar className={classes.sceneTabsContainer}>
        <Tabs
          className={classes.sceneTabs}
          variant="fullWidth"
          value={id}
          classes={{
            indicator: classes.tabIndicator,
          }}
        >
          {Object.entries(scenes).map(([sceneId, scene]) => (
            <Tab
              key={sceneId}
              label={scene.name}
              value={sceneId}
              onClick={() => makeSceneActive(sceneId)}
            />
          ))}
        </Tabs>
        <ClickAwayListener onClickAway={handleSpeedDialClose}>
          <SpeedDial
            FabProps={{
              size: 'small',
            }}
            ariaLabel="Scene Actions"
            className={classes.speedDial}
            icon={<SpeedDialIcon />}
            onOpen={handleSpeedDialOpen}
            open={speedDialOpen}
            direction="up"
            fab={{
              size: 'large',
            }}
          >
            {sceneActionOptions.map((sceneActionOption) =>
              sceneActionOption ? (
                <SpeedDialAction
                  FabProps={{
                    size: 'small',
                  }}
                  key={sceneActionOption.name}
                  icon={sceneActionOption.icon}
                  tooltipTitle={sceneActionOption.name}
                  onClick={() => {
                    handleSpeedDialClose()
                    sceneActionOption.action()
                  }}
                  title={sceneActionOption.name}
                />
              ) : null
            )}
          </SpeedDial>
        </ClickAwayListener>
      </Toolbar>
    </Box>
  )
})

export default SceneTabs
