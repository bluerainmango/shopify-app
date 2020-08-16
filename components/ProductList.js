import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
} from "@shopify/polaris";
import store from "store-js";

//! graphQL query
const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        id
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

function ProductList() {
  const { loading, error, data } = useQeury(GET_PRODUCTS_BY_ID, {
    variables: { ids: store.get("ids") },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  console.log("this is data", data);

  return (
    <Card>
      <ResourceList
        showHeader
        resourceName={{ singular: "Product", plural: "Products" }}
        items={data.nodes}
        renderItem={(item) => {
          const media = (
            <Thumbnail
              source={
                item.images.edges[0]
                  ? item.images.edges[0].node.originalSrc
                  : ""
              }
              alt={item.images.edges[0] ? item.images.edges[0].altText : ""}
            />
          );
          const price = item.variants.edges[0].node.price;
          return (
            <ResourceList.Item
              id={item.id}
              media={media}
              accessibilityLabel={`View details for ${item.title}`}
            >
              //! Stack: horozontally place items
              <Stack>
                <Stack.Item fill>
                  <h3>
                    <TextStyle variation="strong">{item.title}</TextStyle>
                  </h3>
                </Stack.Item>
                <Stack.Item>
                  <p>${price}</p>
                </Stack.Item>
              </Stack>
            </ResourceList.Item>
          );
        }}
      />
    </Card>
  );
}

export default ProductList;
{
  /* <div>
  <h1>Hello from productlist</h1>

  {data.nodes.map((item) => {
    return <p key={item.id}> {item.title}</p>;
  })}
</div> */
}
