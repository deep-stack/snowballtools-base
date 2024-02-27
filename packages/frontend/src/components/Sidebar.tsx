import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { Organization } from 'gql-client';

import { Option } from '@material-tailwind/react';
import { useDisconnect } from 'wagmi';

import { useGQLClient } from '../context/GQLClientContext';
import AsyncSelect from './shared/AsyncSelect';
import {
  ChevronGrabberHorizontal,
  FolderIcon,
  GlobeIcon,
  LifeBuoyIcon,
  QuestionMarkRoundIcon,
  SettingsSlidersIcon,
} from './shared/CustomIcon';
import { Tabs } from 'components/shared/Tabs';

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
    <div className="flex flex-col h-full p-4 pt-10">
      <div className="grow">
        <Link to={`/${orgSlug}`}>
          <div className="flex items-center space-x-3 mb-10 ml-2">
            <img
              src="/logo.svg"
              alt="Snowball Logo"
              className="h-8 w-8 rounded-lg"
            />
            <span className="text-2xl font-bold text-snowball-900">
              Snowball
            </span>
          </div>
        </Link>
        <AsyncSelect
          className="bg-white rounded-lg shadow"
          value={selectedOrgSlug}
          onChange={(value) => {
            setSelectedOrgSlug(value!);
            navigate(`/${value}`);
          }}
          selected={(_, index) => (
            <div className="flex items-center space-x-3">
              <img
                src="/logo.svg"
                alt="Application Logo"
                className="h-8 w-8 rounded-lg"
              />
              <div>
                <div className="text-sm font-semibold">
                  {organizations[index!]?.name}
                </div>
                <div className="text-xs text-gray-500">Organization</div>
              </div>
            </div>
          )}
          arrow={<ChevronGrabberHorizontal className="h-4 w-4 text-gray-500" />}
        >
          {/* TODO: Show label organization and manage in option */}
          {organizations.map((org) => (
            <Option key={org.id} value={org.slug}>
              <div className="flex items-center space-x-3">
                <img
                  src="/logo.svg"
                  alt="Application Logo"
                  className="h-8 w-8 rounded-lg"
                />
                <div>
                  <div className="text-sm font-semibold">{org.name}</div>
                  <div className="text-xs text-gray-500">Organization</div>
                </div>
              </div>
            </Option>
          ))}
        </AsyncSelect>
        <Tabs defaultValue="Projects" orientation="vertical" className="mt-10">
          <Tabs.List>
            {[
              { title: 'Projects', icon: <FolderIcon /> },
              { title: 'Settings', icon: <SettingsSlidersIcon /> },
            ].map(({ title, icon }, index) => (
              <NavLink to={`/${orgSlug}/${title}`} key={index}>
                <Tabs.Trigger icon={icon} value={title}>
                  {title}
                </Tabs.Trigger>
              </NavLink>
            ))}
          </Tabs.List>
        </Tabs>
      </div>
      <div className="grow flex flex-col justify-end mb-8">
        <Tabs defaultValue="Projects" orientation="vertical">
          {/* TODO: use proper link buttons */}
          <Tabs.List>
            <Tabs.Trigger icon={<GlobeIcon />} value="">
              <a className="cursor-pointer" onClick={handleLogOut}>
                Log Out
              </a>
            </Tabs.Trigger>
            <Tabs.Trigger icon={<QuestionMarkRoundIcon />} value="">
              <a className="cursor-pointer">Documentation</a>
            </Tabs.Trigger>
            <Tabs.Trigger icon={<LifeBuoyIcon />} value="">
              <a className="cursor-pointer">Support</a>
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs>
      </div>
    </div>
  );
};

export default Sidebar;
