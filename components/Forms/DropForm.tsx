import {
  Heading,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { useSkaleStubFactoryContract } from "hooks/useSkaleStubFactoryContract";
import type { NextPage } from "next";
import { useState } from "react";

export type DropInputProps = {
  event: string;
  artist: string;
  date: string;
  location: string;
  amount: number;
  qty: number;
  price: 0;
  creatorResellShare: number;
};

const DropForm: NextPage = () => {
  const { createStub } = useSkaleStubFactoryContract();

  const [formInput, setFormInput] = useState<DropInputProps>({
    event: "",
    artist: "",
    date: "",
    location: "",
    amount: 0,
    price: 0,
    qty: 0,
    creatorResellShare: 0,
  });

  const handleChange = async (e: any): Promise<void> => {
    let value = e.target.value;
    if (
      e.target.name === "qty" ||
      e.target.name === "creatorResellShare" ||
      e.target.name === "amount" ||
      e.target.name === "price"
    ) {
      value = parseInt(value);
    }
    setFormInput({
      ...formInput,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    createStub(formInput);
  };

  return (
    <>
      <Heading alignContent="center">Drop Tickets</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor="event-name">Name of Event</FormLabel>
          <Input onChange={handleChange} type="text" name="event" />
          <FormLabel htmlFor="artist-name">Artist</FormLabel>
          <Input onChange={handleChange} type="text" name="artist" />
          <FormLabel htmlFor="date">Date</FormLabel>
          <Input
            onChange={handleChange}
            type="text"
            name="date"
            placeholder="Date"
          />
          <FormLabel htmlFor="location">Location</FormLabel>
          <Input onChange={handleChange} type="text" name="location" />

          <FormLabel htmlFor="qty">Quantity</FormLabel>
          <NumberInput>
            <NumberInputField type="text" onChange={handleChange} name="qty" />
          </NumberInput>
          <FormLabel htmlFor="price">Price</FormLabel>
          <NumberInput>
            <NumberInputField
              type="text"
              onChange={handleChange}
              name="price"
            />
          </NumberInput>
          <FormLabel htmlFor="creatorResellShare">
            Creator Resell Share
          </FormLabel>
          <NumberInput>
            <NumberInputField
              type="text"
              placeholder="%"
              onChange={handleChange}
              name="creatorResellShare"
            />
          </NumberInput>
        </FormControl>
        <Button width="100%" mt={4} h={16} type="submit" bgGradient='linear(to-l, #7928CA, #FF0080)' >
          Create Event
        </Button>
      </form>
    </>
  );
};

export default DropForm;
