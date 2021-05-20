import React, { useEffect } from 'react'

import { useToast } from '@chakra-ui/react'

import API, { graphqlOperation } from '@aws-amplify/api';
import '@aws-amplify/pubsub';
import { listShortenedLinkPairs } from '../graphql/queries';

function Redirect(props) {
  const { shortlink } = props.match.params
  const toast = useToast()

  useEffect(() => {
    const fetchTargetURL = async () => {
      console.log("shortlink:", shortlink)

      let filter = {
        customURL: {eq: shortlink.trim().toLowerCase()}
      };

      var fetched_data = await API.graphql(graphqlOperation(listShortenedLinkPairs, {filter:filter}));
      try {
        var fetched_customURL = fetched_data.data.listShortenedLinkPairs.items[0]['customURL'];
        var fetched_targetURL = fetched_data.data.listShortenedLinkPairs.items[0]['targetURL'];
        console.log("redirecting: " + fetched_customURL + " --> " + fetched_targetURL);
        window.location.href = fetched_targetURL
        toast({
          title: "Redirecting...",
          description: fetched_customURL + " --> " + fetched_targetURL,
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      } catch (error) {
        console.error(error);
        toast({
          title: "Invalid custom short URL",
          description: fetched_customURL + " --> " + fetched_targetURL,
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      }
    }
    fetchTargetURL()
  }, [shortlink, toast]);

  return (
    <p>Redirecting...<b>{shortlink}</b>...</p>
  )
}

export default Redirect
