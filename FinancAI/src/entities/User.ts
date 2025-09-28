export interface User {
  id: string
  full_name: string
  email: string
}

// mock API for now
export const User = {
  async me(): Promise<User> {
    return { id: "1", full_name: "Test User", email: "test@example.com" }
  }
}