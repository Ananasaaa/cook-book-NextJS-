"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

type LogoutConfirmModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
};

const LogoutConfirmModal = ({
  isOpen,
  onOpenChange,
  onConfirm,
}: LogoutConfirmModalProps) => {
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
              Log out?
              <span className="text-sm font-normal text-brand-deep/70">
                Are you sure you want to sign out of Recipe & Kitchen?
              </span>
            </ModalHeader>

            <ModalBody>
              <p className="text-sm leading-6 text-brand-deep/80">
                You can sign in again at any time with your email and password.
              </p>
            </ModalBody>

            <ModalFooter className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="light"
                className="text-brand-deep transition-all duration-300 hover:scale-105 hover:text-brand-primary"
                onPress={onClose}
              >
                Cancel
              </Button>

              <Button
                type="button"
                className="bg-brand-primary text-brand-cream transition-all duration-300 hover:scale-105 hover:bg-brand-deep"
                onPress={async () => {
                  await onConfirm();
                  onClose();
                }}
              >
                Yes, log out
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LogoutConfirmModal;
