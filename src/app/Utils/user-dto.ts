import firebase from "firebase/compat";
import { User } from "../Models/user";

export const mapUserToEmailSignIn = (user: User): User => {
  return {
    displayName: user.displayName,
    email: `${user.displayName}@example.com`,
    groups: [],
    partners: [],
    wishList: []
  };
}
