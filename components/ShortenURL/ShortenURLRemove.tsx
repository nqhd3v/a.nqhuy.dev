import { useState } from "react";
import { SHORTEN_URL_LINK_ID_REGEX } from "../../utils/constants";
import { getLinkById, removeLink } from "../../utils/Firebase/services/shortenLinks";
import { tDataTransformed, tShortenLink } from "../../utils/types/model";
import { Input } from "../Form";
import { withBoundary } from "../wrapper/ErrorBoundary";

const RESULT_MAPPING: Record<string, string> = {
  'shortenLink.link-invalid': 'Your link is wrong format!',
  'shortenLink.removed': 'Your link is removed!',
  'shortenLink.remove-failed': 'Remove your link failed!',
  'shortenLink.unknown': 'Unknown error when try to get your link!',
  'shortenLink.require-passCode': 'Input your pass-code to remove your link!',
  'shortenLink.notfound': 'Your link is expired or not existed!',
  'cipher.input-invalid': 'Your pass-code is wrong!',
  'cipher.invalid-world-array': 'Your pass-code is wrong!',
}

const ShortenURLRemove: React.FC = () => {
  const [linkChecking, setLinkChecking] = useState<boolean>(false);
  const [data, setData] = useState<tDataTransformed<tShortenLink> | undefined>(undefined);
  const [linkId, setLinkId] = useState<string>('');
  const [passCode, setPassCode] = useState<string>('');
  const [result, setResult] = useState<string | undefined>(undefined);
  const [linkRemoving, setLinkRemoving] = useState<boolean>(false);

  const handleGetLink = async (id: string): Promise<tDataTransformed<tShortenLink> | undefined> => {
    try {
      if (!SHORTEN_URL_LINK_ID_REGEX.test(id)) {
        setResult("shortenLink.link-invalid");
        return;
      }
      const linkData = await getLinkById(id, passCode || undefined);
      if (linkData.isError) {
        setResult(linkData.errorMessageId);
        return undefined;
      }
      setResult(undefined);
      setData(linkData.data);
      return linkData.data;
    } catch (err) {
      console.error('Error when getting link:', err);
      return undefined;
    }
  }

  const handleCheckLink = async (id: string) => {
    setLinkChecking(true);
    await handleGetLink(id);
    setLinkChecking(false);
  }

  const handleRemoveLink = async () => {
    // Re-check
    const linkNeedRemove = await handleGetLink(linkId);
    if (!linkNeedRemove) {
      return;
    }
    setLinkRemoving(true);
    try {
      const res = await removeLink(linkNeedRemove._ref);
      if (res) {
        setResult("shortenLink.removed");
        setLinkRemoving(false);
        return;
      }
      setResult("shortenLink.remove-failed");
    } catch (err) {
      console.error('Error when removing shorten link:', [linkId, passCode], err);
    }
    setLinkRemoving(false);
  }

  const linkSafeIcon = () => {
    if (linkChecking) {
      return <i className="fa-solid fa-spinner fa-spin" />;
    }
    if (data === undefined) {
      return undefined;
    }
    if (data) {
      return <i className="fa-solid fa-check" />
    }
    return <i className="fa-solid fa-times" />;
  }

  return (
    <div className="rounded-md shadow border bg-light dark:bg-dark dark:border-light p-5 mb-5">
      <h2 className="text-2xl code font-bold">
        <span className="var">url</span>
        {"."}
        <span className="func">remove</span>
        {"();"}
      </h2>
      <div className="code comment mb-5">
        Input your link, pass-code (if need), and click &apos;Remove&apos; button to remove your link.
      </div>
      <div className="code comment">-- Input your link here</div>
      <Input
        prefix="https://a.nqhuy.dev/l/"
        className="code-var-define"
        placeholder="abcdef"
        value={linkId}
        onChange={v => setLinkId(v)}
        onBlur={v => handleCheckLink(v)}
        appendIcon={linkSafeIcon()}
        disabled={linkChecking}
      />

      <div className="code comment mt-3">-- Input your pass-code here (if need)</div>
      <Input
        className="code-var-define"
        placeholder="pass_code ="
        value={passCode}
        onChange={v => setPassCode(v)}
        disabled={!["cipher.input-invalid", "cipher.invalid-world-array", "shortenLink.require-passCode"].includes(result || "#######")}
      />
      
      <button
        className="run mt-5"
        onClick={() => handleRemoveLink()}
        disabled={linkRemoving}
      >
        {linkRemoving ? 'removing...' : 'remove'}
      </button>

      {result ? (
        <div className="mt-5">
          <div className="code comment">Result:</div>
          <code>{RESULT_MAPPING[result] || RESULT_MAPPING['unknown']}</code>
        </div>
      ) : null}
    </div>
  )
}

export default withBoundary(ShortenURLRemove);