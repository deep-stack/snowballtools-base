import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { Organization } from 'gql-client';

import { Typography, Option } from '@material-tailwind/react';

import { useGQLClient } from '../context/GQLClientContext';
import AsyncSelect from './shared/AsyncSelect';

const Sidebar = () => {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const client = useGQLClient();

  const [selectedOrgSlug, setSelectedOrgSlug] = useState(orgSlug);
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const fetchUserOrganizations = useCallback(async () => {
    const { organizations } = await client.getOrganizations();
    setOrganizations(organizations);
  }, [orgSlug]);

  useEffect(() => {
    fetchUserOrganizations();
    setSelectedOrgSlug(orgSlug);
  }, [orgSlug]);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="grow">
        <div>
          <Link to={`/${orgSlug}`}>
            <h3 className="text-black text-2xl">Snowball</h3>
          </Link>
        </div>
        <AsyncSelect
          className="bg-white py-2"
          value={selectedOrgSlug}
          onChange={(value) => {
            setSelectedOrgSlug(value!);
            navigate(`/${value}`);
          }}
          selected={(_, index) => (
            <div className="flex gap-2">
              <div>^</div>
              <div>
                <span>{organizations[index!]?.name}</span>
                <Typography>Organization</Typography>
              </div>
            </div>
          )}
        >
          {/* TODO: Show label organization and manage in option */}
          {organizations.map((org) => (
            <Option key={org.id} value={org.slug}>
              ^ {org.name}
              {org.slug === selectedOrgSlug && <p className="float-right">^</p>}
            </Option>
          ))}
        </AsyncSelect>
        <div>
          <NavLink
            to={`/${orgSlug}`}
            className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
          >
            <Typography>Projects</Typography>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/${orgSlug}/settings`}
            className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
          >
            <Typography>Settings</Typography>
          </NavLink>
        </div>
      </div>
      <div className="grow flex flex-col justify-end">
        <div>Documentation</div>
        <div>Support</div>
      </div>
    </div>
  );
};

export default Sidebar;
