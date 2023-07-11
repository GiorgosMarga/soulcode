import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import {  RecoilRoot} from "recoil"
const MyApp: AppType = ({ Component, pageProps }) => {
  return <RecoilRoot> <Component {...pageProps} /></RecoilRoot>;
};

export default api.withTRPC(MyApp);
