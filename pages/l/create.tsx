import LayoutAnimated from "../../components/wrapper/LayoutAnimated";
import ShortenURLCreate from "../../components/ShortenURL/ShortenURLCreate";
import ShortenURLRemove from "../../components/ShortenURL/ShortenURLRemove";

const CreateShortenLink = () => {
  return (
    <LayoutAnimated
      title="Create Shorten Link"
      description="This page allow you to create a new shorten link from your long link"
    >
      <div className="max-w-[550px] pt-5 sm:pt-[100px] m-auto">
        <h2 className="text-2xl sm:text-3xl code font-bold mb-5">
          <span className="var">url</span>
          {" = "}
          <span className="operator">
            {"new "}
          </span>
          <span className="class">ShortenURL</span>
          {"();"}
        </h2>
        <ShortenURLCreate />
        <ShortenURLRemove />
      </div>
    </LayoutAnimated>
  )
};

export default CreateShortenLink;
