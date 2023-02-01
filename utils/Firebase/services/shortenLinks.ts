import { DocumentReference, where } from "firebase/firestore";
import { decryptAES, encryptAES } from "../../func/cipher";
import { date2FsTimestamp, firstDataTransformedItem } from "../../func/mapping";
import { randomPassCode, randomShortenLinkId } from "../../func/random";
import { tShortLinkD2O } from "../../types/dto";
import { tDataTransformed, tFirestoreQueryItemData, tShortenLink } from "../../types/model";
import { fsAdd, fsReadWithCond, fsRemoveByRef } from "../firestore";

const ROOT_COLLECTION_KEY = "shorten_links";

export const getLinkById = async (shortId: string, passCode?: string): Promise<tFirestoreQueryItemData<tDataTransformed<tShortenLink>>> => {
  try {
    // Find with shortId with `availableUntil` is NULL
    const shortenLinkWithNullAvailable = await fsReadWithCond<tShortenLink>(
      [
        where('shortId', '==', shortId),
        where('availableUntil', '==', null),
      ],
      ROOT_COLLECTION_KEY,
    );
    const shortenLinkWithAvailableUntil = await fsReadWithCond<tShortenLink>(
      [ where('shortId', '==', shortId), where('availableUntil', '>=', date2FsTimestamp()) ],
      ROOT_COLLECTION_KEY,
    );
    const shortenLinkTransformed =
      firstDataTransformedItem<tShortenLink>(shortenLinkWithNullAvailable) ||
      firstDataTransformedItem<tShortenLink>(shortenLinkWithAvailableUntil);

    if (!shortenLinkTransformed) {
      return {
        isError: true,
        errorMessageId: 'exception.shortenLink.getById.unknown',
      };
    }

    const { data } = shortenLinkTransformed;

    if (data.passCode && !passCode) {
      return {
        isError: true,
        errorMessageId: 'exception.shortenLink.invalid-input',
      };
    }

    if (passCode && data.passCode) {
      const linkNeedOpen = decryptAES(data.longLink, [passCode, data.passCode]);
      if (linkNeedOpen.isError) {
        return {
          isError: true,
          errorMessageId: linkNeedOpen.error,
        };
      }
      if (!linkNeedOpen.data) {
        return {
          isError: true,
          errorMessageId: 'exception.shortenLink.invalid-input',
        };
      }
      shortenLinkTransformed.data.longLink = linkNeedOpen.data.link as string;
    }

    return { data: shortenLinkTransformed };
  } catch (err: any) {
    console.error(`Error when getting link by ID (${shortId}):`, err);
    return {
      isError: true,
      errorMessageId: 'exception.shortenLink.getById.unknown',
    };
  }
}

export const createLink = async ({ longLink, passCode, expiredTime }: tShortLinkD2O): Promise<tFirestoreQueryItemData<tDataTransformed<tShortenLink>>> => {
  try {
    const shortLinkData: tShortenLink = {
      shortId: randomShortenLinkId(),
      longLink,
      passCode: null,
      availableUntil: expiredTime ? date2FsTimestamp(expiredTime) : null,
    }
    if (passCode) {
      const randomCipher = randomPassCode();
      const longLinkEncrypted = encryptAES({ link: longLink }, [passCode, randomCipher]);
      shortLinkData.passCode = randomCipher;
      shortLinkData.longLink = longLinkEncrypted;
    }
    const res = await fsAdd<tShortenLink>(shortLinkData, ROOT_COLLECTION_KEY);
    if (!res) {
      return {
        isError: true,
        errorMessageId: 'exception.shortenLink.create.unknown',
      };
    }
    return {
      data: res,
    };
  } catch (err: any) {
    console.error('Error when creating a shorten link:', [longLink, passCode, expiredTime], err);
    return {
      isError: true,
      errorMessageId: 'exception.shortenLink.create.unknown',
    };
  }
}

export const removeLink = async (linkRef: DocumentReference): Promise<boolean> => {
  try {
    await fsRemoveByRef(linkRef);
    return true;
  } catch (err: any) {
    console.error('Error when removing a shorten link:', linkRef, err);
    return false;
  }
}