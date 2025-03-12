import {
  Box,
  Button,
  Flex,
  Text,
  useToast,
  VStack,
  useColorModeValue,
  ButtonGroup,
  IconButton,
  Tooltip,
  Card,
  CardBody,
  Badge,
  HStack,
} from "@chakra-ui/react";
import {
  CopyIcon,
  DownloadIcon,
  RepeatIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import ResizableEditor from "./ResizableEditor";
import { BsGripHorizontal } from "react-icons/bs";
import { Icon } from "@chakra-ui/react";

const JsonComparator = () => {
  const [leftJson, setLeftJson] = useState("");
  const [rightJson, setRightJson] = useState("");
  const [differences, setDifferences] = useState<string[]>([]);
  const [editorHeight, setEditorHeight] = useState(350);
  const toast = useToast();
  const editorBg = useColorModeValue("white", "gray.800");
  const diffBg = useColorModeValue("red.50", "rgba(254, 178, 178, 0.16)");

  const compareJson = () => {
    try {
      const left = JSON.parse(leftJson);
      const right = JSON.parse(rightJson);
      const diffs = findDifferences(left, right);
      setDifferences(diffs);

      if (diffs.length === 0) {
        toast({
          title: "JSONs are identical",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description:
          error instanceof Error
            ? error.message
            : "Please ensure both inputs are valid JSON",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const findDifferences = (
    obj1: any,
    obj2: any,
    path: string = ""
  ): string[] => {
    const differences: string[] = [];

    if (typeof obj1 !== typeof obj2) {
      differences.push(
        `Type mismatch at ${path || "root"}: ${typeof obj1} vs ${typeof obj2}`
      );
      return differences;
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        differences.push(
          `Array length mismatch at ${path || "root"}: ${obj1.length} vs ${obj2.length}`
        );
      }
      const maxLength = Math.max(obj1.length, obj2.length);
      for (let i = 0; i < maxLength; i++) {
        differences.push(...findDifferences(obj1[i], obj2[i], `${path}[${i}]`));
      }
      return differences;
    }

    if (typeof obj1 === "object" && obj1 !== null && obj2 !== null) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      const allKeys = new Set([...keys1, ...keys2]);

      allKeys.forEach((key) => {
        const currentPath = path ? `${path}.${key}` : key;
        if (!(key in obj1)) {
          differences.push(`Key "${currentPath}" missing in first object`);
        } else if (!(key in obj2)) {
          differences.push(`Key "${currentPath}" missing in second object`);
        } else {
          differences.push(
            ...findDifferences(obj1[key], obj2[key], currentPath)
          );
        }
      });

      return differences;
    }

    if (obj1 !== obj2) {
      differences.push(
        `Value mismatch at ${path || "root"}: ${JSON.stringify(obj1)} vs ${JSON.stringify(obj2)}`
      );
    }

    return differences;
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
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

  const downloadJson = (content: string, side: string) => {
    try {
      const blob = new Blob([content], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${side}-json.json`;
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

  const clearEditor = (side: "left" | "right" | "both") => {
    if (side === "left" || side === "both") setLeftJson("");
    if (side === "right" || side === "both") setRightJson("");
    setDifferences([]);
    toast({
      title: `Editor${side === "both" ? "s" : ""} cleared`,
      status: "info",
      duration: 1000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={{ base: 4, md: 6 }} align="stretch">
      <Flex gap={{ base: 4, md: 6 }} direction={{ base: "column", lg: "row" }}>
        <Card flex={1} variant="outline" bg={editorBg}>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <HStack
                justify="space-between"
                flexWrap={{ base: "wrap", sm: "nowrap" }}
                gap={2}
              >
                <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
                  First JSON
                  {leftJson && (
                    <Badge ml={2} colorScheme="blue">
                      {(leftJson.length / 1024).toFixed(1)}KB
                    </Badge>
                  )}
                </Text>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip label="Copy JSON" openDelay={500}>
                    <IconButton
                      aria-label="Copy First JSON"
                      icon={<CopyIcon />}
                      onClick={() => copyToClipboard(leftJson)}
                    />
                  </Tooltip>
                  <Tooltip label="Download JSON" openDelay={500}>
                    <IconButton
                      aria-label="Download First JSON"
                      icon={<DownloadIcon />}
                      onClick={() => downloadJson(leftJson, "first")}
                    />
                  </Tooltip>
                  <Tooltip label="Clear Editor" openDelay={500}>
                    <IconButton
                      aria-label="Clear First Editor"
                      icon={<RepeatIcon />}
                      onClick={() => clearEditor("left")}
                    />
                  </Tooltip>
                </ButtonGroup>
              </HStack>
              <Box position="relative">
                <Editor
                  height={`${editorHeight}px`}
                  defaultLanguage="json"
                  value={leftJson}
                  onChange={(value) => setLeftJson(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    formatOnPaste: true,
                    formatOnType: true,
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    wordWrap: "on",
                  }}
                  theme={useColorModeValue("light", "vs-dark")}
                />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        <Card flex={1} variant="outline" bg={editorBg}>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <HStack
                justify="space-between"
                flexWrap={{ base: "wrap", sm: "nowrap" }}
                gap={2}
              >
                <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
                  Second JSON
                  {rightJson && (
                    <Badge ml={2} colorScheme="blue">
                      {(rightJson.length / 1024).toFixed(1)}KB
                    </Badge>
                  )}
                </Text>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip label="Copy JSON" openDelay={500}>
                    <IconButton
                      aria-label="Copy Second JSON"
                      icon={<CopyIcon />}
                      onClick={() => copyToClipboard(rightJson)}
                    />
                  </Tooltip>
                  <Tooltip label="Download JSON" openDelay={500}>
                    <IconButton
                      aria-label="Download Second JSON"
                      icon={<DownloadIcon />}
                      onClick={() => downloadJson(rightJson, "second")}
                    />
                  </Tooltip>
                  <Tooltip label="Clear Editor" openDelay={500}>
                    <IconButton
                      aria-label="Clear Second Editor"
                      icon={<RepeatIcon />}
                      onClick={() => clearEditor("right")}
                    />
                  </Tooltip>
                </ButtonGroup>
              </HStack>
              <Box position="relative">
                <Editor
                  height={`${editorHeight}px`}
                  defaultLanguage="json"
                  value={rightJson}
                  onChange={(value) => setRightJson(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    formatOnPaste: true,
                    formatOnType: true,
                    scrollBeyondLastLine: false,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                    cursorSmoothCaretAnimation: "on",
                    wordWrap: "on",
                  }}
                  theme={useColorModeValue("light", "vs-dark")}
                />
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </Flex>

      <Box position="relative" width="100%" height="10px" mt="-6" mb="2">
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          height="10px"
          bg="transparent"
          cursor="row-resize"
          zIndex={2}
          _before={{
            content: '""',
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: "4px",
            transform: "translateY(-50%)",
            bg: "transparent",
            transition: "background-color 0.2s",
          }}
          _hover={{
            _before: {
              bg: "blue.100",
            },
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            const startSize = editorHeight;
            const startPosition = e.pageY;

            function onMouseMove(mouseMoveEvent: MouseEvent) {
              const newHeight =
                startSize + (mouseMoveEvent.pageY - startPosition);
              if (newHeight >= 200 && newHeight <= 800) {
                setEditorHeight(newHeight);
              }
            }

            function onMouseUp() {
              document.body.removeEventListener("mousemove", onMouseMove);
              document.body.removeEventListener("mouseup", onMouseUp);
            }

            document.body.addEventListener("mousemove", onMouseMove);
            document.body.addEventListener("mouseup", onMouseUp);
          }}
          onDoubleClick={() => setEditorHeight(350)}
        >
          <Icon
            as={BsGripHorizontal}
            color="gray.500"
            boxSize={3}
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            pointerEvents="none"
          />
        </Box>
      </Box>

      <Flex gap={4} justify="center" flexWrap="wrap">
        <Button
          colorScheme="blue"
          size={{ base: "md", lg: "lg" }}
          onClick={compareJson}
          leftIcon={<ArrowRightIcon />}
          minW={{ base: "full", sm: "auto" }}
        >
          Compare JSON
        </Button>
        <Button
          variant="outline"
          size={{ base: "md", lg: "lg" }}
          onClick={() => clearEditor("both")}
          leftIcon={<RepeatIcon />}
          minW={{ base: "full", sm: "auto" }}
        >
          Clear Both
        </Button>
      </Flex>

      {differences.length > 0 && (
        <Card variant="outline" bg={diffBg}>
          <CardBody>
            <Text fontWeight="bold" mb={2} fontSize={{ base: "md", lg: "lg" }}>
              Differences Found ({differences.length}):
            </Text>
            <VStack align="stretch" spacing={2}>
              {differences.map((diff, index) => (
                <Text
                  key={index}
                  color="red.600"
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {diff}
                </Text>
              ))}
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  );
};

export default JsonComparator;
