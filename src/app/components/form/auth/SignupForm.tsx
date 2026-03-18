"use client";

import { Form, Input, Button } from "@heroui/react";

type SignupFormProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

const inputClassNames = {
  label: "text-brand-deep text-xs",
  input: "text-brand-deep text-sm leading-5",
  inputWrapper:
    "h-14 min-h-14 !px-2 !py-2 border-brand-gold bg-white/70 transition-all duration-300 hover:border-brand-primary focus-within:border-brand-primary",
  innerWrapper: "h-full items-center",
};

const SignupForm = ({ onCancel, onSuccess }: SignupFormProps) => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      console.error("Invalid form data");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      console.log(data);
      onSuccess();
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        label="Email"
        variant="bordered"
        isRequired
        classNames={inputClassNames}
      />

      <Input
        name="password"
        type="password"
        label="Password"
        variant="bordered"
        isRequired
        classNames={inputClassNames}
      />

      <Input
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        variant="bordered"
        isRequired
        classNames={inputClassNames}
      />

      <div className="mt-2 flex w-full items-center justify-between gap-3">
        <Button
          type="button"
          variant="light"
          className="text-brand-deep transition-all duration-300 hover:scale-105 hover:text-brand-primary"
          onPress={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          className="bg-brand-primary text-brand-cream transition-all duration-300 hover:scale-105 hover:bg-brand-deep"
        >
          Create Account
        </Button>
      </div>
    </Form>
  );
};

export default SignupForm;
