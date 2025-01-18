export const saveTabsToLocalStorage = (tabs) => {
    localStorage.setItem('openTabs', JSON.stringify(tabs));
  };
  
  export const getTabsFromLocalStorage = () => {
    const storedTabs = localStorage.getItem('openTabs');
    return storedTabs ? JSON.parse(storedTabs) : [];
  };
  