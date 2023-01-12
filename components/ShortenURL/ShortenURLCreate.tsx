import axios from "axios";
import moment from "moment";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { URL_REGEX } from "../../utils/constants";
import { createLink } from "../../utils/Firebase/services/shortenLinks";
import Input from "../Input";

const ShortenURLCreate = () => {
  const [linkOutput, setLinkOutput] = useState<string>('');
  const [longLink, setLongLink] = useState<string>('');
  const [passCode, setPassCode] = useState<string>('');
  const [expireTime, setExpireTime] = useState<Date | null>(null);
  const [linkSafeState, setLinkSafeState] = useState<boolean | undefined>(undefined);
  const [linkSafeCheck, setLinkSafeCheck] = useState<boolean>(false);
  const [linkCreating, setLinkCreating] = useState<boolean>(false);

  const handleCheckLinkSafe = async () => {
    if (!URL_REGEX.test(longLink)) {
      setLongLink('');
      return;
    }
    setLinkSafeCheck(true);
    try {
      const res = await axios.post('/api/chongluadao-safecheck', { url: longLink });
      const { isSafe } = res.data;
      setLinkSafeState(isSafe);
      if (isSafe === true) {
        setLinkSafeCheck(false);
        return true;
      }
    } catch (err) {
      console.error('Error when checking link is safe:', longLink, err);
    }
    setLongLink('');
    setLinkSafeCheck(false);
    return false;
  }

  const handlePassCodeBlur = async () => {
    await handleCheckLinkSafe();
  }

  const handleCreateLink = async () => {
    // Re-check
    setLinkCreating(true);
    const isPassed = await handleCheckLinkSafe();
    if (!isPassed) {
      setLinkCreating(false);
      return;
    }
    try {
      const res = await createLink(longLink, passCode, expireTime || undefined);
      if (res.isError) {
        return;
      }
      if (res.data && res.data.data) {
        const shortenLink = `https://a.nqhuy.dev/l/${res.data.data.shortId}`;
        navigator.clipboard.writeText(shortenLink);
        setLinkOutput(shortenLink);
      }
    } catch (err) {
      console.error('Error when creating shorten link:', [longLink, passCode, expireTime], err);
    }
    setLinkCreating(false);
  }

  const linkSafeIcon = () => {
    if (linkSafeCheck) {
      return <i className="fa-solid fa-spinner fa-spin" />;
    }
    if (linkSafeState === undefined) {
      return undefined;
    }
    if (linkSafeState) {
      return <i className="fa-solid fa-check" />
    }
    return <i className="fa-solid fa-times" />;
  }

  return (
    <div className="rounded-md shadow border bg-light dark:bg-dark dark:border-light p-5 mb-5">
      <h2 className="text-2xl code font-bold">
        <span className="var">url</span>
        {"."}
        <span className="func">create</span>
        {"();"}
      </h2>
      <div className="code comment mb-5">
        Input your link, customize pass-code or expire-time, and click &apos;Create&apos; button to create your shorten link.
      </div>
      <div className="code comment">-- Input your link here</div>
      <Input
        placeholder="long_link ="
        value={longLink}
        onChange={v => setLongLink(v)}
        onBlur={() => handlePassCodeBlur()}
        appendIcon={linkSafeIcon()}
        disabled={linkSafeCheck}
      />
      {(!linkSafeState && linkSafeState !== undefined) ? (
        <div className="mb-3 code comment">
          {'Your link is not safe for user'}
          (we checked it with <a href="https://chongluadao.vn/" rel="noreferrer">chongluadao</a>&apos;s data)
          {', please input another link.'}
        </div>
      ) : (
        <div className="mb-3" />
      )}

      <div className="code comment">-- Input your pass-code here (disabled)</div>
      <div className="code comment -mt-1">This feature is <b>not ready to use!</b></div>
      <Input
        placeholder="pass_code ="
        value={passCode}
        onChange={v => setPassCode(v)}
        disabled
      />
      {/* <div className="code comment mb-3">Your pass-code can only contain letters and numbers</div> */}

      <div className="code comment mt-3">-- Input your time to expire your link here (optional)</div>
      <ReactDatePicker
        selected={expireTime}
        onChange={d => setExpireTime(d)}
        minDate={moment().add(1, 'd').startOf('d').toDate()}
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/mm/yyyy"
      />
      <div className="code comment mb-3">empty if no expire this link</div>
      
      <button
        className="run"
        onClick={() => handleCreateLink()}
        disabled={linkCreating}
      >
        {linkCreating ? 'creating...' : 'create'}
      </button>

      {linkOutput ? (
        <div className="mt-5">
          <div className="code comment">Your shorten link here (Copied)</div>
          <code>{linkOutput}</code>
        </div>
      ) : null}
    </div>
  )
}

export default ShortenURLCreate;