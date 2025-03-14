import {
  ArrowRightIcon,
  CopyIcon,
  DownloadIcon,
  RepeatIcon,
  SearchIcon,
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
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useState } from "react";
import ResizableEditor from "./ResizableEditor";

const JsonPathFinder = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [pathInput, setPathInput] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const toast = useToast();
  const editorBg = useColorModeValue("white", "gray.800");

  const findValue = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const path = pathInput.trim();

      if (!path) {
        throw new Error("Please enter a JSONPath expression");
      }

      // Simple path evaluation (can be enhanced with a proper JSONPath library)
      const pathParts = path.split(".");
      let current = jsonData;

      for (const part of pathParts) {
        if (part === "*") {
          if (!Array.isArray(current)) {
            throw new Error("Cannot use * on non-array value");
          }
          current = current.flatMap((item) => item);
        } else {
          current = current[part];
          if (current === undefined) {
            throw new Error(`Path "${part}" not found`);
          }
        }
      }

      setResults(Array.isArray(current) ? current : [current]);
      toast({
        title: "Value found",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid input",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const generateSuggestions = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const paths: string[] = [];

      const traverse = (obj: any, currentPath: string = "") => {
        if (typeof obj !== "object" || obj === null) {
          paths.push(currentPath);
          return;
        }

        if (Array.isArray(obj)) {
          paths.push(`${currentPath}[*]`);
          obj.forEach((item, index) => {
            traverse(item, `${currentPath}[${index}]`);
          });
        } else {
          Object.keys(obj).forEach((key) => {
            traverse(obj[key], currentPath ? `${currentPath}.${key}` : key);
          });
        }
      };

      traverse(jsonData);
      setSuggestions(paths);
    } catch (error) {
      // Ignore errors when generating suggestions
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

  const downloadResults = () => {
    try {
      const blob = new Blob([JSON.stringify(results, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "path-results.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Failed to download",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const clearEditor = () => {
    setJsonInput("");
    setPathInput("");
    setResults([]);
    setSuggestions([]);
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
              onChange={(value) => {
                setJsonInput(value || "");
                generateSuggestions();
              }}
            />
          </VStack>
        </CardBody>
      </Card>

      <HStack spacing={4} flexWrap="wrap">
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            value={pathInput}
            onChange={(e) => setPathInput(e.target.value)}
            placeholder="Enter JSONPath (e.g., users[*].name)"
            fontFamily="monospace"
            size={{ base: "md", lg: "lg" }}
          />
        </InputGroup>
        <Button
          bg="#004aad"
          color="white"
          _hover={{ bg: "#003c8a" }}
          size={{ base: "md", lg: "lg" }}
          onClick={findValue}
          flexGrow={1}
          leftIcon={<ArrowRightIcon />}
          minW={{ base: "full", sm: "auto" }}
        >
          Find Value
        </Button>
      </HStack>

      {suggestions.length > 0 && (
        <Card variant="outline" bg={editorBg}>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
                Available Paths
              </Text>
              <Wrap spacing={2}>
                {suggestions.map((path, index) => (
                  <WrapItem key={index}>
                    <Badge
                      cursor="pointer"
                      onClick={() => setPathInput(path)}
                      _hover={{ bg: "blue.100" }}
                    >
                      {path}
                    </Badge>
                  </WrapItem>
                ))}
              </Wrap>
            </VStack>
          </CardBody>
        </Card>
      )}

      {results.length > 0 && (
        <Card variant="outline" bg={editorBg}>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <HStack
                justify="space-between"
                flexWrap={{ base: "wrap", sm: "nowrap" }}
                gap={2}
              >
                <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
                  Results
                  {results && (
                    <Badge ml={2} colorScheme="blue">
                      {results.length} items
                    </Badge>
                  )}
                </Text>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip label="Copy Results" openDelay={500}>
                    <IconButton
                      aria-label="Copy Results"
                      icon={<CopyIcon />}
                      onClick={() =>
                        copyToClipboard(JSON.stringify(results, null, 2))
                      }
                    />
                  </Tooltip>
                  <Tooltip label="Download Results" openDelay={500}>
                    <IconButton
                      aria-label="Download Results"
                      icon={<DownloadIcon />}
                      onClick={downloadResults}
                    />
                  </Tooltip>
                </ButtonGroup>
              </HStack>
              <ResizableEditor
                value={JSON.stringify(results, null, 2)}
                onChange={() => {}}
                readOnly
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
          JSONPath supports:
        </Text>
        <VStack align="start" mt={2} spacing={1}>
          <Text fontSize="sm">• Dot notation: users.name</Text>
          <Text fontSize="sm">• Array access: users[0].name</Text>
          <Text fontSize="sm">• Wildcard: users[*].name</Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default JsonPathFinder;
