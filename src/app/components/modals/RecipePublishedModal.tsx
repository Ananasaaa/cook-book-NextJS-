"use client";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";

type RecipePublishedModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function RecipePublishedModal({
  isOpen,
  onOpenChange,
}: RecipePublishedModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      backdrop="blur"
      hideCloseButton
      isDismissable={false}
      classNames={{
        base: "bg-brand-cream border border-brand-gold",
        header: "border-b border-brand-gold",
        body: "py-8",
        backdrop: "bg-black/40",
      }}
      motionProps={{
        variants: {
          enter: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.25, ease: "easeOut" },
          },
          exit: {
            opacity: 0,
            y: 8,
            transition: { duration: 0.35, ease: "easeIn" },
          },
        },
      }}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-brand-deep">
              Success
            </ModalHeader>
            <ModalBody>
              <p className="text-center text-lg leading-relaxed text-brand-deep/90">
                Your recipe has been added
              </p>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
