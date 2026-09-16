export {}

export type Roles = "admin" | "user"

declare global{
    interface CustomJwtSessionCalims {
        metadata :{
            role? : Roles
        }
    }
}