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
  Select,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ResizableEditor from "./ResizableEditor";
import { downloadFile } from "../utils/download";
import yaml from "js-yaml";

const JsonToYaml = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [yamlOutput, setYamlOutput] = useState("");
  const [indentSize, setIndentSize] = useState("2");
  const toast = useToast();
  const editorBg = useColorModeValue("white", "gray.800");

  const convertToYaml = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const yamlContent = yaml.dump(jsonData, {
        indent: 2,
        lineWidth: -1,
      });
      setYamlOutput(yamlContent);
      toast({
        title: "Converted to YAML successfully",
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(yamlOutput);
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

  const downloadYaml = () => {
    downloadFile(yamlOutput, "converted.yaml", "text/yaml", toast);
  };

  const clearEditor = () => {
    setJsonInput("");
    setYamlOutput("");
    toast({
      title: "Editor cleared",
      status: "info",
      duration: 1000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
      <Card variant="outline" bg={editorBg}>
        <CardBody>
          <VStack spacing={{ base: 3, md: 4 }} align="stretch">
            <HStack
              justify="space-between"
              flexWrap={{ base: "wrap", sm: "nowrap" }}
              gap={2}
            >
              <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
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
                    onClick={() => navigator.clipboard.writeText(jsonInput)}
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

      <HStack spacing={4} flexWrap="wrap">
        <Select
          value={indentSize}
          onChange={(e) => setIndentSize(e.target.value)}
          width={{ base: "full", sm: "200px" }}
          size={{ base: "md", lg: "lg" }}
        >
          <option value="2">2 spaces</option>
          <option value="4">4 spaces</option>
          <option value="6">6 spaces</option>
        </Select>
        <Button
          bg="#004aad"
          color="white"
          _hover={{ bg: "#003c8a" }}
          size={{ base: "md", lg: "lg" }}
          onClick={convertToYaml}
          flexGrow={1}
          leftIcon={<ArrowRightIcon />}
          minW={{ base: "full", sm: "auto" }}
        >
          Convert to YAML
        </Button>
      </HStack>

      {yamlOutput && (
        <Card variant="outline" bg={editorBg}>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <HStack
                justify="space-between"
                flexWrap={{ base: "wrap", sm: "nowrap" }}
                gap={2}
              >
                <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
                  YAML Output
                  {yamlOutput && (
                    <Badge ml={2} colorScheme="blue">
                      {(yamlOutput.length / 1024).toFixed(1)}KB
                    </Badge>
                  )}
                </Text>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip label="Copy YAML" openDelay={500}>
                    <IconButton
                      aria-label="Copy YAML"
                      icon={<CopyIcon />}
                      onClick={copyToClipboard}
                    />
                  </Tooltip>
                  <Tooltip label="Download YAML" openDelay={500}>
                    <IconButton
                      aria-label="Download YAML"
                      icon={<DownloadIcon />}
                      onClick={downloadYaml}
                    />
                  </Tooltip>
                </ButtonGroup>
              </HStack>
              <ResizableEditor
                value={yamlOutput}
                onChange={() => {}}
                readOnly
                language="yaml"
              />
            </VStack>
          </CardBody>
        </Card>
      )}

      <Box>
        <Text fontSize="sm" color="gray.500">
          <Text as="span" fontWeight="bold">
            Note:
          </Text>{" "}
          The converter:
        </Text>
        <VStack align="start" mt={2} spacing={1}>
          <Text fontSize="sm">• Preserves data types and structure</Text>
          <Text fontSize="sm">• Handles nested objects and arrays</Text>
          <Text fontSize="sm">• Properly escapes special characters</Text>
          <Text fontSize="sm">• Supports multiline strings</Text>
          <Text fontSize="sm">• Maintains proper YAML syntax</Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default JsonToYaml;
