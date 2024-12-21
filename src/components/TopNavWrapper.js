import React from 'react';
import TopNav from './TopNav';
import { useFetchTeams } from '../hooks/useFetchTeams';

const TopNavWrapper = () => {
  const { teams, fetchTeams } = useFetchTeams();

  return <TopNav teams={teams} fetchTeams={fetchTeams} />;
};

export default TopNavWrapper;
