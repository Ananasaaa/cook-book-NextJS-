"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";

import LoginForm from "../form/auth/LoginForm";
import SignupForm from "../form/auth/SignupForm";

type AuthMode = "login" | "signup" | null;

type AuthModalProps = {
  mode: AuthMode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: Exclude<AuthMode, null>) => void;
};

const AuthModal = ({
  mode,
  isOpen,
  onOpenChange,
  onModeChange,
}: AuthModalProps) => {
  if (!mode) return null;

  const isLogin = mode === "login";

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      classNames={{
        base: "bg-brand-cream border border-brand-gold",
        header: "border-b border-brand-gold",
        body: "py-6",
        footer: "border-t border-brand-gold",
        closeButton:
          "text-brand-deep hover:bg-brand-gold/30 hover:text-brand-deep",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-brand-deep">
              {isLogin ? "Login" : "Create Account"}
              <span className="text-sm font-normal text-brand-deep/70">
                {isLogin
                  ? "Welcome back to Recipe & Kitchen"
                  : "Join Recipe & Kitchen"}
              </span>
            </ModalHeader>

            <ModalBody>
              {isLogin ? (
                <LoginForm
                  onCancel={onClose}
                  onSuccess={() => onOpenChange(false)}
                />
              ) : (
                <SignupForm
                  onCancel={onClose}
                  onSuccess={() => onOpenChange(false)}
                />
              )}
            </ModalBody>

            <ModalFooter className="justify-center">
              <p className="text-sm text-brand-deep/70">
                {isLogin
                  ? "Don’t have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => onModeChange(isLogin ? "signup" : "login")}
                  className="font-medium text-brand-primary transition-colors duration-300 hover:text-brand-deep"
                >
                  {isLogin ? "Sign up" : "Login"}
                </button>
              </p>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AuthModal;
