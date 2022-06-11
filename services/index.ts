import { AxiosRequestConfig } from "axios";
import { pinataRequest, serverRequest } from "configs/axios";

export const serverGetRequest = async (url: string) => {
  const res = await serverRequest.get(url);
  return res.data;
};

export const serverPostRequest = async (url: string, body: any) => {
  const headers = {
    "Content-Type": "application/json"
  };
  const res = await serverRequest.post(url, body, { headers });
  return res.data;
};

export const pinataGetRequest = async (
  url: string,
  options: AxiosRequestConfig<any> = {
    headers: {
      pinata_api_key: process.env.PINATA_API_KEY || "",
      pinata_secret_api_key: process.env.PINATA_SECRET_KEY || ""
    }
  }
) => {
  const res = await pinataRequest.get(url, options);
  return res.data;
};
