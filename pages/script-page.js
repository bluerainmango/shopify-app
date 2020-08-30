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

//! 아래는 btn을 통해 script tag create을 해주면 frontpage에 public > test-script.js에 코딩한 것대로 header바가 추가/삭제 되는 기능.
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
          <Card title="Create Tag" sectioned>
            <Button
              primary
              size="slim"
              type="submit"
              onClick={() => {
                createScripts({
                  variables: {
                    input: {
                      src: "https://56ab801402af.ngrok.io/test-script.js",
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
              items={data.scriptTags.edges}
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
