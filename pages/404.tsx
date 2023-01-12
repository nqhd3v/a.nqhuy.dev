import { NextSeo } from "next-seo";
import Error from "../components/error/Error";

const Custom404 = () => (
  <>
    <NextSeo title="404 - Page not found" description="Huy Nguyen - a.nqhuy.dev" />
    <Error status={404} message="page not found" />
  </>
);

export default Custom404;