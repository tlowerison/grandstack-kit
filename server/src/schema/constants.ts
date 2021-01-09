export enum Role {
  Admin = "ADMIN",
  Server = "SERVER",
  User = "USER",
}

export enum Scope {
  WriteMe = "WRITE_ME",
  ReadGroups = "READ_GROUPS",
  WriteGroups = "WRITE_GROUPS",
  DeleteGroups = "DELETE_GROUPS",
  ReadCollections = "READ_COLLECTIONS",
  WriteCollections = "WRITE_COLLECTIONS",
  DeleteCollections = "DELETE_COLLECTIONS",
}
