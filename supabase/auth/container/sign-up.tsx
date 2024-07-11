"use client";

import * as Yup from "yup";
import Template from "../tmp";
import { useState } from "react";
import { cn } from "@/lib/utils";
import validator from "validator";
import toast from "react-hot-toast";
import supabase from "@/supabase/browser";
import { Field, Form, Formik } from "formik";
import { VIEWS, useAuth } from "../provider";
import { Button } from "@/components/ui/button";
import { logsnag, sendError } from "@/lib/logs";
import { ReloadIcon } from "@radix-ui/react-icons";
import passwordValidator from "password-validator";

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("This field is required"),
  password: Yup.string().required("This field is required"),
  name: Yup.string().required("This field is required"),
});

const SignUp = () => {
  const { setView } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const passwordSchema = new passwordValidator();

  passwordSchema
    .is()
    .min(8)
    .is()
    .max(100)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .symbols()
    .has()
    .digits(1)
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf(["Passw0rd", "Password123", "P@$$w0rd"]);

  const signUp = async (formData: any) => {
    setIsLoading(true);

    const signUpFunc = async (
      params: any,
    ): Promise<{ auth: any; error: Error | null }> => {
      let authError = null;

      if (
        validator.isEmail(params.email) &&
        passwordSchema.validate(params.password)
      ) {
        const { data, error } = await supabase.auth.signUp({
          email: params.email,
          password: params.password,
          options: {
            data: {
              name: params.name,
            },
          },
        });

        // User exists, but is fake. See https://supabase.com/docs/reference/javascript/auth-signup
        if (
          data.user &&
          data.user.identities &&
          data.user.identities.length === 0
        ) {
          authError = {
            name: "AuthApiError",
            message: "User already exists",
          };
        } else if (error)
          authError = {
            name: error.name,
            message: error.message,
          };

        await logsnag.track({
          channel: "users",
          event: `New User: "${params.name}"`,
          user_id: data.user?.id,
          icon: "👋",
          notify: true,
          tags: {
            email: params.email,
          },
        });

        await logsnag.insight.increment({
          title: "All Users",
          value: 1,
          icon: "🤝",
        });

        return { auth: data, error: authError };
      } else {
        toast.error(
          "The password must contain numbers, lowercase letters, at least one uppercase letter, and be at least 8 characters long",
        );

        return { auth: null, error: authError };
      }
    };

    const { error } = await signUpFunc({
      email: formData.email,
      password: formData.password,
      name: formData.name,
    });

    if (error) {
      toast.error(error.message);

      sendError("Auth", error.message);
    }

    setIsLoading(false);
  };

  return (
    <Template>
      <h2 className="text-2xl font-semibold text-black dark:text-white">
        Create a new Account
      </h2>

      <p className="text-sm text-gray-500 font-medium pt-1">
        Already have an account?{" "}
        <a
          onClick={() => setView(VIEWS.SIGN_IN)}
          className="text-blue-700 font-semibold cursor-pointer"
        >
          Sign In
        </a>
      </p>

      <div className="my-2 mb-2 pt-8">
        <Formik
          initialValues={{
            email: "",
            password: "",
            name: "",
          }}
          validationSchema={SignUpSchema}
          onSubmit={signUp}
        >
          {({ errors, touched }) => (
            <Form className="column w-full">
              <label
                htmlFor="name"
                className="block text-gray-600 dark:text-gray-400 pb-2 text-sm font-semibold"
              >
                Your Name
              </label>

              <Field
                spellCheck={false}
                className="input"
                id="name"
                name="name"
                type="text"
              />

              {errors.name && touched.name ? (
                <div className="text-red-600 text-sm font-medium pt-1">
                  {errors.name}
                </div>
              ) : null}

              <div className="pb-6" />

              <label
                htmlFor="email"
                className="block text-gray-600 dark:text-gray-400 pb-2 text-sm font-semibold"
              >
                Email
              </label>

              <Field
                spellCheck={false}
                className={cn("input", errors.email && "bg-red-50")}
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
                className="block   text-gray-600 dark:text-gray-400 pb-2 text-sm font-semibold"
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

              <p className="text-[12px] text-justify">
                * The password must contain numbers, lowercase letters, at least
                one uppercase letter, and be at least 8 characters long
              </p>

              <br />

              <div className="place-content-center items-center place-items-center text-center">
                <Button type="submit">
                  Create a new Account
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

export default SignUp;
