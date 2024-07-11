"use client";

import * as Yup from "yup";
import Template from "../tmp";
import { cn } from "@/lib/utils";
import { sendError } from "@/lib/logs";
import { toast } from "react-hot-toast";
import supabase from "@/supabase/browser";
import { Field, Form, Formik } from "formik";
import { Button } from "@/components/ui/button";

const UpdatePasswordSchema = Yup.object().shape({
  password: Yup.string().required("This field is required"),
});

const UpdatePassword = () => {
  const updatePassword = async (formData: any) => {
    const { error } = await supabase.auth.updateUser({
      password: formData.password,
    });

    if (error) {
      toast.error(error.message);

      sendError("Auth", error.message);
    }
  };

  return (
    <Template>
      <h2 className="font-medium text-2xl text-black">Reset Password</h2>

      <p className="text-sm text-gray-500 font-medium pt-1 cursor-pointer">
        Enter a new password for your account
      </p>

      <div className="my-2 mb-2 pt-8">
        <Formik
          initialValues={{
            password: "",
          }}
          validationSchema={UpdatePasswordSchema}
          onSubmit={updatePassword}
        >
          {({ errors, touched }) => (
            <Form className="column w-full">
              <label
                htmlFor="password"
                className="block text-gray-500 pb-2 text-sm font-medium"
              >
                New Password
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

              <Button type="submit">Update Password</Button>
            </Form>
          )}
        </Formik>
      </div>
    </Template>
  );
};

export default UpdatePassword;
