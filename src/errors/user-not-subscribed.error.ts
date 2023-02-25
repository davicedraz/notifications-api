export class UserNotSubscribedException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotSubscribedException";
  }
}