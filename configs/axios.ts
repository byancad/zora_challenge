import axios, { AxiosInstance } from "axios";

const axiosClients: {
  server: AxiosInstance;
  pinata: AxiosInstance;
} = {
  server: {} as AxiosInstance,
  pinata: {} as AxiosInstance
};

const createServerInstance = () => {
  const serverBaseURL = process.env.API_BASE_URL;
  const serverInstance = axios.create({ baseURL: serverBaseURL });
  axiosClients.server = serverInstance;
};

const createPinataInstance = () => {
  const pinataURL = process.env.PINATA_BASE_URL;
  const pinataInstance = axios.create({ baseURL: pinataURL });
  axiosClients.pinata = pinataInstance;
};

const createAxiosInstances = () => {
  createServerInstance();
  createPinataInstance();
};

createAxiosInstances();

export const serverRequest = axiosClients.server;

export const pinataRequest = axiosClients.pinata;
