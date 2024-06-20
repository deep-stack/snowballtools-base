import { CopyBlock, atomOneLight } from 'react-code-blocks';
import { Link } from 'react-router-dom';

import { Modal } from 'components/shared/Modal';
import { Button } from 'components/shared/Button';

interface AssignDomainProps {
  open: boolean;
  handleOpen: () => void;
}

const AssignDomainDialog = ({ open, handleOpen }: AssignDomainProps) => {
  return (
    <Modal open={open} onOpenChange={handleOpen}>
      <Modal.Content>
        <Modal.Header>Assign Domain</Modal.Header>
        <Modal.Body>
          In order to assign a domain to your production deployments, configure
          it in the{' '}
          {/* TODO: Fix selection of project settings tab on navigation to domains */}
          <Link to="../settings/domains" className="text-light-blue-800 inline">
            project settings{' '}
          </Link>
          (recommended). If you want to assign to this specific deployment,
          however, you can do so using our command-line interface:
          {/* https://github.com/rajinwonderland/react-code-blocks/issues/138 */}
          <CopyBlock
            text="snowball alias <deployment> <domain>"
            language=""
            showLineNumbers={false}
            theme={atomOneLight}
          />
        </Modal.Body>
        <Modal.Footer className="flex justify-start">
          <Button onClick={handleOpen}>Okay</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default AssignDomainDialog;
