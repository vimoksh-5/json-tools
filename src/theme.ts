import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Card: {
      baseStyle: {
        container: {
          bg: "white",
          borderColor: "gray.200",
        },
      },
    },
    Button: {
      baseStyle: {
        _hover: {
          opacity: 0.8,
        },
      },
    },
    IconButton: {
      baseStyle: {
        _hover: {
          opacity: 0.8,
        },
      },
    },
  },
});

export default theme;
