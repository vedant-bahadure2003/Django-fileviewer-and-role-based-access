"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  Download,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Cloud,
  HardDrive,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { filesAPI, isAuthenticated, clearAuthentication } from "@/lib/api";

interface FileItem {
  id: string;
  name: string;
  filename?: string; // Add this for API compatibility
  size: string;
  lastModified: string;
  type: "local" | "remote";
}

// ✅ Add API response type definitions
interface ApiResponse {
  success: boolean;
  message?: string;
  exists?: boolean;
  files?: FileItem[];
  [key: string]: any;
}

interface FileCheckResponse {
  success: boolean;
  exists: boolean;
  message?: string;
}

interface FileDownloadResponse {
  success: boolean;
  message?: string;
}

export function FileSelector() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [checkingFile, setCheckingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    // ✅ Check authentication before making request
    if (!isAuthenticated()) {
      setError("Please log in to view files");
      toast.error("Authentication required. Please log in.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ Use the improved filesAPI with error handling
      const data = (await filesAPI.listFiles()) as ApiResponse | FileItem[];

      // Handle different response formats
      let filesList: FileItem[] = [];

      if (Array.isArray(data)) {
        filesList = data;
      } else if (data && typeof data === "object" && "files" in data) {
        filesList = data.files || [];
      } else if (data && typeof data === "object") {
        filesList = Object.values(data).filter(
          (item) => item && typeof item === "object" && "id" in item
        ) as FileItem[];
      }

      setFiles(filesList);

      if (filesList.length === 0) {
        toast.info("No files found");
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);

      if (error instanceof Error) {
        setError(error.message);

        // Handle authentication errors
        if (error.message.includes("Authentication")) {
          toast.error("Session expired. Please log in again.");
          // Optionally redirect to login
          // window.location.href = '/login'
        } else if (error.message.includes("permission")) {
          toast.error("You do not have permission to view files");
        } else {
          toast.error(`Failed to fetch files: ${error.message}`);
        }
      } else {
        setError("Failed to fetch files");
        toast.error("Failed to fetch files");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedFileData = files.find((f) => f.id === selectedFile);

  const handleViewFile = async () => {
    if (!selectedFile || !selectedFileData) return;

    // ✅ Check authentication before proceeding
    if (!isAuthenticated()) {
      toast.error("Authentication required");
      return;
    }

    setCheckingFile(true);

    try {
      // ✅ Use filename property or fallback to name
      const filename = selectedFileData.filename || selectedFileData.name;

      if (!filename) {
        throw new Error("Filename not available");
      }

      const data = (await filesAPI.checkFile(filename)) as FileCheckResponse;

      if (data && typeof data === "object" && data.success && data.exists) {
        toast.success("File opened successfully");

        // Try to open file in notepad
        try {
          await filesAPI.openFile(filename);
          toast.success("File opened in text editor");
        } catch (openError) {
          console.error("Failed to open file:", openError);
          toast.info(
            "File is available locally but could not be opened automatically"
          );
        }
      } else {
        setModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to check file:", error);

      if (error instanceof Error) {
        if (error.message.includes("Authentication")) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error(`Failed to check file: ${error.message}`);
        }
      } else {
        toast.error("Failed to check file");
      }
    } finally {
      setCheckingFile(false);
    }
  };

  const handleDownloadFromDrive = async () => {
    if (!selectedFileData) return;

    // ✅ Check authentication before proceeding
    if (!isAuthenticated()) {
      toast.error("Authentication required");
      return;
    }

    setDownloadLoading(true);

    try {
      // ✅ Use filename property or fallback to name
      const filename = selectedFileData.filename || selectedFileData.name;

      if (!filename) {
        throw new Error("Filename not available");
      }

      // ✅ Handle file download with proper response handling
      const response = await filesAPI.downloadFile(filename);

      // Check if response is a Response object (for binary downloads)
      if (response instanceof Response) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create download link
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success("File downloaded successfully");
      } else {
        // Handle JSON response
        const data = response as FileDownloadResponse;

        if (data && typeof data === "object" && data.success) {
          toast.success("File downloaded successfully from Google Drive");
        } else {
          throw new Error(data?.message || "Download failed");
        }
      }

      setModalOpen(false);

      // Update file metadata to show it's now local
      setTimeout(() => {
        fetchFiles();
      }, 1000);
    } catch (error) {
      console.error("Failed to download file:", error);

      if (error instanceof Error) {
        if (error.message.includes("Authentication")) {
          toast.error("Session expired. Please log in again.");
        } else {
          toast.error(`Failed to download file: ${error.message}`);
        }
      } else {
        toast.error("Failed to download file");
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  // ✅ Handle retry functionality
  const handleRetry = () => {
    fetchFiles();
  };

  // ✅ Handle authentication redirect
  const handleLoginRedirect = () => {
    clearAuthentication();
    window.location.href = "/login";
  };

  // ✅ Show loading state
  if (loading && files.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading files...</p>
        </div>
      </div>
    );
  }

  // ✅ Show error state with retry option
  if (error && files.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center space-y-4">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
          <div>
            <p className="text-lg font-semibold">Error Loading Files</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
          <div className="space-x-2">
            <Button onClick={handleRetry} variant="outline">
              Try Again
            </Button>
            {error.includes("Authentication") && (
              <Button onClick={handleLoginRedirect}>Go to Login</Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
          disabled={loading}
        />
      </div>

      {/* File Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select File</label>
          <Select
            value={selectedFile}
            onValueChange={setSelectedFile}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={loading ? "Loading files..." : "Choose a file..."}
              />
            </SelectTrigger>
            <SelectContent>
              {filteredFiles.length === 0 ? (
                <SelectItem value="no-files" disabled>
                  {searchTerm
                    ? "No files match your search"
                    : "No files available"}
                </SelectItem>
              ) : (
                filteredFiles.map((file) => (
                  <SelectItem key={file.id} value={file.id}>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                      <Badge
                        variant={
                          file.type === "local" ? "default" : "secondary"
                        }
                        className={
                          file.type === "local"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }
                      >
                        {file.type === "local" ? (
                          <>
                            <HardDrive className="h-3 w-3 mr-1" />
                            Local
                          </>
                        ) : (
                          <>
                            <Cloud className="h-3 w-3 mr-1" />
                            Drive
                          </>
                        )}
                      </Badge>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleViewFile}
            disabled={!selectedFile || checkingFile || loading}
            className="w-full gradient-bg hover:opacity-90 text-white"
          >
            {checkingFile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" />
                View File
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Selected File Info */}
      {selectedFileData && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  File Name
                </p>
                <p className="text-sm">{selectedFileData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Size
                </p>
                <p className="text-sm">{selectedFileData.size}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Last Modified
                </p>
                <p className="text-sm">{selectedFileData.lastModified}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Storage
                </p>
                <div className="flex items-center space-x-1">
                  {selectedFileData.type === "local" ? (
                    <HardDrive className="h-4 w-4 text-green-500" />
                  ) : (
                    <Cloud className="h-4 w-4 text-blue-500" />
                  )}
                  <p className="text-sm capitalize">{selectedFileData.type}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ Show loading indicator when refreshing */}
      {loading && files.length > 0 && (
        <div className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm text-muted-foreground">
            Refreshing files...
          </span>
        </div>
      )}

      {/* Download Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-blue-500" />
              <span>Google Drive Integration</span>
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-amber-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>
                    File {selectedFileData?.name} is not available locally.
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600">
                  <Cloud className="h-4 w-4" />
                  <span>
                    Available on Google Drive - would you like to download it?
                  </span>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This will download the file from our secure Google Drive
                    storage and cache it locally for faster future access.
                  </p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={downloadLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDownloadFromDrive}
              disabled={downloadLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {downloadLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Cloud className="mr-2 h-4 w-4" />
                  Download from Google Drive
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
