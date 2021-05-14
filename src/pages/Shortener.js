import React, { useEffect, useState } from 'react'
import { Box, Center, Flex, Grid, Spacer, Text, Button, InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react'
import { ArrowUpIcon } from '@chakra-ui/icons'
import { Formik, Field, Form } from "formik";
import ThemeToggle from "../components/ThemeToggle"
import API, { graphqlOperation } from '@aws-amplify/api';
import { listShortenedLinkPairs } from '../graphql/queries';

function Shortener() {
  const [urls, setURLs] = useState([]);
  const [messageBody, setMessageBody] = useState('');

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

  const handleChange = (event) => {
    setMessageBody(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const input = {
      text: messageBody.trim()
    };

    try {
      setMessageBody('');
      alert('try')
    } catch (error) {
      alert('error')
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
          {urls.map((url) => (
            <div key={url.id}>{url.customURL} --> {url.targetURL}</div>
          ))}
          <Spacer />
        </Flex>
          <Box marginTop="2">
          <Formik>
            {(props) => (
              <Form onSubmit={handleSubmit}>
                <Field name="message">
                  {({ field, form }) => (
                    <InputGroup size="md">
                      <Input {...field} name="message" placeholder="Enter Message..." onChange={handleChange} value={messageBody}/>
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
