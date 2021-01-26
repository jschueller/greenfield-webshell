import Avatar from '@material-ui/core/Avatar'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import Person from '@material-ui/icons/Person'
import classNames from 'classnames'
import React, { FunctionComponent } from 'react'
import { useIntl } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'
import { useFirebaseConnect } from 'react-redux-firebase'
import { GoogleIcon } from '../../components/Icons'
import { useAppConfig } from '../../contexts/AppConfigProvider'

const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    width: 120,
    height: 120,
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(1) * 3,
  },
  root: {
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}))

const UserForm: FunctionComponent<{
  handleAdminChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void
  isAdmin: boolean
  uid: string
}> = ({ handleAdminChange, isAdmin, uid }) => {
  const appConfig = useAppConfig()
  const intl = useIntl()

  useFirebaseConnect([{ path: `/users/${uid}` }])
  const user = useSelector((store) => store.firebase.data.users?.[uid], shallowEqual)

  const isLinkedWithProvider = (provider: string) => user.providerData?.find((p) => p?.providerId === provider) ?? false

  const getProviderIcon = (p: string) => {
    switch (p) {
      case 'google.com':
        return <GoogleIcon />
      default:
        return undefined
    }
  }
  const classes = useStyles()

  return user ? (
    <div className={classes.root}>
      {user.photoURL && <Avatar alt="" src={user.photoURL} className={classNames(classes.avatar, classes.bigAvatar)} />}
      {!user.photoURL && (
        <Avatar className={classNames(classes.avatar, classes.bigAvatar)}>
          {' '}
          <Person style={{ fontSize: 60 }} />{' '}
        </Avatar>
      )}

      <div>
        {appConfig.firebase_providers.map((p, i) => {
          if (p !== 'email' && p !== 'password' && p !== 'phone') {
            return (
              <IconButton key={i} disabled={!isLinkedWithProvider(p)} color="primary">
                {getProviderIcon(p)}
              </IconButton>
            )
          } else {
            return <div key={i} />
          }
        })}
      </div>
      <br />

      <Typography variant="h4" gutterBottom>
        {user.displayName}
      </Typography>

      <div>
        <FormControlLabel
          control={<Switch checked={isAdmin} onChange={handleAdminChange} />}
          label={intl.formatMessage({ id: 'is_admin_label' })}
        />
      </div>
    </div>
  ) : null
}

export default React.memo(UserForm)
