import { DocumentReference, getDoc, setDoc, where } from "firebase/firestore";
import { decryptAES, encryptAES } from "../../func/cipher";
import { errorQuery, firstDataTransformedItem } from "../../func/mapping";
import { randomPassCode, randomShortenLinkId } from "../../func/random";
import { DocumentId, tDataTransformed, tFirestoreQueryItemData, tFirestoreQueryItemTransformedData, tShortenLink } from "../../types/model";
import { date2FsTimestamp, fsAdd, fsRead, fsReadWithCond, fsRemoveByRef } from "../firestore";

const ROOT_COLLECTION_KEY = "shorten_links";


const error = errorQuery<tDataTransformed<tShortenLink>>('shortenLink');
export const getLinkById = async (shortId: string, passCode?: string): Promise<tFirestoreQueryItemData<tDataTransformed<tShortenLink>>> => {
  try {
    // Find with shortId with `availableUntil` is NULL
    const shortenLinkWithNullAvailable = await fsReadWithCond<tShortenLink>(
      [ where('shortId', '==', shortId), where('availableUntil', '==', null) ],
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
      return error();
    }

    const { data } = shortenLinkTransformed;

    if (data.passCode && !passCode) {
      return error('require-passCode');
    }

    if (passCode && data.passCode) {
      const linkNeedOpen = decryptAES(data.longLink, [passCode, data.passCode]);
      if (linkNeedOpen.isError) {
        return {
          isError: true,
          errorMessageId: linkNeedOpen.error,
        };
      }
      shortenLinkTransformed.data.longLink = linkNeedOpen.data as string;
    }

    return { data: shortenLinkTransformed };
  } catch (err: any) {
    console.error(`Error when getting link by ID (${shortId}):`, err);
    return {
      isError: true,
      errorMessageId: 'sample.unknown-error',
    };
  }
}

export const createLink = async (link: string, passCode?: string, expiredAt?: Date): Promise<tFirestoreQueryItemData<tDataTransformed<tShortenLink>>> => {
  try {
    const shortLinkData: tShortenLink = {
      shortId: randomShortenLinkId(),
      longLink: link,
      passCode: null,
      availableUntil: expiredAt ? date2FsTimestamp(expiredAt) : null,
    }
    if (passCode) {
      const randomCipher = randomPassCode();
      const longLinkEncrypted = encryptAES(link, [passCode, randomCipher]);
      shortLinkData.passCode = randomCipher;
      shortLinkData.longLink = longLinkEncrypted;
    }
    const res = await fsAdd<tShortenLink>(shortLinkData, ROOT_COLLECTION_KEY);
    if (!res) {
      return error('unknown');
    }
    return {
      data: res,
    };
  } catch (err: any) {
    console.error('Error when creating a shorten link:', [link, passCode, expiredAt], err);
    return error('unknown');
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