import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { MantineProvider } from '@mantine/core';

import { api } from "~/utils/api";

// Mantine css
import '@mantine/core/styles.css';

// Global css
import "~/styles/globals.css";

// reduxStore provider
import { Providers } from "~/lib/providers";
import { theme } from "~/styles/theme";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <Providers>
      <SessionProvider session={session}>
        <MantineProvider theme={theme} forceColorScheme="light">
          {/* <Component {...pageProps} /> */}
        </MantineProvider>
      </SessionProvider>
    </Providers>
  );
};

export default api.withTRPC(MyApp);
