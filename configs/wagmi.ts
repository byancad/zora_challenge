import { InjectedConnector, chain, defaultChains, Chain } from "wagmi";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";

const infuraId = "025df59fe64f491f93a36a20d1560dd5";

// Chains for connectors to support
// const skaleChain: Chain = {
//   id: "0xafcee83030b95",
//   name: "attractive-muscida",
//   rpcUrls: ["https://portland.skalenodes.com/v1/attractive-muscida"],
// };
const chains = defaultChains;
// chains.push(skaleChain);

// console.log({ defaultChains });

// Set up connectors
export const connectors = ({ chainId }: any) => {
  const rpcUrl =
    chains.find(x => x.id === chainId)?.rpcUrls?.[0] ??
    chain.mainnet.rpcUrls[0];
  return [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      options: {
        infuraId,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: "My wagmi app",
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ];
};
