import { CopyIcon, DownloadIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Badge,
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

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [indentSize, setIndentSize] = useState("2");
  const toast = useToast();
  const editorBg = useColorModeValue("white", "gray.800");

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, parseInt(indentSize));
      setInput(formatted);
      toast({
        title: "JSON Formatted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description:
          error instanceof Error ? error.message : "Please enter valid JSON",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(input);
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

  const downloadJson = () => {
    try {
      const blob = new Blob([input], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "formatted.json";
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
    setInput("");
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
                {input && (
                  <Badge ml={2} colorScheme="blue">
                    {(input.length / 1024).toFixed(1)}KB
                  </Badge>
                )}
              </Text>
              <ButtonGroup size="sm" isAttached variant="outline">
                <Tooltip label="Copy JSON" openDelay={500}>
                  <IconButton
                    aria-label="Copy JSON"
                    icon={<CopyIcon />}
                    onClick={copyToClipboard}
                  />
                </Tooltip>
                <Tooltip label="Download JSON" openDelay={500}>
                  <IconButton
                    aria-label="Download JSON"
                    icon={<DownloadIcon />}
                    onClick={downloadJson}
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
              value={input}
              onChange={(value) => setInput(value || "")}
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
          <option value="8">8 spaces</option>
        </Select>
        <Button
          bg="#004aad"
          color="white"
          _hover={{ bg: "#003c8a" }}
          size={{ base: "md", lg: "lg" }}
          onClick={formatJson}
          flexGrow={1}
          leftIcon={<RepeatIcon />}
          minW={{ base: "full", sm: "auto" }}
        >
          Format JSON
        </Button>
      </HStack>
    </VStack>
  );
};

export default JsonFormatter;
