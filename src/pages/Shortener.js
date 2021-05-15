import React, { useEffect, useState } from 'react'
import { Box, Center, Flex, Grid, Spacer, Text, Button, InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react'
import { ArrowUpIcon } from '@chakra-ui/icons'
import { Formik, Field, Form } from "formik";
import ThemeToggle from "../components/ThemeToggle"
import API, { graphqlOperation } from '@aws-amplify/api';
import '@aws-amplify/pubsub';
import { listShortenedLinkPairs } from '../graphql/queries';
import { onCreateShortenedLinkPair } from '../graphql/subscriptions';
import { createShortenedLinkPair } from '../graphql/mutations';

function Shortener() {
  const [urls, setURLs] = useState([]);
  const [customURLBody, setCustomURLBody] = useState('');
  const [targetURLBody, setTargetURLBody] = useState('');

  useEffect(() => {
    API
      .graphql(graphqlOperation(listShortenedLinkPairs))
      .then((response) => {
        const items = response.data?.listShortenedLinkPairs?.items;
        
        if (items) {
          setURLs(items);
        }
      });
  }, []);

  useEffect(() => {
    const subscription = API
      .graphql(graphqlOperation(onCreateShortenedLinkPair))
      .subscribe({
        next: (event) => {
          setURLs([...urls, event.value.data.onCreateShortenedLinkPair]);
        }
      });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [urls]);

  const handleCustomChange = (event) => {
    setCustomURLBody(event.target.value);
  };

  const handleTargetChange = (event) => {
    setTargetURLBody(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = {
      customURL: customURLBody.trim(),
      targetURL: targetURLBody.trim()
    };

    let filter = {
      customURL: {eq: input.customURL}
    };

    var alreadyExists = false

    var fetched_data = await API.graphql(graphqlOperation(listShortenedLinkPairs, {limit: 1, filter:filter}));
    try {
      var fetched_customURL = fetched_data.data.listShortenedLinkPairs.items[0]['customURL'];
      var fetched_targetURL = fetched_data.data.listShortenedLinkPairs.items[0]['targetURL'];
      console.log("retreiving: " + fetched_customURL + " --> " + fetched_targetURL);
      alreadyExists = true;
    } catch (error) {
      alreadyExists = false;
      console.warn(error);
    }
    
    try {
      if (alreadyExists === true){
        alert("Custom short URL already exists.")
      } else if (input.customURL === "" && input.targetURL === ""){
        alert("Please enter a custom short URL and a target URL.")
      } else if (input.customURL === ""){
        alert("Please enter a custom short URL.")
      } else if (input.targetURL === "") {
        alert("Please enter a target URL.")
      } else {
        setCustomURLBody('');
        setTargetURLBody('');
        await API.graphql(graphqlOperation(createShortenedLinkPair, { input }))
        console.log("sending: " + input.customURL + " --> " + input.targetURL)
        alert("Success! " + input.customURL + " --> " + input.targetURL)
      }
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div>
      <Grid templateColumns="repeat(3, 1fr)">
        <Flex>
          <Box>
            <Text fontSize="3xl" marginLeft="4" color="#815ad5">webdir.link</Text>
            <Text fontSize="md" marginLeft="4" color="#815ad5">URL Shortener</Text>
          </Box>
          <Spacer />
        </Flex>
        <Box marginTop="2">
          <Formik>
            {(props) => (
              <Form onSubmit={handleSubmit}>
                <Field name="customURL">
                  {({ field, form }) => (
                    <InputGroup size="md">
                      <Input {...field} name="customURL" placeholder="Enter your custom short URL (eg. 123 for webdir.link/123)" onChange={handleCustomChange} value={customURLBody}/>
                    </InputGroup>
                  )}
                </Field>
                <Box margin="2"/>
                <Field name="targetURL">
                  {({ field, form }) => (
                    <InputGroup size="md">
                      <Input {...field} name="targetURL" placeholder="Enter your target URL (eg. google.com)" onChange={handleTargetChange} value={targetURLBody}/>
                      <InputRightElement>
                        <IconButton h="1.75rem" size="md" marginEnd="10px" icon={<ArrowUpIcon/>} colorScheme="purple" type="submit" onSubmit={handleSubmit}/>
                      </InputRightElement>
                    </InputGroup>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
        </Box>
        <Flex>
          <Spacer />
          <ThemeToggle />
        </Flex>
      </Grid>
    </div>
  )
}

export default Shortener
