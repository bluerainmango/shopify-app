import React, { useState } from "react";
import { EmptyState, Layout, Page, Modal } from "@shopify/polaris";
import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
//! ResourcePicker를 통해 선택한 제품을 local storage에 저장하기 위해 설치
import store from "store-js";
import ProductList from "../components/ProductList";
import axios from "axios";

function Index() {
  const [modal, setModal] = useState({ open: false });
  const emptyState = !store.get("ids");

  function handleSelection(resources) {
    const idsFromResources = resources.selection.map((product) => product.id);
    setModal({ open: false });
    store.set("ids", idsFromResources);

    console.log(`😉 This is product ids:`, store.get("ids"));

    const selectedProducts = resources.selection;
    selectedProducts.map((product) => makeApiCall(product));
  }

  //! 선택한 items 을 api call post를 통해 저장(물론 여기서는 server 설치안함)
  async function makeApiCall(products) {
    const url = "/api/products";

    axios
      .post(url, products)
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  }

  return (
    <Page>
      <TitleBar
        primaryAction={{
          content: "Select New Products",
          onAction: () => setModal({ open: true }),
        }}
      />
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={modal.open}
        onCancel={() => setModal({ open: false })}
        onSelection={(resources) => handleSelection(resources)}
      />

      {console.log("🐷emptyState & modal: ", emptyState, "modal:", modal)}

      {/* emptyState가 비었을 시 <EmptyState>출력. 아니면 <ProductList> 출력 */}
      {emptyState ? (
        <Layout>
          <EmptyState
            heading="Headline"
            action={{
              content: "Select Products",
              onAction: () => setModal({ open: true }),
            }}
            image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
          >
            <p>Emily's app index page</p>
          </EmptyState>
        </Layout>
      ) : (
        <div>
          {/* {console.log("🐻items added!", store.get("ids"))} */}
          <ProductList />
        </div>
      )}
    </Page>
  );
}

export default Index;
