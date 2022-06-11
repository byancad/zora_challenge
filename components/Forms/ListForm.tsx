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
import { Contract } from "ethers";
import { useSkaleStubFactoryContract } from "hooks/useSkaleStubFactoryContract";
import type { NextPage } from "next";
import { Dispatch, SetStateAction, useState } from "react";

export type FormInputProps = {
  price: number;
  id: number;
};

type DropFormProps = {
  handleCreate: any;
  contract: Contract | null;
  setShowForm: Dispatch<SetStateAction<boolean>>;
};

const DropForm = ({ handleCreate, contract, setShowForm }: DropFormProps) => {
  const { addList } = useSkaleStubFactoryContract();
  const [formInput, setFormInput] = useState<FormInputProps>({
    price: 0,
    id: 0,
  });

  const handleChange = async (e: any): Promise<void> => {
    let value = e.target.value;
    value = parseInt(value);
    setFormInput({
      ...formInput,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e: any): Promise<void> => {
    e.preventDefault();
    console.log("submitting", formInput);
    const { price, id } = formInput;

    await handleCreate(price, id, contract);
    setShowForm(false);
  };

  return (
    <>
      {/* <Heading alignContent="center">List Tickets</Heading> */}
      <form onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel htmlFor="event">ID</FormLabel>
          <Input onChange={handleChange} type="text" name="id" />

          <FormLabel htmlFor="amount">Price</FormLabel>
          <NumberInput>
            <NumberInputField
              type="text"
              placeholder="$"
              onChange={handleChange}
              name="price"
            />
          </NumberInput>
        </FormControl>
        <Button width="100%" mt={4} h={16} type="submit"      _focus={{ boxShadow: "none" }}
              bgGradient="linear(to-l, #7928CA, #FF0080)">
          List Ticket
        </Button>
      </form>
    </>
  );
};

export default DropForm;
