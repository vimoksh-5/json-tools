import {
  Box,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Image,
  Select,
  Tab,
  TabList,
  Tabs,
  Text
} from "@chakra-ui/react";
import { track } from "@vercel/analytics";
import { useEffect, useState } from "react";
import jsonToolsIcon from "./assets/json_tools.png";
import JsonComparator from "./components/JsonComparator";
import JsonFormatter from "./components/JsonFormatter";
import JsonMinifier from "./components/JsonMinifier";
import JsonPathFinder from "./components/JsonPathFinder";
import JsonSchemaGenerator from "./components/JsonSchemaGenerator";
import JsonToBase64 from "./components/JsonToBase64";
import JsonToCsv from "./components/JsonToCsv";
import JsonToYaml from "./components/JsonToYaml";
import JsonTreeViewer from "./components/JsonTreeViewer";
import JsonValidator from "./components/JsonValidator";
import theme from "./theme";

function App() {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    // Log when the app initializes
    console.log("App initialized");
    track("app_initialized", {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
    });
  }, []);

  const handleTabChange = (index: number) => {
    const tabNames = [
      "Format JSON",
      "Validate JSON",
      "Compare JSON",
      "JSON to CSV",
      "JSON Path Finder",
      "Schema Generator",
      "JSON Minifier",
      "JSON to YAML",
      "Tree Viewer",
      "Base64 Converter",
    ];
    setActiveTab(index);
    track("tab_changed", {
      from: tabNames[activeTab],
      to: tabNames[index],
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <ChakraProvider theme={theme}>
      <Box minH="100vh" bg="gray.50">
        <Box bg="white" py={4} px={{ base: 4, sm: 8 }} boxShadow="sm" mb={8}>
          <Flex
            justify="space-between"
            align="center"
            maxW="container.xl"
            mx="auto"
            direction={{ base: "column", sm: "row" }}
            gap={4}
          >
            <Flex
              textAlign={{ base: "center", sm: "left" }}
              align="center"
              gap={3}
            >
              <Image src={jsonToolsIcon} alt="JSON Tools Logo" boxSize="60px" />
              <Box>
                <Heading
                  as="h1"
                  size={{ base: "md", sm: "lg" }}
                  bgGradient={`linear(to-r, #004aad, #004aad)`}
                  bgClip="text"
                >
                  JSON Tools
                </Heading>
                <Text mt={1} color="gray.500" fontSize="sm">
                  Format, Validate, and Transform JSON with ease
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Container maxW="container.xl" pb={8} px={4}>
          <Flex direction="column" gap={6}>
            {/* Tool Selection Box */}
            <Box bg="white" p={4} borderRadius="xl" boxShadow="sm">
              <Select
                value={activeTab}
                onChange={(e) => handleTabChange(Number(e.target.value))}
                size={{ base: "md", lg: "lg" }}
                mb={6}
                display={{ base: "block", md: "none" }}
              >
                <option value="0">Format JSON</option>
                <option value="1">Validate JSON</option>
                <option value="2">Compare JSON</option>
                <option value="3">JSON to CSV</option>
                <option value="4">Path Finder</option>
                <option value="5">Schema Generator</option>
                <option value="6">Minifier</option>
                <option value="7">JSON to YAML</option>
                <option value="8">Tree Viewer</option>
                <option value="9">Base64</option>
              </Select>

              <Tabs
                variant="unstyled"
                colorScheme="blue"
                size={{ base: "md", lg: "lg" }}
                isLazy
                onChange={handleTabChange}
                index={activeTab}
                display={{ base: "none", md: "block" }}
              >
                <TabList
                  gap={3}
                  bg="white"
                  p={2}
                  borderRadius="xl"
                  boxShadow="sm"
                  overflowX="auto"
                  flexWrap={{ base: "nowrap", md: "wrap" }}
                  css={{
                    "&::-webkit-scrollbar": {
                      display: "none",
                    },
                    scrollbarWidth: "none",
                  }}
                >
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    Format JSON
                  </Tab>
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    Validate JSON
                  </Tab>
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    Compare JSON
                  </Tab>
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    JSON to CSV
                  </Tab>
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    Path Finder
                  </Tab>
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    Schema Generator
                  </Tab>
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    Minifier
                  </Tab>
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    JSON to YAML
                  </Tab>
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    Tree Viewer
                  </Tab>
                  <Tab
                    py={2}
                    px={4}
                    borderRadius="lg"
                    fontWeight="medium"
                    color="gray.600"
                    transition="all 0.2s"
                    whiteSpace="nowrap"
                    minW={{ base: "auto", md: "120px" }}
                    _selected={{
                      color: "#004aad",
                      bg: "blue.50",
                      fontWeight: "semibold",
                    }}
                    _hover={{
                      bg: "gray.50",
                    }}
                  >
                    Base64
                  </Tab>
                </TabList>
              </Tabs>
            </Box>

            {/* Content Viewer Box */}
            <Box bg="white" p={4} borderRadius="xl" boxShadow="sm">
              {activeTab === 0 && <JsonFormatter />}
              {activeTab === 1 && <JsonValidator />}
              {activeTab === 2 && <JsonComparator />}
              {activeTab === 3 && <JsonToCsv />}
              {activeTab === 4 && <JsonPathFinder />}
              {activeTab === 5 && <JsonSchemaGenerator />}
              {activeTab === 6 && <JsonMinifier />}
              {activeTab === 7 && <JsonToYaml />}
              {activeTab === 8 && <JsonTreeViewer />}
              {activeTab === 9 && <JsonToBase64 />}
            </Box>
          </Flex>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
