"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Form, Input, Button } from "@heroui/react";

import UserNotFoundModal from "../../modals/UserNotFoundModal";

type LoginFormProps = {
  onCancel: () => void;
  onSuccess: () => void;
  onSuggestSignup?: () => void;
};

const inputClassNames = {
  label: "text-brand-deep text-xs",
  input: "text-brand-deep text-sm leading-5",
  inputWrapper:
    "h-14 min-h-14 !px-2 !pt-1 !pb-2 border-brand-gold bg-white/70 transition-all duration-300 hover:border-brand-primary focus-within:border-brand-primary",
  innerWrapper: "h-full items-center",
};

const LoginForm = ({
  onCancel,
  onSuccess,
  onSuggestSignup,
}: LoginFormProps) => {
  const router = useRouter();
  const [userNotFoundOpen, setUserNotFoundOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      return;
    }

    const attempt = await fetch("/api/auth/login-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = (await attempt.json()) as { code?: string };

    if (data.code === "USER_NOT_FOUND") {
      setUserNotFoundOpen(true);
      return;
    }

    if (data.code === "INVALID_CREDENTIALS") {
      setFormError("Incorrect password. Try again or reset it if needed.");
      return;
    }

    if (data.code !== "OK") {
      setFormError("Something went wrong. Please try again.");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      await getSession();
      onSuccess();
      router.refresh();
    } else {
      setFormError("Sign-in failed. Please try again.");
    }
  };

  return (
    <>
    <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <Input
        autoFocus
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

      {formError ? (
        <p className="text-sm text-brand-red" role="alert">
          {formError}
        </p>
      ) : null}

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
          Sign In
        </Button>
      </div>
    </Form>

    <UserNotFoundModal
      isOpen={userNotFoundOpen}
      onOpenChange={setUserNotFoundOpen}
      onRegister={() => onSuggestSignup?.()}
    />
    </>
  );
};

export default LoginForm;
// "use client";

// import { Form, Input, Button } from "@heroui/react";
// import { signIn } from "next-auth/react";

// type LoginFormProps = {
//   onCancel: () => void;
//   onSuccess: () => void;
// };

// const inputClassNames = {
//   label: "text-brand-deep text-xs",
//   input: "text-brand-deep text-sm leading-5",
//   inputWrapper:
//     "h-14 min-h-14 !px-2 !pt-1 !pb-2 border-brand-gold bg-white/70 transition-all duration-300 hover:border-brand-primary focus-within:border-brand-primary",
//   innerWrapper: "h-full items-center",
// };

// const LoginForm = ({ onCancel, onSuccess }: LoginFormProps) => {
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);
//     const email = formData.get("email");
//     const password = formData.get("password");

//     if (typeof email !== "string" || typeof password !== "string") {
//       console.error("Invalid form data");
//       return;
//     }

//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//       redirectTo: "/",
//     });

//     console.log("signIn result:", result);

//     if (result?.ok) {
//       onSuccess();
//       return;
//     }

//     console.error("Login failed:", result?.error);
//   };

//   return (
//     <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//       <Input
//         autoFocus
//         name="email"
//         type="email"
//         label="Email"
//         variant="bordered"
//         isRequired
//         classNames={inputClassNames}
//       />

//       <Input
//         name="password"
//         type="password"
//         label="Password"
//         variant="bordered"
//         isRequired
//         classNames={inputClassNames}
//       />

//       <div className="mt-2 flex w-full items-center justify-between gap-3">
//         <Button
//           type="button"
//           variant="light"
//           className="text-brand-deep transition-all duration-300 hover:scale-105 hover:text-brand-primary"
//           onPress={onCancel}
//         >
//           Cancel
//         </Button>

//         <Button
//           type="submit"
//           className="bg-brand-primary text-brand-cream transition-all duration-300 hover:scale-105 hover:bg-brand-deep"
//         >
//           Sign In
//         </Button>
//       </div>
//     </Form>
//   );
// };

// export default LoginForm;
