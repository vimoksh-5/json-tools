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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ResizableEditor from "./ResizableEditor";

const JsonMinifier = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [minifiedOutput, setMinifiedOutput] = useState("");
  const toast = useToast();
  const editorBg = useColorModeValue("white", "gray.800");

  const minifyJson = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const minified = JSON.stringify(jsonData);
      setMinifiedOutput(minified);
      toast({
        title: "JSON minified successfully",
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
      await navigator.clipboard.writeText(minifiedOutput);
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

  const downloadMinified = () => {
    try {
      const blob = new Blob([minifiedOutput], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "minified.json";
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
    setMinifiedOutput("");
    toast({
      title: "Editor cleared",
      status: "info",
      duration: 1000,
      isClosable: true,
    });
  };

  const getSizeInBytes = (str: string) => {
    return new TextEncoder().encode(str).length;
  };

  const getSizeInKB = (bytes: number) => {
    return (bytes / 1024).toFixed(2);
  };

  const getCompressionRatio = (original: string, minified: string) => {
    const originalSize = getSizeInBytes(original);
    const minifiedSize = getSizeInBytes(minified);
    return (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);
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

      <Button
        bg="#004aad"
        color="white"
        _hover={{ bg: "#003c8a" }}
        size={{ base: "md", lg: "lg" }}
        onClick={minifyJson}
        leftIcon={<ArrowRightIcon />}
      >
        Minify JSON
      </Button>

      {minifiedOutput && (
        <Card variant="outline" bg={editorBg}>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <HStack
                justify="space-between"
                flexWrap={{ base: "wrap", sm: "nowrap" }}
                gap={2}
              >
                <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
                  Minified JSON
                  {minifiedOutput && (
                    <Badge ml={2} colorScheme="blue">
                      {(minifiedOutput.length / 1024).toFixed(1)}KB
                    </Badge>
                  )}
                </Text>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip label="Copy Minified JSON" openDelay={500}>
                    <IconButton
                      aria-label="Copy Minified JSON"
                      icon={<CopyIcon />}
                      onClick={copyToClipboard}
                    />
                  </Tooltip>
                  <Tooltip label="Download Minified JSON" openDelay={500}>
                    <IconButton
                      aria-label="Download Minified JSON"
                      icon={<DownloadIcon />}
                      onClick={downloadMinified}
                    />
                  </Tooltip>
                </ButtonGroup>
              </HStack>
              <ResizableEditor
                value={minifiedOutput}
                onChange={() => {}}
                readOnly
              />

              <HStack spacing={4} mt={4}>
                <Stat>
                  <StatLabel>Original Size</StatLabel>
                  <StatNumber>
                    {getSizeInKB(getSizeInBytes(jsonInput))} KB
                  </StatNumber>
                  <StatHelpText>{getSizeInBytes(jsonInput)} bytes</StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Minified Size</StatLabel>
                  <StatNumber>
                    {getSizeInKB(getSizeInBytes(minifiedOutput))} KB
                  </StatNumber>
                  <StatHelpText>
                    {getSizeInBytes(minifiedOutput)} bytes
                  </StatHelpText>
                </Stat>
                <Stat>
                  <StatLabel>Compression</StatLabel>
                  <StatNumber>
                    {getCompressionRatio(jsonInput, minifiedOutput)}%
                  </StatNumber>
                  <StatHelpText>Size reduction</StatHelpText>
                </Stat>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      <Box>
        <Text fontSize="sm" color="gray.500">
          <Text as="span" fontWeight="bold">
            Note:
          </Text>{" "}
          Minification:
        </Text>
        <VStack align="start" mt={2} spacing={1}>
          <Text fontSize="sm">• Removes all whitespace and newlines</Text>
          <Text fontSize="sm">• Preserves all data and structure</Text>
          <Text fontSize="sm">• Validates JSON during minification</Text>
          <Text fontSize="sm">• Shows size reduction statistics</Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default JsonMinifier;
