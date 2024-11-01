import { Meta, StoryObj } from '@storybook/react';

import { Modal } from 'components/shared/Modal';
import { Button } from 'components/shared/Button';

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: 'Components/Modal',
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'object',
    },
    hasCloseButton: {
      type: 'boolean',
    },
    hasOverlay: {
      type: 'boolean',
    },
    preventClickOutsideToClose: {
      type: 'boolean',
    },
    fullPage: {
      type: 'boolean',
    },
  },
  args: {
    hasCloseButton: true,
    hasOverlay: true,
    preventClickOutsideToClose: false,
    fullPage: false,
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: () => {
    return (
      <Modal>
        <Modal.Trigger asChild>
          <Button>Open modal</Button>
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>Modal title</Modal.Header>
          <Modal.Body>
            <p>Modal content</p>
          </Modal.Body>
          <Modal.Footer>
            <Button>Close</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    );
  },
};
