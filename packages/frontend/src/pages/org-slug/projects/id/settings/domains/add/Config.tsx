import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useGQLClient } from 'context/GQLClientContext';
import { Table } from 'components/shared/Table';
import { Button } from 'components/shared/Button';
import { InlineNotification } from 'components/shared/InlineNotification';
import { ArrowRightCircleIcon } from 'components/shared/CustomIcon';
import { ProjectSettingContainer } from 'components/projects/project/settings/ProjectSettingContainer';
import { useToast } from 'components/shared/Toast';

const Config = () => {
  const { id } = useParams();
  const client = useGQLClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const primaryDomainName = searchParams.get('name');
  const { toast, dismiss } = useToast();

  const handleSubmitDomain = async () => {
    if (primaryDomainName === null) {
      toast({
        id: 'unresolvable_domain_name',
        title: 'Cannot resolve domain name',
        variant: 'error',
        onDismiss: dismiss,
      });
      return;
    }

    if (id === undefined) {
      toast({
        id: 'domain_cannot_find_project',
        title: 'Cannot find project',
        variant: 'error',
        onDismiss: dismiss,
      });
      return;
    }

    const isAdded = await client.addDomain(id, {
      name: primaryDomainName,
    });

    if (isAdded) {
      toast({
        id: 'domain_added_successfully',
        title: 'Domain added successfully',
        variant: 'success',
        onDismiss: dismiss,
      });
      navigate(`/projects/${id}/settings/domains`);
    } else {
      toast({
        id: 'generic_error_adding_domain',
        title: 'Error adding domaint',
        variant: 'error',
        onDismiss: dismiss,
      });
    }
  };

  // TODO: Figure out DNS Provider if possible and update appropriatly
  return (
    <ProjectSettingContainer headingText="Setup domain name">
      <p className="text-blue-gray-500">
        Add the following records to your domain.&nbsp;
        <a href="https://www.namecheap.com/" target="_blank" rel="noreferrer">
          <span className="underline">Go to NameCheap</span>
        </a>
      </p>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Host</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Value</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>A</Table.RowHeaderCell>
            <Table.Cell>@</Table.Cell>
            <Table.Cell>56.49.19.21</Table.Cell>
          </Table.Row>

          <Table.Row>
            <Table.RowHeaderCell>CNAME</Table.RowHeaderCell>
            <Table.Cell>www</Table.Cell>
            <Table.Cell>cname.snowballtools.xyz</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <InlineNotification
        variant="info"
        title={`It can take up to 48 hours for these updates to reflect
        globally.`}
      />
      <Button
        className="w-fit"
        onClick={handleSubmitDomain}
        variant="primary"
        rightIcon={<ArrowRightCircleIcon />}
      >
        Finish
      </Button>
    </ProjectSettingContainer>
  );
};

export default Config;
