import {
  Box,
  ChakraProvider,
  Container,
  Flex,
  Heading,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import jsonToolsIcon from "./assets/json_tools.png";
import JsonComparator from "./components/JsonComparator";
import JsonFormatter from "./components/JsonFormatter";
import JsonValidator from "./components/JsonValidator";
import theme from "./theme";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

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
    const tabNames = ["Format JSON", "Validate JSON", "Compare JSON"];
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
                  Format, Validate, and View JSON with ease
                </Text>
              </Box>
            </Flex>
          </Flex>
        </Box>

        <Container maxW="container.xl" pb={8} px={4}>
          <Tabs
            variant="unstyled"
            colorScheme="blue"
            size={{ base: "md", lg: "lg" }}
            isLazy
            onChange={handleTabChange}
          >
            <TabList
              mb={6}
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
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <JsonFormatter />
              </TabPanel>
              <TabPanel px={0}>
                <JsonValidator />
              </TabPanel>
              <TabPanel px={0}>
                <JsonComparator />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
