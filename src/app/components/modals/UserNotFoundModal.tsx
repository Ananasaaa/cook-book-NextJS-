"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

type UserNotFoundModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: () => void;
};

const UserNotFoundModal = ({
  isOpen,
  onOpenChange,
  onRegister,
}: UserNotFoundModalProps) => {
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
              Account not found
              <span className="text-sm font-normal text-brand-deep/70">
                There is no user with this email in Recipe & Kitchen.
              </span>
            </ModalHeader>

            <ModalBody>
              <p className="text-sm leading-6 text-brand-deep/80">
                Please sign up to create an account, or check that you entered
                the correct email address.
              </p>
            </ModalBody>

            <ModalFooter className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="light"
                className="text-brand-deep transition-all duration-300 hover:scale-105 hover:text-brand-primary"
                onPress={onClose}
              >
                Close
              </Button>

              <Button
                type="button"
                className="bg-brand-primary text-brand-cream transition-all duration-300 hover:scale-105 hover:bg-brand-deep"
                onPress={() => {
                  onClose();
                  onRegister();
                }}
              >
                Sign up
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UserNotFoundModal;
