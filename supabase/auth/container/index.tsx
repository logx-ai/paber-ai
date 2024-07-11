"use client";

import SignIn from "./sign-in";
import SignUp from "./sign-up";
import ResetPassword from "./reset";
import UpdatePassword from "./update";
import { useAuth, VIEWS } from "../provider";
import { ReloadIcon } from "@radix-ui/react-icons";

const Auth = ({ view: initialView }: any) => {
  let { view } = useAuth();

  if (initialView) {
    view = initialView;
  }

  switch (view) {
    case VIEWS.UPDATE_PASSWORD:
      return <UpdatePassword />;

    case VIEWS.FORGOTTEN_PASSWORD:
      return <ResetPassword />;

    case VIEWS.SIGN_UP:
      return <SignUp />;

    case VIEWS.SIGN_IN:
      return <SignIn />;

    default:
      return (
        <div className="flex items-center place-content-center place-items-center fixed inset-0 ">
          <ReloadIcon className="fill-black animate-spin justify-center" />
        </div>
      );
  }
};

export default Auth;
