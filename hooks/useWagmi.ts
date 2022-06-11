import { useUserContext } from "contexts/userContext";
import { useEffect } from "react";
import { useNetwork, useSigner } from "wagmi";

export const useWagmi = () => {
  const { updateSigner, updateSignerAddress, updateChainId } = useUserContext();
  const [{ data: signer }] = useSigner();
  const [{ data: network }] = useNetwork();
  const chainId = network?.chain?.id;

  useEffect(() => {
    const getSignerAddress = async () => {
      const address = await signer?.getAddress();
      if (address) updateSignerAddress(address);
    };

    updateSigner(signer);
    getSignerAddress();
  }, [signer]);

  useEffect(() => {
    if (chainId) {
      updateChainId(chainId);
    }
  }, [chainId]);
};
