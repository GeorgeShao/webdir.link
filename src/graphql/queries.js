/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getShortenedLinkPair = /* GraphQL */ `
  query GetShortenedLinkPair($id: ID!) {
    getShortenedLinkPair(id: $id) {
      id
      customURL
      targetURL
      createdAt
      updatedAt
    }
  }
`;
export const listShortenedLinkPairs = /* GraphQL */ `
  query ListShortenedLinkPairs(
    $filter: ModelShortenedLinkPairFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listShortenedLinkPairs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        customURL
        targetURL
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
