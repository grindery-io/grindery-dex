import { WidgetProps } from './types/widget';
import { forwardRef, useMemo } from 'react';
import { AppDrawer, WidgetDrawer } from './AppDrawer';
import { AppProvider } from './AppProvider';
import { useExpandableVariant } from './hooks';
import {
  AppContainer,
  AppExpandedContainer,
  FlexContainer,
} from './components/AppContainer';
import { Header } from './components/Header';
import { PoweredBy } from './components/PoweredBy';
import { Initializer } from './components/Initializer';
import { SwapRoutesExpanded } from './components/SwapRoutes';
import { AppRoutes } from './AppRoutes';

export const LiFiWidget: React.FC<WidgetProps> = forwardRef<
  WidgetDrawer,
  WidgetProps
>(({ elementRef, open, ...other }, ref) => {
  const config = useMemo(() => ({ ...other, ...other.config }), [other]);
  return config?.variant !== 'drawer' ? (
    <AppProvider config={config}>
      <AppDefault />
    </AppProvider>
  ) : (
    <AppDrawer ref={ref} elementRef={elementRef} config={config} open={open} />
  );
});

export const AppDefault = () => {
  const expandable = useExpandableVariant();

  return (
    <AppExpandedContainer>
      <AppContainer>
        <Header />
        <FlexContainer disableGutters>
          <AppRoutes />
        </FlexContainer>
        <PoweredBy />
        <Initializer />
      </AppContainer>
      {expandable ? <SwapRoutesExpanded /> : null}
    </AppExpandedContainer>
  );
};
