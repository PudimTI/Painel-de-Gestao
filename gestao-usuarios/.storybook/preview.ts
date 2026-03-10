import React from 'react';
import type { Preview } from '@storybook/react-vite';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '../src/theme/theme';

const withMuiTheme = (Story, context) => {
  const theme = context.globals.theme === 'dark' ? darkTheme : lightTheme;

  return React.createElement(
    ThemeProvider,
    { theme },
    React.createElement(
      React.Fragment,
      null,
      React.createElement(CssBaseline, null),
      React.createElement(Story, context),
    ),
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      name: 'Tema',
      description: 'Seleção de tema claro/escuro',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Escuro' },
        ],
      },
    },
  },
  decorators: [withMuiTheme],
};

export default preview;
