import React from "react";
import SignInButton from "../signin/signin.client";
import Link from "next/link";

const AppBar = () => {
  return (
    <header>
      <SignInButton></SignInButton>
      <Link href={"/users"}>User List:</Link>
    </header>
  );
};

export default AppBar;
