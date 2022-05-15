import React, { useEffect, useState } from "react";
import { RiLinkedinFill } from "react-icons/ri";
import { AiFillGithub } from "react-icons/ai";
import { MdAddLink } from "react-icons/md";
import {
  Box,
  Link,
  Flex,
  Grid,
  Spacer,
  Text,
  Image,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useToast,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowUpIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Formik, Field, Form } from "formik";

import API, { graphqlOperation } from "@aws-amplify/api";
import "@aws-amplify/pubsub";
import { listShortenedLinkPairs } from "../graphql/queries";
import { onCreateShortenedLinkPair } from "../graphql/subscriptions";
import { createShortenedLinkPair } from "../graphql/mutations";

import ThemeToggle from "../components/ThemeToggle";

function Shortener() {
  const [urls, setURLs] = useState([]);
  const [customURLBody, setCustomURLBody] = useState("");
  const [targetURLBody, setTargetURLBody] = useState("");
  const toast = useToast();

  useEffect(() => {
    API.graphql(graphqlOperation(listShortenedLinkPairs)).then((response) => {
      const items = response.data?.listShortenedLinkPairs?.items;

      if (items) {
        setURLs(items);
      }
    });
  }, []);

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateShortenedLinkPair)
    ).subscribe({
      next: (event) => {
        setURLs([...urls, event.value.data.onCreateShortenedLinkPair]);
      },
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
      targetURL: targetURLBody.trim(),
    };

    let filter = {
      customURL: { eq: input.customURL },
    };

    var customURLAlreadyExists = false;

    var fetched_data = await API.graphql(
      graphqlOperation(listShortenedLinkPairs, { filter: filter })
    );
    try {
      var fetched_customURL =
        fetched_data.data.listShortenedLinkPairs.items[0]["customURL"];
      var fetched_targetURL =
        fetched_data.data.listShortenedLinkPairs.items[0]["targetURL"];
      console.log(
        "retreiving: " + fetched_customURL + " --> " + fetched_targetURL
      );
      customURLAlreadyExists = true;
    } catch (error) {
      customURLAlreadyExists = false;
      console.error(error);
    }

    try {
      if (customURLAlreadyExists === true) {
        toast({
          title: "Error",
          description: "Sorry, custom short link taken",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (!input.targetURL.includes("http://") && !input.targetURL.includes("https://")) {
        toast({
          title: "Error with original long link",
          description: "Original long url must include http:// or https://",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (input.customURL.includes("http://") || input.customURL.includes("https://") || input.customURL.includes("www.") || input.customURL.includes("/")) {
        toast({
          title: "Error with custom short link",
          description: "Please only type the part after webdir.link/ above. Do not include http:// or https:// or www. or /",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else if (input.targetURL === "" || input.customURL === "") {
        toast({
          title: "Error",
          description: "Missing link(s)",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setCustomURLBody("");
        setTargetURLBody("");
        await API.graphql(graphqlOperation(createShortenedLinkPair, { input }));
        console.log("sending: " + input.customURL + " --> " + input.targetURL);
        toast({
          title: "Custom short URL created",
          description: "webdir.link/" + input.customURL + " --> " + input.targetURL,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div align="center">
      <Flex align="center" marginTop="8">
        <Box align="center" width="100%">
          <Image
            src={process.env.PUBLIC_URL + "logo192.png"}
            boxSize="100px"
            alt="webdir.link"
            align="center"
          />
          <Text fontSize="3xl" textAlign="center" color={useColorModeValue("#815ad5", "#D6BCFA")}>
            webdir.link
          </Text>
          <Text fontSize="md" textAlign="center" color={useColorModeValue("#815ad5", "#D6BCFA")}>
            URL Shortener
          </Text>
        </Box>
      </Flex>
      <Box marginTop="12" width="80%" maxWidth="400px">
        <Formik>
          {(props) => (
            <Form onSubmit={handleSubmit}>
              <Text fontSize="xs" textAlign="left" marginLeft="1" marginTop="2" color="grey"> 
                Example: https://linkedin.com/in/georgeshao
              </Text>
              <Field name="targetURL">
                {({ field, form }) => (
                  <InputGroup size="md">
                    <Input
                      {...field}
                      name="targetURL"
                      placeholder="Enter original long link here"
                      onChange={handleTargetChange}
                      value={targetURLBody}
                    />
                  </InputGroup>
                )}
              </Field>
              <Text fontSize="xs" textAlign="left" marginLeft="1" marginTop="2" color="grey"> 
                  Example: gs_linkedin
              </Text>
              <Field name="customURL">
                {({ field, form }) => (
                  <InputGroup size="md">
                    <Input
                      {...field}
                      name="customURL"
                      placeholder="Enter custom short link here"
                      onChange={handleCustomChange}
                      value={customURLBody}
                    />
                  </InputGroup>
                )}
              </Field>
              <Button
                icon={<ArrowUpIcon />}
                colorScheme="purple"
                type="submit"
                onSubmit={handleSubmit}
                leftIcon={<MdAddLink />}
                marginTop="2"
              >
                Shorten Link
              </Button>
            </Form>
          )}
        </Formik>
        <Text fontSize="md" marginTop="12" color={useColorModeValue("#815ad5", "#D6BCFA")}>
          Made with ❤️ by George Shao
        </Text>
        <Button
          backgroundColor="#0072b1"
          color="white"
          marginTop="2"
          onClick={() => window.open("https://www.linkedin.com/in/georgeshao/")}
          leftIcon={<RiLinkedinFill />}
          width="90%"
        >
          Let's connect on LinkedIn!
        </Button>
        <Button
          backgroundColor="black"
          color="white"
          marginTop="2"
          onClick={() =>
            window.open("https://github.com/GeorgeShao/webdir.link")
          }
          leftIcon={<AiFillGithub />}
          width="90%"
        >
          Check this out on GitHub!
        </Button>
      </Box>
      <Flex align="center">
        <Box align="center" width="100%">
          <ThemeToggle />
        </Box>
      </Flex>
    </div>
  );
}

export default Shortener;
