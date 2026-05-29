
export type GenericBaseClass = new (...args:any[]) => {}

export type RoleType = "guest" | "member" | "moderator" | "admin"

export type WhichValidator = "required" | "max" | "min"