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

function ScriptPage() {
  return (
    <div>
      <h1>Hello this is Script Page</h1>
    </div>
  );
}

export default ScriptPage;
