import {
  ArrowRightIcon,
  CopyIcon,
  DownloadIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  HStack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ResizableEditor from "./ResizableEditor";
import { downloadFile } from "../utils/download";

const JsonToBase64 = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [base64Output, setBase64Output] = useState("");
  const toast = useToast();
  const editorBg = useColorModeValue("white", "gray.800");

  const convertToBase64 = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const base64Content = btoa(JSON.stringify(jsonData));
      setBase64Output(base64Content);
      toast({
        title: "Converted to Base64 successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid JSON",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const convertFromBase64 = () => {
    try {
      const jsonString = atob(base64Input);
      const jsonData = JSON.parse(jsonString);
      setJsonOutput(JSON.stringify(jsonData, null, 2));
      toast({
        title: "Conversion successful",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid Base64",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const downloadBase64 = () => {
    downloadFile(base64Output, "converted.txt", "text/plain", toast);
  };

  const clearEditor = () => {
    setJsonInput("");
    setBase64Input("");
    setJsonOutput("");
    setBase64Output("");
    toast({
      title: "Editor cleared",
      status: "info",
      duration: 1000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
      <Tabs variant="enclosed">
        <TabList>
          <Tab>JSON to Base64</Tab>
          <Tab>Base64 to JSON</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              <Card variant="outline" bg={editorBg}>
                <CardBody>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    <HStack
                      justify="space-between"
                      flexWrap={{ base: "wrap", sm: "nowrap" }}
                      gap={2}
                    >
                      <Text
                        fontWeight="bold"
                        fontSize={{ base: "md", lg: "lg" }}
                      >
                        JSON Input
                        {jsonInput && (
                          <Badge ml={2} colorScheme="blue">
                            {(jsonInput.length / 1024).toFixed(1)}KB
                          </Badge>
                        )}
                      </Text>
                      <ButtonGroup size="sm" isAttached variant="outline">
                        <Tooltip label="Copy JSON" openDelay={500}>
                          <IconButton
                            aria-label="Copy JSON"
                            icon={<CopyIcon />}
                            onClick={() => copyToClipboard(jsonInput)}
                          />
                        </Tooltip>
                        <Tooltip label="Clear Editor" openDelay={500}>
                          <IconButton
                            aria-label="Clear Editor"
                            icon={<RepeatIcon />}
                            onClick={clearEditor}
                          />
                        </Tooltip>
                      </ButtonGroup>
                    </HStack>
                    <ResizableEditor
                      value={jsonInput}
                      onChange={(value) => setJsonInput(value || "")}
                    />
                  </VStack>
                </CardBody>
              </Card>

              <Button
                bg="#004aad"
                color="white"
                _hover={{ bg: "#003c8a" }}
                size={{ base: "md", lg: "lg" }}
                onClick={convertToBase64}
                leftIcon={<ArrowRightIcon />}
              >
                Convert to Base64
              </Button>

              {base64Output && (
                <Card variant="outline" bg={editorBg}>
                  <CardBody>
                    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                      <HStack
                        justify="space-between"
                        flexWrap={{ base: "wrap", sm: "nowrap" }}
                        gap={2}
                      >
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: "md", lg: "lg" }}
                        >
                          Base64 Output
                          {base64Output && (
                            <Badge ml={2} colorScheme="blue">
                              {(base64Output.length / 1024).toFixed(1)}KB
                            </Badge>
                          )}
                        </Text>
                        <ButtonGroup size="sm" isAttached variant="outline">
                          <Tooltip label="Copy Base64" openDelay={500}>
                            <IconButton
                              aria-label="Copy Base64"
                              icon={<CopyIcon />}
                              onClick={() => copyToClipboard(base64Output)}
                            />
                          </Tooltip>
                          <Tooltip label="Download Base64" openDelay={500}>
                            <IconButton
                              aria-label="Download Base64"
                              icon={<DownloadIcon />}
                              onClick={downloadBase64}
                            />
                          </Tooltip>
                        </ButtonGroup>
                      </HStack>
                      <ResizableEditor
                        value={base64Output}
                        onChange={() => {}}
                        readOnly
                      />
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </TabPanel>

          <TabPanel p={0}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              <Card variant="outline" bg={editorBg}>
                <CardBody>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    <HStack
                      justify="space-between"
                      flexWrap={{ base: "wrap", sm: "nowrap" }}
                      gap={2}
                    >
                      <Text
                        fontWeight="bold"
                        fontSize={{ base: "md", lg: "lg" }}
                      >
                        Base64 Input
                        {base64Input && (
                          <Badge ml={2} colorScheme="blue">
                            {(base64Input.length / 1024).toFixed(1)}KB
                          </Badge>
                        )}
                      </Text>
                      <ButtonGroup size="sm" isAttached variant="outline">
                        <Tooltip label="Copy Base64" openDelay={500}>
                          <IconButton
                            aria-label="Copy Base64"
                            icon={<CopyIcon />}
                            onClick={() => copyToClipboard(base64Input)}
                          />
                        </Tooltip>
                        <Tooltip label="Clear Editor" openDelay={500}>
                          <IconButton
                            aria-label="Clear Editor"
                            icon={<RepeatIcon />}
                            onClick={clearEditor}
                          />
                        </Tooltip>
                      </ButtonGroup>
                    </HStack>
                    <ResizableEditor
                      value={base64Input}
                      onChange={(value) => setBase64Input(value || "")}
                    />
                  </VStack>
                </CardBody>
              </Card>

              <Button
                bg="#004aad"
                color="white"
                _hover={{ bg: "#003c8a" }}
                size={{ base: "md", lg: "lg" }}
                onClick={convertFromBase64}
                leftIcon={<ArrowRightIcon />}
              >
                Convert to JSON
              </Button>

              {jsonOutput && (
                <Card variant="outline" bg={editorBg}>
                  <CardBody>
                    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                      <HStack
                        justify="space-between"
                        flexWrap={{ base: "wrap", sm: "nowrap" }}
                        gap={2}
                      >
                        <Text
                          fontWeight="bold"
                          fontSize={{ base: "md", lg: "lg" }}
                        >
                          JSON Output
                          {jsonOutput && (
                            <Badge ml={2} colorScheme="blue">
                              {(jsonOutput.length / 1024).toFixed(1)}KB
                            </Badge>
                          )}
                        </Text>
                        <ButtonGroup size="sm" isAttached variant="outline">
                          <Tooltip label="Copy JSON" openDelay={500}>
                            <IconButton
                              aria-label="Copy JSON"
                              icon={<CopyIcon />}
                              onClick={() => copyToClipboard(jsonOutput)}
                            />
                          </Tooltip>
                          <Tooltip label="Download JSON" openDelay={500}>
                            <IconButton
                              aria-label="Download JSON"
                              icon={<DownloadIcon />}
                              onClick={() =>
                                downloadFile(
                                  jsonOutput,
                                  "decoded.json",
                                  "application/json",
                                  toast
                                )
                              }
                            />
                          </Tooltip>
                        </ButtonGroup>
                      </HStack>
                      <ResizableEditor
                        value={jsonOutput}
                        onChange={() => {}}
                        readOnly
                      />
                    </VStack>
                  </CardBody>
                </Card>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Box>
        <Text fontSize="sm" color="gray.500">
          <Text as="span" fontWeight="bold">
            Note:
          </Text>{" "}
          Base64 Converter features:
        </Text>
        <VStack align="start" mt={2} spacing={1}>
          <Text fontSize="sm">• Bidirectional conversion</Text>
          <Text fontSize="sm">• Validates JSON during conversion</Text>
          <Text fontSize="sm">• Handles special characters</Text>
          <Text fontSize="sm">• Shows file sizes</Text>
          <Text fontSize="sm">• Supports download and copy</Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default JsonToBase64;
