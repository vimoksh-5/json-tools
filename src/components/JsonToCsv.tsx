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

const JsonToCsv = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [csvOutput, setCsvOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const toast = useToast();
  const editorBg = useColorModeValue("white", "gray.800");

  const convertToCSV = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const array = Array.isArray(jsonData) ? jsonData : [jsonData];

      if (array.length === 0) {
        throw new Error("JSON data is empty");
      }

      const headers = Object.keys(array[0]);
      const csvRows = [headers.join(delimiter)];

      for (const item of array) {
        const row = headers.map((header) => {
          const value = item[header];
          return typeof value === "string" && value.includes(delimiter)
            ? `"${value}"`
            : value;
        });
        csvRows.push(row.join(delimiter));
      }

      const csvContent = csvRows.join("\n");
      setCsvOutput(csvContent);
      toast({
        title: "Conversion successful",
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
      await navigator.clipboard.writeText(csvOutput);
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

  const downloadCsv = () => {
    downloadFile(csvOutput, "converted.csv", "text/csv", toast);
  };

  const clearEditor = () => {
    setJsonInput("");
    setCsvOutput("");
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
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          width={{ base: "full", sm: "200px" }}
          size={{ base: "md", lg: "lg" }}
        >
          <option value=",">Comma (,)</option>
          <option value=";">Semicolon (;)</option>
          <option value="\t">Tab</option>
        </Select>
        <Button
          bg="#004aad"
          color="white"
          _hover={{ bg: "#003c8a" }}
          size={{ base: "md", lg: "lg" }}
          onClick={convertToCSV}
          flexGrow={1}
          leftIcon={<ArrowRightIcon />}
          minW={{ base: "full", sm: "auto" }}
        >
          Convert to CSV
        </Button>
      </HStack>

      {csvOutput && (
        <Card variant="outline" bg={editorBg}>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <HStack
                justify="space-between"
                flexWrap={{ base: "wrap", sm: "nowrap" }}
                gap={2}
              >
                <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
                  CSV Output
                  {csvOutput && (
                    <Badge ml={2} colorScheme="blue">
                      {(csvOutput.length / 1024).toFixed(1)}KB
                    </Badge>
                  )}
                </Text>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip label="Copy CSV" openDelay={500}>
                    <IconButton
                      aria-label="Copy CSV"
                      icon={<CopyIcon />}
                      onClick={copyToClipboard}
                    />
                  </Tooltip>
                  <Tooltip label="Download CSV" openDelay={500}>
                    <IconButton
                      aria-label="Download CSV"
                      icon={<DownloadIcon />}
                      onClick={downloadCsv}
                    />
                  </Tooltip>
                </ButtonGroup>
              </HStack>
              <ResizableEditor
                value={csvOutput}
                onChange={() => {}}
                readOnly
                language="plaintext"
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
          This converter works best with:
        </Text>
        <VStack align="start" mt={2} spacing={1}>
          <Text fontSize="sm">• Arrays of objects</Text>
          <Text fontSize="sm">
            • Single objects (will be converted to single-row CSV)
          </Text>
          <Text fontSize="sm">• Nested objects (will be flattened)</Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default JsonToCsv;
