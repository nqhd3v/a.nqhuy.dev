import { customAlphabet, nanoid } from "nanoid";

export const az09 = 'qwertyuiopasdfghjklzxcvbnm0123456789';
export const AZ09 = 'QWERTYUIOPASDFGHJKLZXCVBNM0123456789';

export const randomPassCode = (): string => {
  return customAlphabet(AZ09)(5);
}

export const randomStr = (length: number = 5) => customAlphabet(az09)(length);

export const randomShortenLinkId = () => {
  return customAlphabet(az09)(6);
}

export const genKey = (): string => {
  return nanoid(10);
}