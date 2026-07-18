import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Upload,
  RefreshCw,
  BookOpen,
  ImagePlus,
  X,
} from "lucide-react";

interface UploadedModule {
  id: string;
  title: string;
  image_url: string | null;
  created_at: string;
}

const AdminModuleUpload = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [country, setCountry] = useState("nigeria");
  const [era, setEra] = useState("pre-colonial");
  const [moduleNumber, setModuleNumber] = useState("");

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [uploadedModules, setUploadedModules] = useState<UploadedModule[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listFetched, setListFetched] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP, etc.)");
      return;
    }
    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }

    setImageFile(file);
    setError("");

    // Generate preview
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    setUploadingImage(true);
    const ext = file.name.split(".").pop();
    const fileName = `module-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: storageError } = await supabase.storage
      .from("module-images")
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    setUploadingImage(false);

    if (storageError) {
      setError(`Image upload failed: ${storageError.message}`);
      return null;
    }

    const { data } = supabase.storage
      .from("module-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    // Upload image first if provided
    let imageUrl: string | null = null;
    if (imageFile) {
      imageUrl = await uploadImageToStorage(imageFile);
      if (!imageUrl) {
        setUploading(false);
        return;
      }
    }

    const { error: insertError } = await supabase.from("admin_modules").insert({
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      description: description.trim() || null,
      content: content.trim(),
      country,
      era,
      module_number: moduleNumber ? parseInt(moduleNumber) : null,
      image_url: imageUrl,
    });

    if (insertError) {
      setError(insertError.message);
      setUploading(false);
      return;
    }

    setSuccess(true);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setContent("");
    setModuleNumber("");
    clearImage();
    setUploading(false);

    if (listFetched) fetchModules();
  };

  const fetchModules = async () => {
    setLoadingList(true);
    const { data } = await supabase
      .from("admin_modules")
      .select("id, title, image_url, created_at")
      .order("created_at", { ascending: false });
    setUploadedModules(data || []);
    setLoadingList(false);
    setListFetched(true);
  };

  const isSubmitting = uploading || uploadingImage;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Upload form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload New Module
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Fill in the details, add a header image, and paste the module content.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            {/* Country + Era */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="nigeria">Nigeria</option>
                  <option value="ghana">Ghana</option>
                  <option value="kenya">Kenya</option>
                  <option value="ethiopia">Ethiopia</option>
                  <option value="southafrica">South Africa</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="era">Era</Label>
                <select
                  id="era"
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="pre-colonial">Pre-Colonial</option>
                  <option value="colonial">Colonial</option>
                  <option value="post-colonial">Post-Colonial</option>
                </select>
              </div>
            </div>

            {/* Title + Subtitle + Module # */}
            <div className="space-y-1.5">
              <Label htmlFor="mod-title">Module Title *</Label>
              <Input
                id="mod-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Dawn of Humanity"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="mod-subtitle">Subtitle</Label>
                <Input
                  id="mod-subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Short subtitle..."
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mod-number">Module #</Label>
                <Input
                  id="mod-number"
                  type="number"
                  min="1"
                  value={moduleNumber}
                  onChange={(e) => setModuleNumber(e.target.value)}
                  placeholder="e.g. 6"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mod-desc">Short Description</Label>
              <Input
                id="mod-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="One-line summary of the module..."
              />
            </div>

            {/* Image upload */}
            <div className="space-y-1.5">
              <Label>Module Header Image</Label>

              {/* Preview */}
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-36 object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full p-1 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4 text-foreground" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-background/80 rounded px-2 py-0.5 text-xs text-foreground">
                    {imageFile?.name}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-28 rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col items-center justify-center gap-2 text-muted-foreground"
                >
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-sm">Click to upload image</span>
                  <span className="text-xs">JPG, PNG, WebP — max 5MB</span>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <Label htmlFor="mod-content">
                Module Content *{" "}
                <span className="text-muted-foreground font-normal">
                  (markdown supported)
                </span>
              </Label>
              <Textarea
                id="mod-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`## Section Heading\n\nParagraph text goes here...\n\n## Another Section\n\nMore content...`}
                rows={10}
                className="font-mono text-xs resize-y"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use ## for section headings. Questions are randomised per game session.
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            {success && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                Module uploaded successfully!
              </div>
            )}

            <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {uploadingImage ? "Uploading image..." : "Saving module..."}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Upload Module
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Uploaded modules list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Uploaded Modules
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchModules}
              disabled={loadingList}
              className="gap-1.5"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingList ? "animate-spin" : ""}`}
              />
              {listFetched ? "Refresh" : "Load"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!listFetched && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Click "Load" to see uploaded modules
            </p>
          )}

          {loadingList && (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          )}

          {listFetched && !loadingList && uploadedModules.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">
              No modules uploaded yet
            </p>
          )}

          {listFetched && !loadingList && uploadedModules.length > 0 && (
            <div className="space-y-3">
              {uploadedModules.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 bg-muted/30 rounded-lg overflow-hidden border border-border"
                >
                  {/* Thumbnail */}
                  {m.image_url ? (
                    <img
                      src={m.image_url}
                      alt={m.title}
                      className="w-20 h-16 object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-16 bg-muted flex items-center justify-center shrink-0">
                      <ImagePlus className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 py-2 pr-3">
                    <p className="text-sm font-medium text-foreground truncate">
                      {m.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <Badge variant="secondary" className="text-[10px] mt-1">
                      {m.image_url ? "✓ Has image" : "No image"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminModuleUpload;
