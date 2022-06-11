import { getDefaultProvider, Signer } from "ethers";
import { Provider } from "@ethersproject/providers";
import { useUserContext } from "contexts/userContext";

type SignerOfProviderProps = {
  signerOrProvider: Signer | Provider | undefined;
};
export const useSignerOrProvider = (): SignerOfProviderProps => {
  const { signer } = useUserContext();

  const provider = getDefaultProvider("rinkeby", {
    infura: {
      projectId: process.env.INFURA_PROJECT_ID,
      projectSecret: process.env.INFURA_PROJECT_SECRET,
    },
  });

  const signerOrProvider = signer ? signer : (provider as Provider);

  return { signerOrProvider };
};
