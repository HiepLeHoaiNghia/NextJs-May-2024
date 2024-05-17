export interface IChangePasswordPayload {
  userId: string
  oldPassword: string
  newPassword: string
  token: string
}
