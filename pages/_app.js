import App from "next/app";
import Head from "next/head";
// AppProvider : app을 감싸 polaris가 전체 앱에 적용되도록 하는 태그.
import { AppProvider } from "@shopify/polaris";
// import "@shopify/polaris/styles.css";
import "@shopify/polaris/dist/styles.css";
// translations: 언어 지원
import translations from "@shopify/polaris/locales/en.json";
// product 등 admin 아이템의 정보를 가져오려면 아래 app-bridge가 필요
import { Provider } from "@shopify/app-bridge-react";
import Cookies from "js-cookie";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    //! server에서 쿠키를 사용해줬기 때문에 아래에서도 쿠키 사용??
    const config = {
      apiKey: API_KEY,
      shopOrigin: Cookies.get("shopOrigin"),
      forceRedirect: true,
    };

    return (
      <React.Fragment>
        <Head>
          <title>Emily's app</title>
          <meta charSet="utf-8" />
        </Head>
        <Provider config={config}>
          <AppProvider i18n={translations}>
            <Component {...pageProps} />
          </AppProvider>
        </Provider>
      </React.Fragment>
    );
  }
}

export default MyApp;
