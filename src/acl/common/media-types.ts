export type Action = "login" | "logout" | "sendMessage" | "verify"

export type Payload<T = {}> = {
  action: Action
  payload: T & { password: string }
}

export type RawMedia<T = {}> = {
  status: number
  payload: T
}

export interface Reader<T> {
  read: (content: string) => T
}

export interface Writer<T> {
  write: (...args: Array<T>) => string
}
