import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '../../Components/Tabs';

const SocietyTabs = ({ society, activeTab, onTabChange, isMember }) => {
  const { memberCount, resourceCount, isPublic } = society;

  const tabs = [
    { id: 'about', label: 'About' },
  ];

  // Hide member count if private and current user is not a member
  const hideMemberCount = !isPublic && !isMember;

  tabs.push({ 
    id: 'members', 
    label: 'Members', 
    count: hideMemberCount ? undefined : memberCount 
  });
  
  tabs.push({ 
    id: 'resources', 
    label: 'Resources', 
    count: resourceCount 
  });

  return (
    <div className="mb-8 text-primary">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
    </div>
  );
};

SocietyTabs.propTypes = {
  society: PropTypes.object.isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  isMember: PropTypes.bool.isRequired,
};

export default SocietyTabs;
