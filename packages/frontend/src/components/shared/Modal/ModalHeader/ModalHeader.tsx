import React from 'react';
import type { DialogDescriptionProps } from '@radix-ui/react-dialog';
import { Description, Title } from '@radix-ui/react-dialog';
import type { ComponentPropsWithoutRef, PropsWithChildren } from 'react';
import { Heading } from 'components/shared/Heading';
import { modalTheme } from 'components/shared/Modal/Modal.theme';

type ModalHeaderProps = ComponentPropsWithoutRef<'div'> & {
  className?: string;
  description?: string | React.ReactNode;
  descriptionProps?: DialogDescriptionProps;
  headingProps?: ComponentPropsWithoutRef<'h2'>;
};

export const ModalHeader = ({
  children,
  description,
  className,
  descriptionProps,
  headingProps,
  ...props
}: PropsWithChildren<ModalHeaderProps>) => {
  const { header, headerDescription, headerTitle } = modalTheme();

  return (
    <div
      className={header({
        className,
      })}
      {...props}
    >
      <Title asChild>
        <Heading
          {...headingProps}
          className={headerTitle({ className: headingProps?.className })}
        >
          {children}
        </Heading>
      </Title>
      {description && (
        <Description
          {...descriptionProps}
          className={headerDescription({
            className: descriptionProps?.className,
          })}
        >
          {description}
        </Description>
      )}
    </div>
  );
};
