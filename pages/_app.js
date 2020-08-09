import App from "next/app";
import Head from "next/head";
// AppProvider : app을 감싸 polaris가 전체 앱에 적용되도록 하는 태그.
import { AppProvider } from "@shopify/polaris";
// import "@shopify/polaris/styles.css";
import "@shopify/polaris/dist/styles.css";
// translations: 언어 지원
import translations from "@shopify/polaris/locales/en.json";

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <title>Emily's app</title>
          <meta charSet="utf-8" />
        </Head>
        <AppProvider i18n={translations}>
          <Component {...pageProps} />
        </AppProvider>
      </React.Fragment>
    );
  }
}

export default MyApp;
