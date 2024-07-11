"use client";

import * as Yup from "yup";
import Template from "../tmp";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { sendError } from "@/lib/logs";
import { toast } from "react-hot-toast";
import supabase from "@/supabase/browser";
import { Field, Form, Formik } from "formik";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAuth, VIEWS } from "@/supabase/auth/provider";

const ResetPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("This field is required"),
});

const ResetPassword = () => {
  const { setView } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (formData: any) => {
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      formData?.email,
    );

    if (error) {
      toast.error(error.message);

      sendError("Auth", error.message);
    } else {
      toast.success("Password reset instructions sent");
    }

    setIsLoading(false);
  };

  return (
    <Template>
      <h2 className="font-medium text-2xl text-black">Reset Password</h2>

      <p className="text-sm font-medium pt-1 cursor-pointer">
        <a onClick={() => setView(VIEWS.SIGN_IN)} className="text-blue-700">
          Return to Sign In Page
        </a>
      </p>

      <div className="my-2 mb-2 pt-8">
        <Formik
          initialValues={{
            email: "",
          }}
          validationSchema={ResetPasswordSchema}
          onSubmit={resetPassword}
        >
          {({ errors, touched }) => (
            <Form className="column w-full">
              <label
                htmlFor="email"
                className="block text-gray-600 pb-2 text-sm font-medium"
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

              <br />

              <div className="place-content-center items-center place-items-center text-center">
                <Button type="submit">
                  Send Instructions
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

export default ResetPassword;
