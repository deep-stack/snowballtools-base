import { gql } from '@apollo/client';

export const removeMember = gql`
mutation ($memberId: String!) {
  removeMember(memberId: $memberId)
}
`;
