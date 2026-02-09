import { useState, useRef } from "react";
import { Images, Calendar, Trash2, FolderPlus, Folder, Upload, ChevronRight, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useImagesStore } from "@/store/images-store";

const SavedImages = () => {
  const { folders, images, addFolder, deleteFolder, addImage, deleteImage } = useImagesStore();
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetFolder, setUploadTargetFolder] = useState<string | null>(null);

  const ungroupedImages = images.filter((img) => img.folderId === null);

  const toggleFolder = (id: string) => {
    setOpenFolders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    addFolder(name);
    setNewFolderName("");
    setShowNewFolder(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, folderId: string | null) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        addImage({
          imageUrl: ev.target?.result as string,
          name: file.name,
          folderId,
        });
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const triggerUpload = (folderId: string | null) => {
    setUploadTargetFolder(folderId);
    if (folderId) {
      folderFileInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e, null)}
      />
      <input
        ref={folderFileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e, uploadTargetFolder)}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-foreground mb-1 flex items-center gap-3">
            <Images className="w-8 h-8 text-primary" />
            Saved Images
          </h1>
          <p className="text-muted-foreground text-sm">
            Organize your plant images in folders or upload standalone images.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowNewFolder(!showNewFolder)}>
            <FolderPlus className="w-4 h-4 mr-1" />
            New Folder
          </Button>
          <Button variant="outline" size="sm" onClick={() => triggerUpload(null)}>
            <Upload className="w-4 h-4 mr-1" />
            Upload Image
          </Button>
        </div>
      </div>

      {/* New Folder Input */}
      {showNewFolder && (
        <div className="flex items-center gap-2 mb-6 p-4 bg-card border border-border rounded-lg">
          <Input
            placeholder="Folder name (e.g. potato_leaf_images)"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            className="max-w-xs"
          />
          <Button size="sm" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
            Create
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowNewFolder(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Folders Section */}
      {folders.length > 0 && (
        <div className="mb-8 space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">Folders</h2>
          {folders.map((folder) => {
            const folderImages = images.filter((img) => img.folderId === folder.id);
            const isOpen = openFolders.has(folder.id);
            return (
              <div key={folder.id} className="border border-border rounded-lg bg-card">
                {/* Folder Header */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 rounded-t-lg"
                  onClick={() => toggleFolder(folder.id)}
                >
                  <div className="flex items-center gap-2">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    <Folder className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">{folder.name}</span>
                    <span className="text-xs text-muted-foreground">({folderImages.length} images)</span>
                  </div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => triggerUpload(folder.id)}>
                      <Upload className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => deleteFolder(folder.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {/* Folder Content */}
                {isOpen && (
                  <div className="p-3 pt-0 border-t border-border">
                    {folderImages.length > 0 ? (
                      <div className="grid sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                        {folderImages.map((image) => (
                          <ImageCard key={image.id} image={image} onDelete={deleteImage} formatDate={formatDate} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground py-4 text-center">
                        No images yet. Click the upload icon to add images.
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ungrouped Images */}
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Ungrouped Images
        </h2>
        {ungroupedImages.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ungroupedImages.map((image) => (
              <ImageCard key={image.id} image={image} onDelete={deleteImage} formatDate={formatDate} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-8 text-center">
            <Images className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No ungrouped images yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function ImageCard({
  image,
  onDelete,
  formatDate,
}: {
  image: { id: string; imageUrl: string; name: string; date: string };
  onDelete: (id: string) => void;
  formatDate: (d: string) => string;
}) {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden group">
      <div className="relative aspect-video overflow-hidden">
        <img src={image.imageUrl} alt={image.name} className="w-full h-full object-cover" />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(image.id)}
          className="absolute top-1 right-1 bg-card/90 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-foreground truncate">{image.name}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Calendar className="w-3 h-3" />
          {formatDate(image.date)}
        </div>
      </div>
    </div>
  );
}

export default SavedImages;
