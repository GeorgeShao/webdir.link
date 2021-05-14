/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createShortenedLinkPair = /* GraphQL */ `
  mutation CreateShortenedLinkPair(
    $input: CreateShortenedLinkPairInput!
    $condition: ModelShortenedLinkPairConditionInput
  ) {
    createShortenedLinkPair(input: $input, condition: $condition) {
      id
      customURL
      targetURL
      createdAt
      updatedAt
    }
  }
`;
export const updateShortenedLinkPair = /* GraphQL */ `
  mutation UpdateShortenedLinkPair(
    $input: UpdateShortenedLinkPairInput!
    $condition: ModelShortenedLinkPairConditionInput
  ) {
    updateShortenedLinkPair(input: $input, condition: $condition) {
      id
      customURL
      targetURL
      createdAt
      updatedAt
    }
  }
`;
export const deleteShortenedLinkPair = /* GraphQL */ `
  mutation DeleteShortenedLinkPair(
    $input: DeleteShortenedLinkPairInput!
    $condition: ModelShortenedLinkPairConditionInput
  ) {
    deleteShortenedLinkPair(input: $input, condition: $condition) {
      id
      customURL
      targetURL
      createdAt
      updatedAt
    }
  }
`;
