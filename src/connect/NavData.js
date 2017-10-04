let currentScreen;
let prevScreen;
let currentTab;
let prevTab;
let isLoggedIn;

const navigators = {};

const NavData = {
  getCurrentTab: () => currentTab,
  getCurrentScreen: () => currentScreen,
  getPrevTab: () => prevTab,
  getPrevScreen: () => prevScreen,
  setCurrentScreen: (screen) => {
    if (!isLoggedIn) {
      if (screen === 'ContactsScene') {
        currentScreen = screen;
        currentTab = screen;
        isLoggedIn = true;
        return;
      }
      return;
    }
    prevScreen = currentScreen;
    currentScreen = screen;
    currentTab = screen;
  },
  setCurrentTab: (tab) => {
    if (!isLoggedIn) {
      return;
    }
    prevTab = currentTab;
    currentTab = tab;
  },
  setLogout: () => {
    isLoggedIn = false;
  },
  setNavigator: (rootScreen, navObj) => {
    navigators[rootScreen] = navObj;
  },
  getNavigator: (rootScreen) => navigators[rootScreen]
};

Object.freeze(NavData);
export default NavData;
