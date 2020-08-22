import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Layout,
  Page,
  ResourceList,
  Stack,
} from "@shopify/polaris";

const CREATE_SCRIPT_TAG = gql`
  mutation scriptTagCreate($input: ScriptTagInput!) {
    scriptTagCreate(input: $input) {
      scriptTag {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const QUERY_SCRIPTTAGS = gql`
  query {
    scriptTags(first: 5) {
      edges {
        node {
          id
          src
          displayScope
        }
      }
    }
  }
`;

const DELETE_SCRIPTTAG = gql`
  mutation scriptTagDelete($id: ID!) {
    scriptTagDelete(id: $id) {
      deletedScriptTagId
      userErrors {
        field
        message
      }
    }
  }
`;

function ScriptPage() {
  const [createScripts] = useMutation(CREATE_SCRIPT_TAG);
  const [deleteScripts] = useMutation(DELETE_SCRIPTTAG);
  const { loading, error, data } = useQuery(QUERY_SCRIPTTAGS);

  if (loading) return <div>Loading....</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Page>
      {/* layout은 css없이도 grid 사용할 수 있게 해줌. sectioned 는 auto wrap */}
      <Layout>
        <Layout.Section>
          <Card title="These are the Script Tags:" sectioned>
            <p>Create or Delete a Script Tag</p>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card title="Delete Tag" sectioned>
            <Button
              primary
              size="slim"
              type="submit"
              onClick={() => {
                createScripts({
                  variables: {
                    input: {
                      src: "https://68104d810034.ngrok.io/test-script.js",
                      displayScope: "ALL",
                    },
                  },
                  refetchQueries: [{ query: QUERY_SCRIPTTAGS }],
                });
              }}
            >
              Create Script Tag
            </Button>
          </Card>
        </Layout.Section>
        <Layout.Section>
          <Card>
            <ResourceList
              showHeader
              resourceName={{ singular: "Script", plural: "Scripts" }}
              item={data.scriptTags.edges}
              renderItem={(item) => {
                return (
                  <ResourceList.Item id={item.id}>
                    <Stack>
                      <Stack.Item>
                        <p>{item.node.id}</p>
                      </Stack.Item>
                      <Stack.Item>
                        <Button
                          type="submit"
                          onClick={() => {
                            deleteScripts({
                              variables: {
                                id: item.node.id,
                              },
                              refetchQueries: [{ query: QUERY_SCRIPTTAGS }],
                            });
                          }}
                        >
                          Delete Script Tag
                        </Button>
                      </Stack.Item>
                    </Stack>
                  </ResourceList.Item>
                );
              }}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

export default ScriptPage;

//! ScriptPage 의 return 으로 들어가있던 값. 너무 ugly해서 삭제함.
// {/* <div>
//   {console.log("data:", data)}
//   <h1>These are the script tags right now:</h1>
//   {/* scriptag를 생성하는 버튼. refetchQueries 옵션은 scripttag 생성 후, 자동으로 재 query실행해 최신 데이터를 출력 */}
//   <button
//     type="submit"
//     onClick={() => {
//       createScripts({
//         variables: {
//           input: {
//             src: "https://e14ce1d77593.ngrok.io/test-script.js",
//             displayScope: "ALL",
//           },
//         },
//         refetchQueries: [{ query: QUERY_SCRIPTTAGS }],
//       });
//     }}
//   >
//     Create Script Tag
//   </button>
//   {data.scriptTags.edges.map((item) => {
//     return (
//       <div key={item.node.id}>
//         <p>{item.node.id}</p>
//         <button
//           type="submit"
//           onClick={() => {
//             deleteScripts({
//               variables: {
//                 id: item.node.id,
//               },
//               refetchQueries: [{ query: QUERY_SCRIPTTAGS }],
//             });
//           }}
//         >
//           Delete Script Tag
//         </button>
//       </div>
//     );
//   })}
// </div> */}
