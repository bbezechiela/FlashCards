import React from "react";

export interface UserDetails {
  uid: string,
  displayName: string | null,
  email: string | null,
  photoURL: string | null,
}

export interface NavProps {
  isLoggedIn: boolean,
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface StatusProps {
  setStatus: React.Dispatch<React.SetStateAction<boolean>>;
}