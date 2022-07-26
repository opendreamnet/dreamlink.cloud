import { faker } from '@faker-js/faker'
import { MAX_USERNAME_LENGTH } from './defs'

export class Settings {
  public username: string

  public ignoreInvalid: boolean

  public constructor() {
    // Username
    this.username = localStorage.getItem('chat.username') || faker.internet.userName()
    this.username = this.username.substring(0, MAX_USERNAME_LENGTH)

    // Ignore invalid messages
    this.ignoreInvalid = localStorage.getItem('chat.ignore.invalid') === 'false' ? false : true
  }

  public setUsername(value: string): void {
    this.username = value.substring(0, MAX_USERNAME_LENGTH)
    localStorage.setItem('chat.username', value)
  }

  public setIgnoreInvalid(value: boolean): void {
    this.ignoreInvalid = value
    localStorage.setItem('chat.ignore.invalid', value ? 'true' : 'false')
  }
}

export const settings = new Settings()