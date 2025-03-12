import { CopyIcon, DownloadIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  Badge,
  ButtonGroup,
  Card,
  CardBody,
  HStack,
  IconButton,
  Text,
  Tooltip,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ResizableEditor from "./ResizableEditor";

const JsonValidator = () => {
  const [input, setInput] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    error?: string;
    line?: number;
    column?: number;
  }>({ isValid: true });
  const toast = useToast();

  const editorBg = useColorModeValue("white", "gray.800");
  const successBg = useColorModeValue("green.50", "rgba(154, 230, 180, 0.16)");
  const errorBg = useColorModeValue("red.50", "rgba(254, 178, 178, 0.16)");

  useEffect(() => {
    validateJson(input);
  }, [input]);

  const validateJson = (jsonString: string) => {
    if (!jsonString.trim()) {
      setValidationResult({ isValid: true });
      return;
    }

    try {
      JSON.parse(jsonString);
      setValidationResult({ isValid: true });
    } catch (error) {
      if (error instanceof Error) {
        const match = error.message.match(/at position (\d+)/);
        if (match) {
          const position = parseInt(match[1]);
          const lines = jsonString.slice(0, position).split("\n");
          const line = lines.length;
          const column = lines[lines.length - 1].length + 1;

          setValidationResult({
            isValid: false,
            error: error.message,
            line,
            column,
          });
        } else {
          setValidationResult({
            isValid: false,
            error: error.message,
          });
        }
      }
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
      a.download = "validated.json";
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
    setValidationResult({ isValid: true });
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

      {!validationResult.isValid && (
        <Card variant="outline" bg={errorBg}>
          <CardBody>
            <Text
              color="red.600"
              fontWeight="bold"
              fontSize={{ base: "md", lg: "lg" }}
            >
              Error at line {validationResult.line}, column{" "}
              {validationResult.column}:
            </Text>
            <Text color="red.600" fontSize={{ base: "sm", md: "md" }}>
              {validationResult.error}
            </Text>
          </CardBody>
        </Card>
      )}

      {validationResult.isValid && input.trim() && (
        <Card variant="outline" bg={successBg}>
          <CardBody>
            <Text
              color="green.600"
              fontWeight="bold"
              fontSize={{ base: "md", lg: "lg" }}
            >
              Valid JSON ✓
            </Text>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default JsonValidator;
