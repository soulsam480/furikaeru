export const ERROR_MESSAGES = {
  user_not_found: 'User not found !',
  unauthorized: 'Unauthorized',
  bad_request: 'Bad request',
  acccess_token_not_found: 'Access token not found !',
  acccess_token_expired: 'Token is expired or invalid !',
  refresh_token_not_found: 'Refresh token not found !',
  email_in_use: 'Email already in use !',
  iss: 'Something went wrong !',
  user_exists_with_credentials: 'User with same email or username exists !',
  not_found: 'Not found !',
};

export const CORS_ORIGINS = ['http://localhost:4000', 'http://localhost:5000'];

export enum NAMESPACES {
  root = '/',
  board = '/board',
}
