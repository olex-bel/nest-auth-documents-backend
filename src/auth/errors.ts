export class UserDisabledError extends Error {
    constructor() {
      super('User is disabled');
      this.name = 'UserDisabledError';
    }
}

export class UserAlreadyExistsError extends Error {
    constructor() {
      super('User already exists');
      this.name = 'UserAlreadyExistsError';
    }
}

export class CredentialsValidationError extends Error {
    constructor() {
      super('Invalid credentials');
      this.name = 'CredentialsValidationError';
    }
}
