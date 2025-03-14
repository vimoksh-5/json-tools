import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
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
} from "@chakra-ui/react";
import { useState } from "react";
import ResizableEditor from "./ResizableEditor";

interface TreeNode {
  key: string;
  value: any;
  type: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  isVisible?: boolean;
}

const JsonTreeViewer = () => {
  const [jsonInput, setJsonInput] = useState("");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();
  const editorBg = useColorModeValue("white", "gray.800");

  const createTreeNode = (key: string, value: any): TreeNode => {
    const type = Array.isArray(value)
      ? "array"
      : value === null
        ? "null"
        : typeof value;
    const node: TreeNode = {
      key,
      value,
      type,
      isExpanded: true,
      isVisible: true,
    };

    if (type === "object" || type === "array") {
      node.children = Object.entries(value).map(([k, v]) =>
        createTreeNode(k, v)
      );
    }

    return node;
  };

  const buildTree = () => {
    try {
      const jsonData = JSON.parse(jsonInput);
      const tree = Object.entries(jsonData).map(([key, value]) =>
        createTreeNode(key, value)
      );
      setTreeData(tree);
      toast({
        title: "Tree built successfully",
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

  const toggleNode = (node: TreeNode) => {
    node.isExpanded = !node.isExpanded;
    setTreeData([...treeData]);
  };

  const filterTree = (nodes: TreeNode[], term: string): boolean => {
    let hasVisibleChildren = false;
    nodes.forEach((node) => {
      if (term === "") {
        node.isVisible = true;
        if (node.children) {
          filterTree(node.children, term);
        }
      } else {
        const matchesSearch =
          node.key.toLowerCase().includes(term.toLowerCase()) ||
          (typeof node.value === "string" &&
            node.value.toLowerCase().includes(term.toLowerCase()));
        node.isVisible = matchesSearch;
        if (node.children) {
          const hasVisibleChildren = filterTree(node.children, term);
          node.isVisible = node.isVisible || hasVisibleChildren;
        }
      }
      if (node.isVisible) hasVisibleChildren = true;
    });
    return hasVisibleChildren;
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterTree(treeData, term);
    setTreeData([...treeData]);
  };

  const renderValue = (value: any, type: string) => {
    switch (type) {
      case "string":
        return <Text color="green.500">"{value}"</Text>;
      case "number":
        return <Text color="blue.500">{value}</Text>;
      case "boolean":
        return <Text color="purple.500">{value.toString()}</Text>;
      case "null":
        return <Text color="gray.500">null</Text>;
      case "array":
        return <Text color="orange.500">[{value.length} items]</Text>;
      case "object":
        return <Text color="teal.500">{"{...}"}</Text>;
      default:
        return <Text>{String(value)}</Text>;
    }
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    if (!node.isVisible) return null;

    const paddingLeft = `${level * 20}px`;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <Box key={node.key} pl={paddingLeft}>
        <HStack spacing={1} align="center">
          {hasChildren && (
            <IconButton
              aria-label={node.isExpanded ? "Collapse" : "Expand"}
              icon={
                node.isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />
              }
              size="xs"
              variant="ghost"
              onClick={() => toggleNode(node)}
              minW="20px"
              p={0}
            />
          )}
          <Text fontWeight="bold">{node.key}:</Text>
          {hasChildren ? (
            <Text color="gray.500">({node.children.length} items)</Text>
          ) : (
            renderValue(node.value, node.type)
          )}
        </HStack>
        {node.isExpanded && node.children && (
          <VStack align="start" spacing={1}>
            {node.children.map((child) => renderTreeNode(child, level + 1))}
          </VStack>
        )}
      </Box>
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonInput);
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

  const downloadTree = () => {
    try {
      const blob = new Blob([jsonInput], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tree-data.json";
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
    setTreeData([]);
    setSearchTerm("");
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
                    onClick={copyToClipboard}
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
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search in tree..."
            size={{ base: "md", lg: "lg" }}
          />
        </InputGroup>
        <Button
          bg="#004aad"
          color="white"
          _hover={{ bg: "#003c8a" }}
          size={{ base: "md", lg: "lg" }}
          onClick={buildTree}
          flexGrow={1}
          leftIcon={<ArrowRightIcon />}
          minW={{ base: "full", sm: "auto" }}
        >
          Build Tree
        </Button>
      </HStack>

      {treeData.length > 0 && (
        <Card variant="outline" bg={editorBg}>
          <CardBody>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <HStack
                justify="space-between"
                flexWrap={{ base: "wrap", sm: "nowrap" }}
                gap={2}
              >
                <Text fontWeight="bold" fontSize={{ base: "md", lg: "lg" }}>
                  Tree View
                  {treeData && (
                    <Badge ml={2} colorScheme="blue">
                      {treeData.length} root nodes
                    </Badge>
                  )}
                </Text>
                <ButtonGroup size="sm" isAttached variant="outline">
                  <Tooltip label="Download JSON" openDelay={500}>
                    <IconButton
                      aria-label="Download JSON"
                      icon={<DownloadIcon />}
                      onClick={downloadTree}
                    />
                  </Tooltip>
                </ButtonGroup>
              </HStack>
              <Box
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg={useColorModeValue("gray.50", "gray.700")}
                maxH="600px"
                overflowY="auto"
              >
                <VStack align="start" spacing={2}>
                  {treeData.map((node) => renderTreeNode(node))}
                </VStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      )}

      <Box>
        <Text fontSize="sm" color="gray.500">
          <Text as="span" fontWeight="bold">
            Note:
          </Text>{" "}
          Tree Viewer features:
        </Text>
        <VStack align="start" mt={2} spacing={1}>
          <Text fontSize="sm">• Hierarchical structure display</Text>
          <Text fontSize="sm">• Expand/collapse nodes</Text>
          <Text fontSize="sm">• Color-coded value types</Text>
          <Text fontSize="sm">• Search functionality</Text>
          <Text fontSize="sm">• Shows array lengths and object key counts</Text>
        </VStack>
      </Box>
    </VStack>
  );
};

export default JsonTreeViewer;
