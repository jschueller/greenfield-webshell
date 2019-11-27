import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Notifications from '@material-ui/icons/Notifications'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import Typography from '@material-ui/core/Typography'
import moment from 'moment'
import { ThemeProvider, useTheme } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import { useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { setPersistentValue } from '../../store/persistentValues/actions'
import { useHistory, useLocation } from 'react-router'
import { useFirebase } from 'react-redux-firebase'
import { useAppConfig } from '../../contexts/AppConfigProvider'

export const PermissionRequestToast = ({ closeToast, initializeMessaging }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const firebase = useFirebase()
  const appConfig = useAppConfig
  const theme = useTheme()

  const type = theme.palette.type === 'light' ? 'dark' : 'light'

  const innerTheme = createMuiTheme({ palette: { type } })

  return (
    <ThemeProvider theme={innerTheme}>
      <Paper style={{ margin: -8 }}>
        <Typography>
          <ListItem>
            <ListItemIcon>
              <Notifications color='secondary' fontSize='large' />
            </ListItemIcon>
            <ListItemText primary={intl.formatMessage({ id: 'enable_notifications_message' })} />
          </ListItem>

          <DialogActions>
            <Button
              onClick={() => {
                dispatch(setPersistentValue('notificationPermissionRequested', moment()))
                initializeMessaging(location, initializeMessaging, firebase, appConfig, history)
                closeToast()
              }}
            >
              {intl.formatMessage({ id: 'enable' })}
            </Button>
            <Button
              color='secondary'
              onClick={() => {
                dispatch(setPersistentValue('notificationPermissionRequested', moment()))
                closeToast()
              }}
            >
              {intl.formatMessage({ id: 'no_thanks' })}
            </Button>
          </DialogActions>
        </Typography>
      </Paper>
    </ThemeProvider>
  )
}

export default PermissionRequestToast
