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
  Switch,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ResizableEditor from "./ResizableEditor";

const JsonSchemaGenerator = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [schemaOutput, setSchemaOutput] = useState("");
  const [includeExamples, setIncludeExamples] = useState(true);
  const toast = useToast();
  const editorBg = useColorModeValue("white", "gray.800");

  const generateSchema = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const schema = generateJsonSchema(jsonData, includeExamples);
      setSchemaOutput(JSON.stringify(schema, null, 2));
      toast({
        title: "Schema generated successfully",
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

  const generateJsonSchema = (data: any, includeExamples: boolean): any => {
    if (data === null) {
      return { type: "null" };
    }

    if (Array.isArray(data)) {
      const schema: any = {
        type: "array",
        items:
          data.length > 0 ? generateJsonSchema(data[0], includeExamples) : {},
      };
      if (includeExamples) {
        schema.examples = data.slice(0, 2);
      }
      return schema;
    }

    if (typeof data === "object") {
      const schema: any = {
        type: "object",
        properties: {},
        required: [],
      };

      for (const [key, value] of Object.entries(data)) {
        schema.properties[key] = generateJsonSchema(value, includeExamples);
        schema.required.push(key);
      }

      if (includeExamples) {
        schema.examples = [data];
      }

      return schema;
    }

    const schema: any = {
      type: typeof data,
    };

    if (includeExamples) {
      schema.examples = [data];
    }

    return schema;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(schemaOutput);
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

  const downloadSchema = () => {
    try {
      const blob = new Blob([schemaOutput], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "schema.json";
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
    setSchemaOutput("");
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
        <HStack spacing={2}>
          <Switch
            isChecked={includeExamples}
            onChange={(e) => setIncludeExamples(e.target.checked)}
            size={{ base: "md", lg: "lg" }}
          />
          <Text>Include Examples</Text>
        </HStack>
        <Button
          bg="#004aad"
          color="white"
          _hover={{ bg: "#003c8a" }}
          size={{ base: "md", lg: "lg" }}
          onClick={generateSchema}
          flexGrow={1}
          leftIcon={<ArrowRightIcon />}
          minW={{ base: "full", sm: "auto" }}
        >
          Generate Schema
        </Button>
      </HStack>

      {schemaOutput && (
        <Card variant="outline" bg={editorBg}>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <HStack
                justify="space-between"
                flexWrap={{ base: "wrap", sm: "nowrap" }}
                gap={2}
              >
                <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
                  Generated Schema
                  {schemaOutput && (
                    <Badge ml={2} colorScheme="blue">
                      {(schemaOutput.length / 1024).toFixed(1)}KB
                    </Badge>
                  )}
                </Text>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip label="Copy Schema" openDelay={500}>
                    <IconButton
                      aria-label="Copy Schema"
                      icon={<CopyIcon />}
                      onClick={copyToClipboard}
                    />
                  </Tooltip>
                  <Tooltip label="Download Schema" openDelay={500}>
                    <IconButton
                      aria-label="Download Schema"
                      icon={<DownloadIcon />}
                      onClick={downloadSchema}
                    />
                  </Tooltip>
                </ButtonGroup>
              </HStack>
              <ResizableEditor
                value={schemaOutput}
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
          The generated schema includes:
        </Text>
        <VStack align="start" mt={2} spacing={1}>
          <Text fontSize="sm">• Type information for all fields</Text>
          <Text fontSize="sm">• Required fields</Text>
          <Text fontSize="sm">• Example values (if enabled)</Text>
          <Text fontSize="sm">• Nested object and array structures</Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default JsonSchemaGenerator;
