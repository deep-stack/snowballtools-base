import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { Organization } from 'gql-client';

import { Option } from '@material-tailwind/react';
import { useDisconnect } from 'wagmi';

import { useGQLClient } from 'context/GQLClientContext';
import AsyncSelect from 'components/shared/AsyncSelect';
import {
  ChevronGrabberHorizontal,
  FolderIcon,
  GlobeIcon,
  LifeBuoyIcon,
  QuestionMarkRoundIcon,
  SettingsSlidersIcon,
} from 'components/shared/CustomIcon';
import { Tabs } from 'components/shared/Tabs';
import { Heading } from 'components/shared/Heading';

export const Sidebar = () => {
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
    <nav className="flex flex-col h-full px-6 py-8 gap-9">
      {/* Logo */}
      <Link to={`/${orgSlug}`}>
        <div className="flex items-center gap-3 px-2">
          <img
            src="/logo.svg"
            alt="Snowball Logo"
            className="h-10 w-10 rounded-lg"
          />
          <Heading className="text-[24px] font-semibold">Snowball</Heading>
        </div>
      </Link>
      {/* Switch organization */}
      <div className="flex flex-1 flex-col gap-4">
        <AsyncSelect
          containerProps={{ className: 'h-14 border-none' }}
          labelProps={{ className: 'before:border-none after:border-none' }}
          className="bg-white rounded-lg shadow border-none"
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
          {/* // TODO: Show label organization and manage in option */}
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
        <Tabs defaultValue="Projects" orientation="vertical">
          <Tabs.List>
            {[
              { title: 'Projects', url: `/${orgSlug}/`, icon: <FolderIcon /> },
              {
                title: 'Settings',
                url: `/${orgSlug}/settings`,
                icon: <SettingsSlidersIcon />,
              },
            ].map(({ title, icon, url }, index) => (
              <NavLink to={url} key={index}>
                <Tabs.Trigger icon={icon} value={title}>
                  {title}
                </Tabs.Trigger>
              </NavLink>
            ))}
          </Tabs.List>
        </Tabs>
      </div>
      {/* Bottom navigation */}
      <div className="flex flex-col justify-end">
        <Tabs defaultValue="Projects" orientation="vertical">
          {/* // TODO: use proper link buttons */}
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
    </nav>
  );
};
