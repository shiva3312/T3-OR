import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { MantineProvider, createTheme } from '@mantine/core';

import { api } from "~/utils/api";

// Mantine css
import '@mantine/core/styles.css';

// Global css
import "~/styles/globals.css";

// reduxStore provider
import { Providers } from "~/lib/providers";

// Your theme configuration is merged with default theme
const theme = createTheme({
  fontFamily: 'Montserrat, sans-serif',
  defaultRadius: 'md',
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <Providers>
      <SessionProvider session={session}>
        <MantineProvider
          theme={theme}>
          <Component {...pageProps} />
        </MantineProvider>
      </SessionProvider>
    </Providers>
  );
};

export default api.withTRPC(MyApp);
