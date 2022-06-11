import "styles/globals.css";
import { Provider as UserProvider } from "contexts/userContext";
import { Provider as ContractProvider } from "contexts/contractContext";
import { AlertProvider } from "contexts/alertContext";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "styles/theme";
import { Provider } from "wagmi";
import { connectors } from "configs/wagmi";
import { UserSession } from "components/UserSession/UserSession";
import type { AppProps } from "next/app";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <UserProvider>
        <AlertProvider>
          <Provider connectors={connectors} autoConnect>
            <UserSession>
              <ContractProvider>
                <Component {...pageProps} />
              </ContractProvider>
            </UserSession>
          </Provider>
        </AlertProvider>
      </UserProvider>
    </ChakraProvider>
  );
};

export default MyApp;
