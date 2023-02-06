import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { InputWithButton } from "../../components/Form";
import LayoutAnimated from "../../components/wrapper/LayoutAnimated";
import { getLinkById } from "../../utils/Firebase/services/shortenLinks";
import { tShortenLink } from "../../utils/types/model";

const ERROR_MAPPING: Record<string, string> = {
  'shortenLink.unknown': 'Unknown error when try to get your link!',
  'shortenLink.require-passCode': 'Input your pass-code to open your link!',
  'shortenLink.notfound': 'Your link is expired or not existed!',
  'cipher.input-invalid': 'Your pass-code is wrong!',
  'cipher.invalid-word-array': 'Your pass-code is wrong!',
};

const Wrapper: React.FC<{ icon: string, children: null | string | JSX.Element | (null | JSX.Element)[] }> = ({ icon, children }) => {
  return (
    <LayoutAnimated
      title="Open Shorten Link"
      description="This page allow you to open your shorten link"
    >
      <div className="w-full h-screen flex justify-center items-center">
        <div className="w-[400px] rounded-md shadow border border-light p-5 text-center">
          <i className={`${icon} text-2xl`} />
          <div className="pt-4 text-lg">
            {children}
          </div>
        </div>
      </div>
    </LayoutAnimated>
  )
}

const OpenShortenLink = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<tShortenLink | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const linkId: string | undefined = useMemo(() => (router.isReady && router.query.linkId as string) || undefined, [router.isReady, router.query.linkId]);

  const handleGetLinkData = async (id: string, passCode?: string) => {
    setLoading(true);
    try {
      const linkData = await getLinkById(id, passCode);
      if (linkData.isError) {
        setError(linkData.errorMessageId);
        setLoading(false);
        return;
      }
      if (!linkData.data) {
        setError("shortenLink.unknown");
        setData(undefined);
        return;
      }
      setError(undefined);
      setData(linkData.data.data);
      window.location.replace(linkData.data.data.longLink);
    } catch (err) {
      console.error('Error when getting link:', err);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!linkId || !(/[a-zA-Z0-9]{6}/.test(linkId))) {
      setLoading(false);
      setError("shortenLink.input-invalid");
      return;
    }
    handleGetLinkData(linkId);
  }, [router.isReady]);

  if (loading) {
    return (
      <Wrapper icon="fa-solid fa-spinner fa-spin">Checking your link...</Wrapper>
    )
  }

  if (error) {
    const passCodeInput = !!([
      "shortenLink.require-passCode",
      "cipher.input-invalid",
      "cipher.invalid-world-array"
    ].find(m => m === error))
      ? (
        <div className="text-left">
          <div className="code comment mt-5">
            Input your pass-code here:
          </div>
          <InputWithButton
            placeholder="pass_code ="
            onSubmit={(v) => linkId ? handleGetLinkData(linkId, v) : null}
          />
        </div>
      )
      : null;
    return (
      <Wrapper icon="fa-solid fa-triangle-exclamation">
        <div>{ERROR_MAPPING[error] || ERROR_MAPPING["shortenLink.unknown"]}</div>
        {passCodeInput}
      </Wrapper>
    )
  }

  if (!data) {
    return (
      <Wrapper icon="fa-solid fa-triangle-exclamation">
        <div>{ERROR_MAPPING["shortenLink.unknown"]}</div>
      </Wrapper>
    )
  }
  
  return (
    <Wrapper icon="fa-solid fa-check">
      <div>Your link is opening...</div>
      <div className="text-sm">
        {"(not open? "}
        <a href={data.longLink} rel="noreferrer">click here!</a>
        {")"}
      </div>
    </Wrapper>
  )
};

export default OpenShortenLink;
