import React, { useState } from "react";
import { EmptyState, Layout, Page, Modal } from "@shopify/polaris";
import { ResourcePicker } from "@shopify/app-bridge-react";

function Index() {
  const [modal, setModal] = useState({ open: false });

  return (
    <Page>
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={modal.open}
        onCancel={() => setModal({ open: false })}
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
