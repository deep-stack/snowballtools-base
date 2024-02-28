import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { Organization } from 'gql-client';

import { useDisconnect } from 'wagmi';

import { useGQLClient } from 'context/GQLClientContext';
import {
  FolderIcon,
  GlobeIcon,
  LifeBuoyIcon,
  QuestionMarkRoundIcon,
  SettingsSlidersIcon,
} from 'components/shared/CustomIcon';
import { Tabs } from 'components/shared/Tabs';
import { Heading } from 'components/shared/Heading';
import { UserSelect } from 'components/shared/UserSelect';

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

  const formattedSelected = useMemo(() => {
    const selected = organizations.find((org) => org.slug === selectedOrgSlug);
    return {
      value: selected?.slug ?? '',
      label: selected?.name ?? '',
      imgSrc: '/logo.svg',
    };
  }, [organizations, selectedOrgSlug, orgSlug]);
  const formattedSelectOptions = useMemo(() => {
    return organizations.map((org) => ({
      value: org.slug,
      label: org.name,
      imgSrc: '/logo.svg',
    }));
  }, [organizations, selectedOrgSlug, orgSlug]);

  const handleLogOut = useCallback(() => {
    disconnect();
    navigate('/login');
  }, [disconnect, navigate]);

  return (
    <div className="flex flex-col h-full px-6 py-8 gap-9">
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
        <UserSelect
          value={formattedSelected}
          options={formattedSelectOptions}
        />
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
    </div>
  );
};
