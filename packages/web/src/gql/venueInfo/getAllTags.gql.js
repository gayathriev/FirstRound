import { gql } from '@apollo/client';

const GetAllTags = gql`
    query getTagsData {
            getAllTags {
                _id
                text
        }
    }
`;

export default GetAllTags;