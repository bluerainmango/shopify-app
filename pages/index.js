import React, { useState } from "react";
import { EmptyState, Layout, Page, Modal } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";
//! ResourcePicker를 통해 선택한 제품을 local storage에 저장하기 위해 설치
import store from "store-js";

function Index() {
  const [modal, setModal] = useState({ open: false });
  const emptyState = !store.get("ids");

  function handleSection(resources) {
    const idsFromResources = resources.selection.map((product) => product.id);
    setModal({ open: false });
    store.set("ids", idsFromResources);

    console.log(`😉 This is product ids:`, store.get("ids"));
  }

  return (
    <Page>
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={modal.open}
        onCancel={() => setModal({ open: false })}
        onSelection={(resources) => handleSection(resources)}
      />
      <Layout>
        <EmptyState
          heading="Headline"
          action={{
            content: "Call to action",
            onAction: () => setModal({ open: true }),
          }}
          secondaryAction={{
            content: "Learn more",
            url: "https://help.shopify.com",
          }}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        >
          <p>Emily's app index page</p>
        </EmptyState>
      </Layout>
    </Page>
  );
}

export default Index;
