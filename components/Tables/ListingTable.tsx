import { Button, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useAlertContext } from "contexts/alertContext";
import { useUserContext } from "contexts/userContext";
import { Contract } from "ethers";
import { useEffect, useState } from "react";

type TicketTableProps = {
  tickets: { [address: string]: Contract };
  onOpen: () => void;
  setCurrentEvent: (event: any) => void;
};

export const ListingTable = ({
  tickets,
  onOpen,
  setCurrentEvent
}: TicketTableProps) => {
  const [stubs, setStubs] = useState<any[]>([]);
  const { address: userAddress } = useUserContext();
  const { awaitTx, removeTx } = useAlertContext();

  const addresses = Object.keys(tickets);

  useEffect(() => {
    const updateTicketDetails = async () => {
      let newTickets = [];
      for (const address of addresses) {
        const details = await tickets[address].details();
        const deets = {
          address,
          name: details["eventName"],
          artist: details["eventArtist"],
          date: details["eventDate"],
          location: details["eventLocation"],
          capacity: details["eventMaxMint"].toString(),
          creatorResellShare: details["eventCreatorResellShare"].toString(),
          usedCount: details["eventUsedCount"].toString(),
          mintedCount: details["eventMintedCount"].toString()
        };
        newTickets.push(deets);
      }

      setStubs([...newTickets]);
    };

    updateTicketDetails();
  }, [tickets]);

  const handleBuy = async (stub: any): Promise<void> => {
    setCurrentEvent(stub);
    const { address } = stub;
    const contract = tickets[address];
    let tx;
    try {
      tx = await contract.mint(userAddress, "adfasdfsdf");
      awaitTx(tx);
      await tx.wait(1);
      removeTx(tx);
      onOpen();
    } catch (e) {
      removeTx(tx);
      console.log(e);
    }
  };

  return (
    <Table variant="simple" marginTop={18} alignItems="center">
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Artist</Th>
          <Th>Location</Th>
          <Th>Available</Th>
          <Th>Purchase</Th>
        </Tr>
      </Thead>
      <Tbody>
        {stubs.map((stub: any, id: number) => {
          return (
            <Tr key={id}>
              <Td>{stub.date}</Td>
              <Td>{stub.artist}</Td>
              <Td>{stub.location}</Td>
              <Td>{stub.capacity}</Td>
              <Td>
                <Button
                  onClick={() => handleBuy(stub)}
                  _focus={{ boxShadow: "none" }}
                >
                  Buy One
                </Button>
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};
