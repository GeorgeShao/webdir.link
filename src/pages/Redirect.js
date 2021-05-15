import React, { useEffect } from 'react'

import API, { graphqlOperation } from '@aws-amplify/api';
import '@aws-amplify/pubsub';
import { listShortenedLinkPairs } from '../graphql/queries';

function Redirect(props) {
  const { shortlink } = props.match.params

  useEffect(() => {
    const fetchTargetURL = async () => {
      console.log("shortlink:", shortlink)

      let filter = {
        customURL: {eq: shortlink.trim()}
      };

      var fetched_data = await API.graphql(graphqlOperation(listShortenedLinkPairs, {filter:filter}));
      try {
        var fetched_customURL = fetched_data.data.listShortenedLinkPairs.items[0]['customURL'];
        var fetched_targetURL = fetched_data.data.listShortenedLinkPairs.items[0]['targetURL'];
        console.log("redirecting: " + fetched_customURL + " --> " + fetched_targetURL);
        window.location.href = fetched_data.data.listShortenedLinkPairs.items[0]['targetURL'];
      } catch (error) {
        console.error(error);
        alert("Custom URL does not exist.")
      }
    }
    fetchTargetURL()
  }, [shortlink]);

  return (
    <p>{shortlink}</p>
  )
}

export default Redirect
