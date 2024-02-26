import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { Organization } from 'gql-client';

import { Typography, Option } from '@material-tailwind/react';
import { useDisconnect } from 'wagmi';

import { useGQLClient } from '../context/GQLClientContext';
import AsyncSelect from './shared/AsyncSelect';

const Sidebar = () => {
  const { orgSlug } = useParams();
  const navigate = useNavigate();
  const client = useGQLClient();
  const { disconnect } = useDisconnect();

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

  const handleLogOut = useCallback(() => {
    disconnect();
    navigate('/login');
  }, [disconnect, navigate]);

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
                <Typography placeholder={''}>Organization</Typography>
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
            <Typography placeholder={''}>Projects</Typography>
          </NavLink>
        </div>
        <div>
          <NavLink
            to={`/${orgSlug}/settings`}
            className={({ isActive }) => (isActive ? 'text-blue-500' : '')}
          >
            <Typography placeholder={''}>Settings</Typography>
          </NavLink>
        </div>
      </div>
      <div className="grow flex flex-col justify-end">
        <a className="cursor-pointer" onClick={handleLogOut}>
          Log Out
        </a>
        <a className="cursor-pointer">Documentation</a>
        <a className="cursor-pointer">Support</a>
      </div>
    </div>
  );
};

export default Sidebar;
