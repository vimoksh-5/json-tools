import { UseToastOptions } from "@chakra-ui/react";

export const downloadFile = (
  content: string,
  filename: string,
  type: string,
  toast: (options: UseToastOptions) => void
) => {
  try {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
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

export const getFileType = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "json":
      return "application/json";
    case "csv":
      return "text/csv";
    case "yaml":
    case "yml":
      return "text/yaml";
    case "txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
};
