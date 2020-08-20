import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";

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
    <div>
      {console.log("data:", data)}
      <h1>These are the script tags right now:</h1>
      {/* scriptag를 생성하는 버튼. refetchQueries 옵션은 scripttag 생성 후, 자동으로 재 query실행해 최신 데이터를 출력 */}
      <button
        type="submit"
        onClick={() => {
          createScripts({
            variables: {
              input: {
                src: "https://e14ce1d77593.ngrok.io/test-script.js",
                displayScope: "ALL",
              },
            },
            refetchQueries: [{ query: QUERY_SCRIPTTAGS }],
          });
        }}
      >
        Create Script Tag
      </button>
      {data.scriptTags.edges.map((item) => {
        return (
          <div key={item.node.id}>
            <p>{item.node.id}</p>
            <button
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
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ScriptPage;
