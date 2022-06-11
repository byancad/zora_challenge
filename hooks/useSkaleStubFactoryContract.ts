import { useAlertContext } from "contexts/alertContext";
import { useSignerOrProvider } from "./useSignerOrProvider";
import address from "contracts/addresses";
import contractAbi from "contracts/abis/SkaleStubFactory";
import stubAbi from "contracts/abis/SkaleStub";
import { useWagmi } from "./useWagmi";
import { rinkebyFactoryAddress } from "contracts/addresses.rinkeby";
import harmonyAddress from "contracts/addresses.harmony";
import { skaleAddress } from "contracts/address.skale";
import { DropInputProps } from "components/Forms/DropForm";
import { Contract } from "ethers";
import { useContractContext } from "contexts/contractContext";
import router from "next/router";
import { useUserContext } from "contexts/userContext";
import { isValidAddress } from "utils";
const CONTRACT_NAME = "SkaleStubFactory";
// skale 3092851097537429
// rink 4
// harmony 1666700000
const addressesByChain: { [id: number]: string } = {
  69: address[CONTRACT_NAME],
  3092851097537429: skaleAddress,
  4: rinkebyFactoryAddress,
  1666700000: harmonyAddress,
};

export const useSkaleStubFactoryContract = () => {
  const { signerOrProvider } = useSignerOrProvider();
  const { chainId } = useUserContext();
  const { addContractById, addEvent } = useContractContext();
  const { awaitTx, removeTx, popToast } = useAlertContext();

  const getContract = (address: string) => {
    return new Contract(address, contractAbi, signerOrProvider);
  };

  const createStub = async (params: DropInputProps) => {
    const contract = getContract(addressesByChain[chainId || 69]);
    const { event, artist, date, location, qty, creatorResellShare, price } =
      params;
    let tx;
    try {
      tx = await contract.createStub(
        event,
        artist,
        date,
        location,
        qty,
        creatorResellShare,
        price
      );
      awaitTx(tx);
      await tx.wait(1);
      removeTx(tx);
      popToast({ title: "Drop successful!", status: "success" });
      router.push({
        pathname: "/home",
      });
    } catch (e) {
      removeTx(tx);
      console.error(e);
    }
  };

  const addList = async (props: {
    price: number;
    address: string;
    id: number;
  }) => {
    const { price, address, id } = props;
    const stringId = address.toString() + "-" + id.toString();

    console.log(stringId);
  };

  const stubCount = async () => {
    const contract = getContract(addressesByChain[chainId || 69]);
    try {
      const res = await contract.stubCount();

      return res;
    } catch (e) {
      console.log(e);
    }
  };

  const getRandom = async () => {
    const contract = getContract(addressesByChain[chainId || 69]);
    try {
      const res = await contract.getRandom();
      return res;
    } catch (e) {
      console.error(e);
    }
  };

  const getStubAddress = async (id: number) => {
    const contract = getContract(addressesByChain[chainId || 69]);
    try {
      const eventAddress = await contract.getStubAddress(id);
      const stub = new Contract(eventAddress, stubAbi, signerOrProvider);

      if (isValidAddress(eventAddress) && stub) {
        addEvent(id, eventAddress);
        addContractById(id, stub);
      } else {
        popToast({ title: "No tickets by that ID :( ", status: "error" });
      }

      return eventAddress;
    } catch (e) {
      console.error(e);
    }
  };

  const buyListing = async (
    address: string,
    id: number,
    creatorPayout: number
  ) => {
    const contract = getContract(addressesByChain[chainId || 69]);
    let tx;
    try {
      tx = await contract.removeListing(address, id);
      awaitTx(tx);
      await tx.wait(1);
      removeTx(tx);
      popToast({
        title: `You're in ! Thanks for buying. This artist earned $ ${creatorPayout}  from this purchase`,
        status: "success",
        duration: 10000,
      });
    } catch (e) {
      console.log(e);
      popToast({
        title: "Something went wrong!",
        status: "error",
      });

      removeTx(tx);
    }
  };

  return {
    getRandom,
    getStubAddress,
    createStub,
    stubCount,
    addList,
    buyListing,
  };
};
