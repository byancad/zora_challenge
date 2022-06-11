import { Box, Button, Container } from "@chakra-ui/react";
import { useAlertContext } from "contexts/alertContext";
import { useContractContext } from "contexts/contractContext";
import { useUserContext } from "contexts/userContext";
import { Contract } from "ethers";
import { useSkaleStubFactoryContract } from "hooks/useSkaleStubFactoryContract";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import address from "contracts/addresses";
import { skaleAddress } from "contracts/address.skale";
import { rinkebyFactoryAddress } from "contracts/addresses.rinkeby";
import harmonyAddress from "contracts/addresses.harmony";
import { NavBar } from "components/NavBar";

const CONTRACT_NAME = "SkaleStubFactory";
const addressesByChain: { [id: number]: string } = {
  69: address[CONTRACT_NAME],
  3092851097537429: skaleAddress,
  4: rinkebyFactoryAddress,
  1666700000: harmonyAddress,
};

const Admit: NextPage = () => {
  const { address, signer, chainId } = useUserContext();
  const { state } = useContractContext();
  const [eventDetails, setEventDetails] = useState<any>({});
  const { getStubAddress } = useSkaleStubFactoryContract();
  const { awaitTx, removeTx, popToast } = useAlertContext();

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const updateAddy = async (id: number) => {
      await getStubAddress(id);
    };
    if (address && signer && id && typeof id === "string") {
      updateAddy(parseInt(id));
    }
  }, [id, address, signer]);

  const contract =
    id && typeof id === "string" ? state.idMap[parseInt(id)] : null;

  useEffect(() => {
    const getDetails = async (contract: any) => {
      const details = await contract.details();
      const deets = {
        address: details["eventAddress"],
        name: details["eventName"],
        artist: details["eventArtist"],
        date: details["eventDate"],
        location: details["eventLocation"],
        capacity: details["eventMaxMint"].toString(),
        creatorResellShare: details["eventCreatorResellShare"].toString(),
        usedCount: details["eventUsedCount"].toString(),
        mintedCount: details["eventMintedCount"].toString(),
      };

      setEventDetails({ ...deets });
    };

    if (contract) getDetails(contract);
  }, [contract]);

  const handleAdmit = async (e: any) => {
    e.preventDefault();
    const admitting = async (contract: Contract) => {
      let tx;
      try {
        tx = await contract.admitOne(0);
        awaitTx(tx);
        await tx.wait(1);
        removeTx(tx);
        popToast({ title: "Your in! Enjoy the show", status: "success" });
      } catch (e) {
        console.log(e);
        popToast({
          title: "Something went wrong!",
          description:
            "Make sure you are the owner and this ticket has not been used",
          status: "error",
        });

        removeTx(tx);
      }
    };

    if (id && typeof id === "string") {
      const contract = state.idMap[parseInt(id)];
      admitting(contract);
    }
  };

  const handleCreateListing = async (e: any) => {
    e.preventDefault();
    const createListing = async (contract: Contract) => {
      const tokenId = 0;
      const askPrice = 100;
      const factoryAddress = addressesByChain[chainId || 69];
      let tx;
      try {
        tx = await contract.listToken(tokenId, askPrice, factoryAddress);
        awaitTx(tx);
        await tx.wait(1);
        removeTx(tx);
        popToast({
          title: "You've listed your ticket for sell. Good luck!",
          status: "success",
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

    if (id && typeof id === "string") {
      const contract = state.idMap[parseInt(id)];
      createListing(contract);
    }
  };

  return (
    <div>
      <NavBar />
      <Container centerContent>
        <div style={{ fontSize: "40px", marginTop: "20px" }}>Event Info</div>
        <Box
          backgroundColor="#5662a6"
          opacity="90%"
          borderRadius="4px"
          padding={9}
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
          boxShadow="dark-lg"
          width="100%"
          ml="2"
        >
          <div style={{ fontSize: "60px" }}>{eventDetails?.artist}</div>

          <div style={{ fontSize: "40px" }}>{eventDetails?.name}</div>

          <div style={{ fontSize: "40px" }}>{eventDetails?.location}</div>
          <br />
          <div style={{ fontSize: "30px" }}>{eventDetails?.date}</div>

          <div style={{ fontSize: "20px" }}>
            Arrived: {eventDetails?.usedCount || 0} / {eventDetails?.capacity}{" "}
          </div>
          <Button
            onClick={handleAdmit}
            mt={8}
            width="100%"
            size="lg"
            height="70px"
            _focus={{ boxShadow: "none" }}
            bgGradient="linear(to-l, #7928CA, #FF0080)"
          >
            ADMIT
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Admit;
