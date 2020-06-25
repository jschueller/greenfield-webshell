import React, { FunctionComponent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Snackbar from '@material-ui/core/Snackbar'
import NotificationContent from './NotificationContent'
import { hideNotification } from '../../store/notification'

const Notification: FunctionComponent = () => {
  const dispatch = useDispatch()
  const notification = useSelector(({ notification }) => notification.notification)
  const [showingNotification, setShowingNotification] = useState(notification)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      if (open && notification !== showingNotification) {
        setOpen(false)
      } else if (!open) {
        setShowingNotification(notification)
        setOpen(true)
      }
    }, 150)
  }, [open, notification, showingNotification])

  const handleClose = (event: object, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(hideNotification())
  }

  const handleExited = () => dispatch(hideNotification())

  return showingNotification ? (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      onExited={handleExited}
    >
      <NotificationContent
        variant={showingNotification.variant}
        message={showingNotification.message}
        onClose={handleClose}
      />
    </Snackbar>
  ) : null
}

export default React.memo(Notification)
