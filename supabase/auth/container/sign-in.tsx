"use client";

import * as Yup from "yup";
import Template from "../tmp";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import supabase from "@/supabase/browser";
import { Field, Form, Formik } from "formik";
import { useAuth, VIEWS } from "../provider";
import { Button } from "@/components/ui/button";
import { logsnag, sendError } from "@/lib/logs";
import { ReloadIcon } from "@radix-ui/react-icons";

const SignInSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("This field is Required"),
  password: Yup.string().required("This field is Required"),
});

const SignIn = () => {
  const { setView } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (formData: any) => {
    setIsLoading(true);

    const { error, data } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    await logsnag.track({
      channel: "users",
      event: `User Sign-in: "${data.user?.user_metadata.name}"`,
      user_id: data.user?.id,
      icon: "👋",
      notify: true,
      tags: {
        email: formData.email,
      },
    });

    if (error) {
      toast.error("The Email or Password is incorrect");

      sendError("Auth", error.message);
    }

    setIsLoading(false);
  };

  return (
    <Template>
      <h2 className="text-2xl font-semibold text-black dark:text-white">
        Welcome to Paber AI
      </h2>

      <p className="text-sm text-gray-500 font-medium pt-2">
        Don't have an Account?{" "}
        <a
          onClick={() => setView(VIEWS.SIGN_UP)}
          className="text-blue-700 font-semibold cursor-pointer"
        >
          Create a new Account
        </a>
      </p>

      <p className="text-sm text-gray-500 font-medium pt-2">
        Forget Password?{" "}
        <a
          onClick={() => setView(VIEWS.FORGOTTEN_PASSWORD)}
          className="text-blue-700 font-semibold cursor-pointer"
        >
          Reset
        </a>
      </p>

      {/* <p
        onClick={() =>
          signIn({
            email: "guest@paberai.com",
            password: process.env.NEXT_PUBLIC_GUEST_PASSWORD!,
          })
        }
        className="text-sm flex items-center font-semibold text-green-600 cursor-pointer"
      >
        <Zap className="text-green-700 mr-1" size={18} />
        Or Sign In as a Guest
      </p> */}

      <div className="my-2 mb-2 pt-8">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={SignInSchema}
          onSubmit={signIn}
        >
          {({ errors, touched }) => (
            <Form className="column w-full">
              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-gray-400 pb-2 text-sm font-semibold"
              >
                Email
              </label>

              <Field
                spellCheck={false}
                className={cn(
                  "input",
                  errors.email && touched.email && "bg-red-50",
                )}
                id="email"
                name="email"
                type="email"
              />

              {errors.email && touched.email ? (
                <div className="text-red-600 text-sm font-medium pt-1">
                  {errors.email}
                </div>
              ) : null}

              <div className="pb-6" />

              <label
                htmlFor="password"
                className="block text-gray-600 dark:text-gray-400 pb-2 text-sm font-semibold"
              >
                Password
              </label>

              <Field
                spellCheck={false}
                className={cn(
                  "input",
                  errors.password && touched.password && "bg-red-50",
                )}
                id="password"
                placeholder="••••••••••••••••"
                name="password"
                type="password"
              />

              {errors.password && touched.password ? (
                <div className="text-red-600 text-sm font-medium pt-1">
                  {errors.password}
                </div>
              ) : null}

              <br />

              <div className="place-content-center   items-center place-items-center text-center">
                <Button type="submit">
                  Sign In
                  {isLoading ? (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <></>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  );
};

export default SignIn;
