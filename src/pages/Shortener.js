import React, { useEffect, useState } from 'react'

import { Box, Link, Flex, Grid, Spacer, Text, Image, InputGroup, Input, InputRightElement, IconButton, useToast } from '@chakra-ui/react'
import { ArrowUpIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { Formik, Field, Form } from "formik";

import API, { graphqlOperation } from '@aws-amplify/api';
import '@aws-amplify/pubsub';
import { listShortenedLinkPairs } from '../graphql/queries';
import { onCreateShortenedLinkPair } from '../graphql/subscriptions';
import { createShortenedLinkPair } from '../graphql/mutations';

import ThemeToggle from "../components/ThemeToggle"

function Shortener() {
  const [urls, setURLs] = useState([]);
  const [customURLBody, setCustomURLBody] = useState('');
  const [targetURLBody, setTargetURLBody] = useState('');
  const toast = useToast()

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
      customURL: customURLBody.trim().toLowerCase(),
      targetURL: targetURLBody.trim()
    };

    let filter = {
      customURL: {eq: input.customURL}
    };

    var customURLAlreadyExists = false

    var fetched_data = await API.graphql(graphqlOperation(listShortenedLinkPairs, {filter:filter}));
    try {
      var fetched_customURL = fetched_data.data.listShortenedLinkPairs.items[0]['customURL'];
      var fetched_targetURL = fetched_data.data.listShortenedLinkPairs.items[0]['targetURL'];
      console.log("retreiving: " + fetched_customURL + " --> " + fetched_targetURL);
      customURLAlreadyExists = true;
    } catch (error) {
      customURLAlreadyExists = false;
      console.error(error);
    }
    
    try {
      if (customURLAlreadyExists === true){
        toast({
          title: "Custom short URL taken",
          description: "? --> ?",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      } else if (input.customURL === "" && input.targetURL === ""){
        toast({
          title: "Missing URLs",
          description: "? --> ?",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      } else if (input.customURL === ""){
        toast({
          title: "Missing custom short URL",
          description: "? --> " + input.targetURL,
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      } else if (input.targetURL === "") {
        toast({
          title: "Missing target URL",
          description: input.customURL + " --> ?",
          status: "error",
          duration: 9000,
          isClosable: true,
        })
      } else {
        setCustomURLBody('');
        setTargetURLBody('');
        await API.graphql(graphqlOperation(createShortenedLinkPair, { input }))
        console.log("sending: " + input.customURL + " --> " + input.targetURL)
        toast({
          title: "Custom short URL created",
          description: input.customURL + " --> " + input.targetURL,
          status: "success",
          duration: 9000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Grid templateColumns="repeat(3, 1fr)">
        <Flex>
          <Box>
            <Image marginLeft="4" src={process.env.PUBLIC_URL + "logo192.png"} boxSize="100px" alt="webdir.link" align="center"/>
            <Text fontSize="3xl" marginLeft="4" color="#815ad5" textAlign="left">webdir.link</Text>
            <Text fontSize="md" marginLeft="4" color="#815ad5" textAlign="left">URL Shortener</Text>
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
                      <Input {...field} name="targetURL" placeholder="Enter your full target URL (eg. http://www.google.com)" onChange={handleTargetChange} value={targetURLBody}/>
                      <InputRightElement>
                        <IconButton h="1.75rem" size="md" marginEnd="10px" icon={<ArrowUpIcon/>} colorScheme="purple" type="submit" onSubmit={handleSubmit}/>
                      </InputRightElement>
                    </InputGroup>
                  )}
                </Field>
              </Form>
            )}
          </Formik>
          <br/>
          <Text fontSize="md" marginLeft="4" color="#815ad5">Made with ❤️ by George Shao</Text>
          <Link color="#815ad5" href="https://www.linkedin.com/in/george-shao/" isExternal>
            Let's connect on LinkedIn! <ExternalLinkIcon mx="2px" />
          </Link>
          <Text fontSize="md" marginLeft="4" color="#815ad5"> </Text>
          <Link color="#815ad5" href="https://github.com/GeorgeShao/webdir.link" isExternal>
            This project is open source! Check it out on GitHub! <ExternalLinkIcon mx="2px" />
          </Link>
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
