import toast from 'react-hot-toast';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { useGQLClient } from '../../../../../../../context/GQLClientContext';
import { Heading } from 'components/shared/Heading';
import { Table } from 'components/shared/Table';
import { Button } from 'components/shared/Button';
import { InlineNotification } from 'components/shared/InlineNotification';
import { ArrowRightCircleIcon } from 'components/shared/CustomIcon';

const Config = () => {
  const { id, orgSlug } = useParams();
  const client = useGQLClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const primaryDomainName = searchParams.get('name');

  const handleSubmitDomain = async () => {
    if (primaryDomainName === null) {
      toast.error('Cannot resolve domain name');
      return;
    }

    if (id === undefined) {
      toast.error('Cannot find project');
      return;
    }

    const isAdded = await client.addDomain(id, {
      name: primaryDomainName,
    });

    if (isAdded) {
      toast.success('Domain added successfully');
      navigate(`/${orgSlug}/projects/${id}/settings/domains`);
    } else {
      toast.error('Error adding domain');
    }
  };

  // TODO: Figure out DNS Provider if possible and update appropriatly
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <Heading className="text-sky-950 text-lg font-medium leading-normal">
          Setup domain name
        </Heading>
        <p className="text-blue-gray-500">
          Add the following records to your domain.&nbsp;
          <a href="https://www.namecheap.com/" target="_blank" rel="noreferrer">
            <span className="underline">Go to NameCheap</span>
          </a>
        </p>
      </div>

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
    </div>
  );
};

export default Config;
