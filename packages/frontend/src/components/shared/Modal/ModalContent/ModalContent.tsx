import React from 'react';
import type { DialogContentProps } from '@radix-ui/react-dialog';
import { Close, Content, Overlay, Portal } from '@radix-ui/react-dialog';
import { Ref, forwardRef, type PropsWithChildren } from 'react';
import { useModal } from 'components/shared/Modal/ModalProvider';
import { modalTheme } from 'components/shared/Modal/Modal.theme';
import { Button } from 'components/shared/Button';
import { CrossIcon } from 'components/shared/CustomIcon';

type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent;
}>;

export interface ModalContentProps extends DialogContentProps {
  className?: string;
}

const ModalContent = forwardRef(
  (
    { children, className, ...props }: PropsWithChildren<ModalContentProps>,
    forwardedRef,
  ) => {
    const { hasCloseButton, preventClickOutsideToClose, fullPage } = useModal();

    const { content, close, overlay } = modalTheme({ fullPage });

    const preventClickOutsideToCloseProps = preventClickOutsideToClose && {
      onPointerDownOutside: (e: PointerDownOutsideEvent) => e.preventDefault(),
      onEscapeKeyDown: (e: KeyboardEvent) => e.preventDefault(),
    };

    return (
      <Portal>
        <Overlay className={overlay({ fullPage })}>
          <Content
            className={content({ className, fullPage })}
            {...preventClickOutsideToCloseProps}
            {...props}
            ref={forwardedRef as Ref<HTMLDivElement>}
          >
            {hasCloseButton && (
              <Close asChild>
                <Button
                  aria-label="Close"
                  className={close()}
                  size="sm"
                  iconOnly
                  variant="tertiary"
                >
                  <CrossIcon />
                </Button>
              </Close>
            )}
            {children}
          </Content>
        </Overlay>
      </Portal>
    );
  },
);

ModalContent.displayName = 'ModalContent';

export { ModalContent };
