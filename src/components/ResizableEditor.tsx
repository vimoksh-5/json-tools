import { Box, Icon, useColorModeValue } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { BsGripHorizontal } from "react-icons/bs";

interface ResizableEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  minHeight?: number;
  maxHeight?: number;
}

const ResizableEditor = ({
  value,
  onChange,
  minHeight = 200,
  maxHeight = 800,
}: ResizableEditorProps) => {
  const [height, setHeight] = useState(350);

  const startResize = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();

    const startSize = height;
    const startPosition = mouseDownEvent.pageY;

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      const newHeight = startSize + (mouseMoveEvent.pageY - startPosition);
      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setHeight(newHeight);
      }
    }

    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp);
  };

  return (
    <Box position="relative" borderRadius="md" overflow="hidden">
      <Editor
        height={`${height}px`}
        defaultLanguage="json"
        value={value}
        onChange={onChange}
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
        onMouseDown={startResize}
        onDoubleClick={() => setHeight(350)}
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
  );
};

export default ResizableEditor;
