import {
  ChakraProvider,
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Box,
  Flex,
} from "@chakra-ui/react";
import JsonComparator from "./components/JsonComparator";
import JsonFormatter from "./components/JsonFormatter";
import JsonValidator from "./components/JsonValidator";
import theme from "./theme";

function App() {
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
            <Box textAlign={{ base: "center", sm: "left" }}>
              <Heading
                as="h1"
                size={{ base: "md", sm: "lg" }}
                bgGradient="linear(to-r, blue.400, teal.400)"
                bgClip="text"
              >
                JSON Tools
              </Heading>
              <Text mt={1} color="gray.500" fontSize="sm">
                Compare, Format, and Validate JSON with ease
              </Text>
            </Box>
          </Flex>
        </Box>

        <Container maxW="container.xl" pb={8} px={4}>
          <Tabs
            variant="unstyled"
            colorScheme="blue"
            size={{ base: "md", lg: "lg" }}
            isLazy
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
                  color: "blue.600",
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
                  color: "blue.600",
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
                  color: "blue.600",
                  bg: "blue.50",
                  fontWeight: "semibold",
                }}
                _hover={{
                  bg: "gray.50",
                }}
              >
                Validate JSON
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <JsonComparator />
              </TabPanel>
              <TabPanel px={0}>
                <JsonFormatter />
              </TabPanel>
              <TabPanel px={0}>
                <JsonValidator />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
    </ChakraProvider>
  );
}

export default App;
