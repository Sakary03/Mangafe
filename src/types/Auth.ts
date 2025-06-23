/**
 * Interface for the forgot password request
 */
export interface ForgotPasswordRequestDTO {
  email: string;
}

/**
 * Interface for the reset password request
 */
export interface ResetPasswordRequestDTO {
  token: string;
  newPassword: string;
}

/**
 * Interface for password change request
 */
export interface ChangePasswordDTO {
  oldPassword: string;
  newPassword: string;
}
