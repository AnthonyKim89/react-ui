import AppGridLayout from './components/AppGridLayout';
import AppSingleLayout from './components/AppSingleLayout';
import AppTabLayout from './components/AppTabLayout';

export default {
  layouts: {
    grid: {
      layout: AppGridLayout,
      controlApps: true,
    },
    singleApp: {
      layout: AppSingleLayout,
      controlApps: true,
    },
    tabs: {
      layout: AppTabLayout,
      controlApps: false,
    },
  }
};
