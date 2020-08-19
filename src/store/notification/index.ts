import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Notification {
  message: string
  variant: 'info' | 'warning' | 'error' | 'success'
}

export interface NotificationState {
  notification?: Notification
}

const initialState: NotificationState = {}

const reducers = {
  showNotification(state: NotificationState, action: PayloadAction<Notification>) {
    state.notification = action.payload
  },
  hideNotification(state: NotificationState) {
    state.notification = undefined
  },
}

const slice = createSlice({
  reducers,
  initialState,
  name: 'greenfield/notification',
})

export const { showNotification, hideNotification } = slice.actions
export default slice.reducer
