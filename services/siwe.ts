import { serverGetRequest, serverPostRequest } from "services";

export const reqUserSession = async () => {
  return await serverGetRequest("me");
};

export const reqLogout = async () => {
  return await serverGetRequest("logout");
};

export const reqNonce = async () => {
  return await serverGetRequest("nonce");
};

export const reqLogin = async (body: any) => {
  return await serverPostRequest("verify", body);
};
