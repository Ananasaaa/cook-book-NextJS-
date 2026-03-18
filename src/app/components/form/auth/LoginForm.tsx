"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Form, Input, Button } from "@heroui/react";

type LoginFormProps = {
  onCancel: () => void;
  onSuccess: () => void;
};

const inputClassNames = {
  label: "text-brand-deep text-xs",
  input: "text-brand-deep text-sm leading-5",
  inputWrapper:
    "h-14 min-h-14 !px-2 !pt-1 !pb-2 border-brand-gold bg-white/70 transition-all duration-300 hover:border-brand-primary focus-within:border-brand-primary",
  innerWrapper: "h-full items-center",
};

const LoginForm = ({ onCancel, onSuccess }: LoginFormProps) => {
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    if (typeof email !== "string" || typeof password !== "string") {
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      onSuccess();
      router.refresh();
    }
  };

  return (
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
