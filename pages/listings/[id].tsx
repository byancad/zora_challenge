import { Box, Button, Container, Heading } from "@chakra-ui/react";
import ListForm from "components/Forms/ListForm";
import { useContractContext } from "contexts/contractContext";
import { useUserContext } from "contexts/userContext";
import { Contract, ethers } from "ethers";
import { useSkaleStubFactoryContract } from "hooks/useSkaleStubFactoryContract";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import address from "contracts/addresses";
import { skaleAddress } from "contracts/address.skale";
import { rinkebyFactoryAddress } from "contracts/addresses.rinkeby";
import harmonyAddress from "contracts/addresses.harmony";
import { useAlertContext } from "contexts/alertContext";
import StubListingAbi from "contracts/abis/StubListing";
import { ResellTable } from "components/Tables/ResellTable";
import { NavBar } from "components/NavBar";

const CONTRACT_NAME = "SkaleStubFactory";
const addressesByChain: { [id: number]: string } = {
  69: address[CONTRACT_NAME],
  3092851097537429: skaleAddress,
  4: rinkebyFactoryAddress,
  1666700000: harmonyAddress,
};

const Listings: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { state } = useContractContext();
  const { getStubAddress, buyListing } = useSkaleStubFactoryContract();
  const { address, signer, chainId } = useUserContext();
  const { awaitTx, removeTx, popToast } = useAlertContext();
  const [eventDetails, setEventDetails] = useState<any>({});
  const [listings, setListings] = useState<any[]>([]);
  const [listingContracts, setListingContracts] = useState<{
    [id: string]: Contract;
  }>({});

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

    const getListings = async (contract: any) => {
      const resales = await contract.getlistings();
      const filtered = resales.filter(
        (list: string) => list != "0x0000000000000000000000000000000000000000"
      );

      let newListings = filtered.map((address: string) => {
        return new ethers.Contract(address, StubListingAbi, signer);
      });

      let listData = [];
      let contractMap: { [id: string]: Contract } = {};
      for (const l of newListings) {
        const details: any = await l.details();
        const deets = {
          price: details._askPrice.toString(),
          tokenId: details._tokenId.toString(),
          address: details._tokenAddress,
        };
        listData.push(deets);
        contractMap[deets.tokenId] = l;
      }

      setListings([...listData]);
      setListingContracts({ ...contractMap });
    };

    if (contract) getDetails(contract);
    if (contract) getListings(contract);
  }, [contract]);

  const handleBuyListing = async (
    address: string,
    id: string,
    price: number
  ) => {
    console.log("buying listing");

    let creatorShare = eventDetails.creatorResellShare;
    creatorShare = parseInt(creatorShare);
    let creatorPayout = (100 * creatorShare) / price;
    await buyListing(address, parseInt(id), creatorPayout);
    removeFromListing(parseInt(id));
  };

  const removeFromListing = (tokenId: number) => {
    const oldListing = listings;
    const newListing = oldListing.filter((x: any) => x.tokenId != tokenId);

    setListings([...newListing]);
  };

  const addToListing = (listing: any) => {
    const oldListing = listings;
    const newListing = [...oldListing, listing];

    setListings([...newListing]);
  };

  const [showForm, setShowForm] = useState<boolean>(false);

  const handleCreateListing = async (
    price: number,
    id: number,
    contract: Contract | null
  ) => {
    if (contract) {
      const factoryAddress = addressesByChain[chainId || 69];
      let tx;
      try {
        tx = await contract.listToken(id, price, factoryAddress);
        awaitTx(tx);
        await tx.wait(1);
        removeTx(tx);
        popToast({
          title: "You've listed your ticket for sell. Good luck!",
          status: "success",
        });
        addToListing({
          price,
          tokenId: id,
          address: eventDetails.address,
        });
      } catch (e) {
        console.log(e);
        popToast({
          title: "Something went wrong!",
          status: "error",
        });

        removeTx(tx);
      }
    }
  };

  return (
    <div>
      <NavBar />

      <Container marginTop={50} padding={20} centerContent>
        <Box
          backgroundColor="#5662a6"
          opacity="90%"
          height="100%"
          borderRadius="4px"
          padding={9}
          fontWeight="semibold"
          letterSpacing="wide"
          fontSize="xs"
          textTransform="uppercase"
          boxShadow="dark-lg"
          ml="2"
        >
          <Heading>Resale Tickets</Heading>
          <Box textAlign={"right"}>
            <Button
              onClick={() => setShowForm(!showForm)}
              _focus={{ boxShadow: "none" }}
              bgGradient="linear(to-l, #7928CA, #FF0080)"
            >
              {" "}
              Sell ticket
            </Button>
          </Box>

          <Box>{eventDetails?.name}</Box>
          <Box>{eventDetails?.artist}</Box>
          <Box>{eventDetails?.date}</Box>
          <Box>{eventDetails?.location}</Box>

          {showForm && (
            <ListForm
              handleCreate={handleCreateListing}
              contract={contract}
              setShowForm={setShowForm}
            />
          )}
          <ResellTable tickets={listings} handleClick={handleBuyListing} />
        </Box>
      </Container>
    </div>
  );
};

export default Listings;
