import { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import {getTabsFromLocalStorage, saveTabsToLocalStorage} from '../utils/tabUtils'

const TabManager = () => {
  const [openTabs, setOpenTabs] = useState(getTabsFromLocalStorage());
  const navigate = useNavigate();

  const handleTabChange = (key) => {
    navigate(key);
  };

  const handleTabClose = (key) => {
    const filteredTabs = openTabs.filter(tab => tab.key !== key);
    setOpenTabs(filteredTabs);
    saveTabsToLocalStorage(filteredTabs);

    // Navigate to the first remaining tab or home
    if (filteredTabs.length > 0) {
      navigate(filteredTabs[0].key);
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    saveTabsToLocalStorage(openTabs);
  }, [openTabs]);

  return (
    <Tabs
      activeKey={window.location.pathname}
      onChange={handleTabChange}
      type="editable-card"
      onEdit={(key, action) => action === 'remove' && handleTabClose(key)}
    >
      {openTabs.map(tab => (
        <Tabs.TabPane tab={tab.title} key={tab.key} />
      ))}
    </Tabs>
  );
};

export default TabManager;