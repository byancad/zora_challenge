import { useAlertContext } from "contexts/alertContext";
import { Contract } from "ethers";
import { useSignerOrProvider } from "./useSignerOrProvider";
import contractAbi from "contracts/abis/SkaleStub";

export const useSkaleStubContract = () => {
  const { signerOrProvider } = useSignerOrProvider();
  const { awaitTx, removeTx, popToast } = useAlertContext();

  const getContract = (address: string) => {
    return new Contract(address, contractAbi, signerOrProvider);
  };

  const mint = async (
    contractAddress: string,
    minterAddress: string,
    tokenURI: string
  ) => {
    const contract = getContract(contractAddress);
    let tx;
    try {
      tx = await contract.mint(minterAddress, tokenURI);
      awaitTx(tx);
      await tx.wait(1);
      removeTx(tx);
      popToast({ title: "Drop successful!", status: "success" });
    } catch (e) {
      removeTx(tx);
      console.error(e);
    }
  };

  const details = async (contractAddress: string) => {
    const contract = getContract(contractAddress);
    try {
      const details = await contract.details();
      return {
        address: contractAddress,
        name: details["eventName"],
        artist: details["eventArtist"],
        date: details["eventDate"],
        location: details["eventLocation"],
        capacity: details["eventMaxMint"].toString(),
        creatorResellShare: details["eventCreatorResellShare"].toString(),
        usedCount: details["eventUsedCount"].toString(),
        mintedCount: details["eventMintedCount"].toString(),
        price: details["eventAmount"].toString(),
      };
    } catch (e) {
      console.error(e);
    }
  };
  return { mint, details };
};
