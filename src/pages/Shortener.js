import React, { useEffect, useState } from 'react'
import { Box, Center, Flex, Grid, Spacer, Text, Button, InputGroup, Input, InputRightElement, IconButton } from '@chakra-ui/react'
import { ArrowUpIcon } from '@chakra-ui/icons'
import { Formik, Field, Form } from "formik";
import ThemeToggle from "../components/ThemeToggle"

function Shortener() {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('');
  const [userInfo, setUserInfo] = useState(null);

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
          <Flex></Flex>
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
          <Flex>
            <Spacer />
            <ThemeToggle />
          </Flex>
        </Grid>
      </div>
  )
}

export default Shortener
