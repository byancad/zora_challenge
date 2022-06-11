import { Contract } from "ethers";
import { useSignerOrProvider } from "./useSignerOrProvider";
import contractAbi from "contracts/abis/StubListing";

export const useSkaleListingContract = () => {
  const { signerOrProvider } = useSignerOrProvider();
  const getContract = (address: string) => {
    return new Contract(address, contractAbi, signerOrProvider);
  };

  const details = async (contractAddress: string) => {
    const contract = getContract(contractAddress);
    try {
      return await contract.details();
    } catch (e) {
      console.log(e);
    }
  };
  return { details };
};
