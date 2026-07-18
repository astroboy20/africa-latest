import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
  Upload,
  RefreshCw,
  ImagePlus,
  Sparkles,
  Hash,
  Lock,
  Trash2,
  Pencil,
  X,
} from "lucide-react";
import { modules as hardcodedModules } from "@/data/trivia-data";
import RichTextEditor from "./RichTextEditor";
import { generateAndSaveQuestions } from "@/lib/generate-questions";

// ─── Hardcoded module registry ────────────────────────────────────────────────
const HARDCODED_MODULES = hardcodedModules.map((m) => ({
  id: `hardcoded-${m.id}`,
  title: m.title,
  subtitle: m.subtitle,
  module_number: m.number,
  era: "pre-colonial",
  country: "nigeria",
  has_questions: true,
  image_url: null as string | null,
  source: "hardcoded" as const,
  created_at: null as string | null,
}));

const HARDCODED_COUNT = HARDCODED_MODULES.length; // 5

interface AdminModuleRow {
  id: string;
  title: string;
  subtitle: string | null;
  module_number: number | null;
  era: string;
  country: string;
  image_url: string | null;
  questions: any[] | null;
  created_at: string;
  source: "uploaded";
}

interface DisplayModule {
  id: string;
  title: string;
  subtitle: string | null;
  module_number: number | null;
  era: string;
  country: string;
  image_url: string | null;
  has_questions: boolean;
  source: "hardcoded" | "uploaded";
  created_at: string | null;
}

// Check if HTML content from Tiptap is actually empty
function isContentEmpty(html: string): boolean {
  const stripped = html.replace(/<[^>]*>/g, "").trim();
  return stripped.length === 0;
}

function buildImagePrompt(title: string, description: string, era: string, country: string): string {
  const eraContext: Record<string, string> = {
    "pre-colonial": "pre-colonial African civilization, ancient kingdoms, traditional architecture",
    "colonial": "colonial era Africa, historical resistance, cultural tension",
    "post-colonial": "post-colonial Africa, modern African identity, independence",
  };
  const context = eraContext[era] || "African history";
  const detail = description ? `, ${description}` : "";
  return `Epic historical illustration of ${title}${detail}, ${context}, ${country} West Africa, cinematic dramatic lighting, warm terracotta and gold color palette, ancient landscape, highly detailed digital painting, no text, no watermark, 16:9 aspect ratio`;
}

const AdminModuleUpload = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [country, setCountry] = useState("nigeria");
  const [era, setEra] = useState("pre-colonial");
  const [moduleNumber, setModuleNumber] = useState("");

  // Image
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imagePromptUsed, setImagePromptUsed] = useState("");

  // Upload
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "image" | "questions" | "saving">("idle");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Module registry (all modules combined)
  const [allModules, setAllModules] = useState<DisplayModule[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [modulesFetched, setModulesFetched] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<DisplayModule | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Edit mode — holds the ID of the module being edited
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Auto-calculate next module number on mount
  useEffect(() => {
    fetchAllModules(true);
  }, []);

  const fetchAllModules = async (silent = false) => {
    if (!silent) setLoadingModules(true);

    const { data } = await supabase
      .from("admin_modules")
      .select("id, title, subtitle, module_number, era, country, image_url, questions, created_at")
      .order("module_number", { ascending: true, nullsFirst: false });

    const uploaded: DisplayModule[] = (data || []).map((m: AdminModuleRow) => ({
      id: m.id,
      title: m.title,
      subtitle: m.subtitle,
      module_number: m.module_number,
      era: m.era,
      country: m.country,
      image_url: m.image_url,
      has_questions: Array.isArray(m.questions) && m.questions.length > 0,
      source: "uploaded" as const,
      created_at: m.created_at,
    }));

    const combined: DisplayModule[] = [
      ...HARDCODED_MODULES,
      ...uploaded,
    ].sort((a, b) => (a.module_number ?? 999) - (b.module_number ?? 999));

    setAllModules(combined);
    setModulesFetched(true);
    if (!silent) setLoadingModules(false);

    // Auto-set next module number
    const maxNum = combined.reduce((max, m) => Math.max(max, m.module_number ?? 0), 0);
    setModuleNumber(String(maxNum + 1));
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteTarget.source === "hardcoded") return;
    setDeleting(true);
    await supabase.from("admin_modules").delete().eq("id", deleteTarget.id);
    setDeleteTarget(null);
    setDeleting(false);
    fetchAllModules(true);
  };

  const loadForEdit = async (mod: DisplayModule) => {
    setLoadingEdit(true);
    setError("");
    setSuccess(false);
    // Fetch full record including content
    const { data } = await supabase
      .from("admin_modules")
      .select("*")
      .eq("id", mod.id)
      .maybeSingle();
    if (data) {
      setEditingId(data.id);
      setTitle(data.title);
      setSubtitle(data.subtitle || "");
      setDescription(data.description || "");
      setContent(data.content || "");
      setCountry(data.country);
      setEra(data.era);
      setModuleNumber(String(data.module_number ?? ""));
      setGeneratedImageUrl(data.image_url || null);
      setImagePromptUsed("");
      // Scroll the form into view
      setTimeout(() => {
        document.getElementById("module-form")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setLoadingEdit(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setSubtitle("");
    setDescription("");
    setContent("");
    setGeneratedImageUrl(null);
    setImagePromptUsed("");
    setError("");
    setSuccess(false);
    // Recalculate next number
    const maxNum = allModules.reduce((max, m) => Math.max(max, m.module_number ?? 0), 0);
    setModuleNumber(String(maxNum + 1));
  };

  const generateImage = async () => {
    if (!title.trim()) { setError("Enter a module title first."); return; }
    setError("");
    setGeneratingImage(true);
    setGeneratedImageUrl(null);
    const prompt = buildImagePrompt(title, description, era, country);
    setImagePromptUsed(prompt);
    const seed = Date.now() % 99999;
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&seed=${seed}&nologo=true&enhance=true`;
    const img = new Image();
    img.onload = () => { setGeneratedImageUrl(url); setGeneratingImage(false); };
    img.onerror = () => { setError("Image generation failed. Try again."); setGeneratingImage(false); };
    img.src = url;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isContentEmpty(content)) { setError("Title and content are required."); return; }

    setUploading(true);
    setError("");
    setSuccess(false);

    // Step 1: Image (skip regenerating if editing and image unchanged)
    setUploadStatus("image");
    let imageUrl = generatedImageUrl;
    if (!imageUrl) {
      const prompt = buildImagePrompt(title, description, era, country);
      const seed = Date.now() % 99999;
      imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&seed=${seed}&nologo=true&enhance=true`;
    }

    if (editingId) {
      // ── EDIT MODE: update existing record ───────────────────────────────
      setUploadStatus("saving");
      const { error: updateError } = await supabase
        .from("admin_modules")
        .update({
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          description: description.trim() || null,
          content: content.trim(),
          country,
          era,
          module_number: moduleNumber ? parseInt(moduleNumber) : null,
          image_url: imageUrl,
        })
        .eq("id", editingId);

      if (updateError) {
        setError(updateError.message);
        setUploading(false);
        setUploadStatus("idle");
        return;
      }

      setSuccess(true);
      setUploading(false);
      setUploadStatus("idle");
      cancelEdit();
      fetchAllModules(true);
      return;
    }

    // ── CREATE MODE ────────────────────────────────────────────────────────
    // Step 1 already done (image). Now save immediately — don't wait for questions.
    setUploadStatus("saving");
    const { data: inserted, error: insertError } = await supabase
      .from("admin_modules")
      .insert({
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        description: description.trim() || null,
        content: content.trim(),
        country,
        era,
        module_number: moduleNumber ? parseInt(moduleNumber) : null,
        image_url: imageUrl,
        questions: null, // will be filled in background
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setUploading(false);
      setUploadStatus("idle");
      return;
    }

    // Module saved — clear the form immediately so admin isn't waiting
    setSuccess(true);
    const savedTitle = title.trim();
    const savedContent = content.trim();
    const savedId = inserted.id;
    setTitle("");
    setSubtitle("");
    setDescription("");
    setContent("");
    setGeneratedImageUrl(null);
    setImagePromptUsed("");
    setUploading(false);
    setUploadStatus("idle");
    fetchAllModules(true);

    // Generate questions in the background — update the record when done
    setUploadStatus("questions");
    generateAndSaveQuestions(savedId, savedTitle, savedContent).then((ok) => {
      if (ok) fetchAllModules(true);
    });
    setUploadStatus("idle");
  };

  const uploadStatusLabel: Record<string, string> = {
    image: "Generating image...",
    questions: "Generating quiz questions in background...",
    saving: "Saving module...",
  };

  const uploadedCount = allModules.filter((m) => m.source === "uploaded").length;
  const totalCount = allModules.length;

  return (
    <>
    <div className="space-y-6">
      {/* Module registry summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Hash className="w-4 h-4" /> Module Registry
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{HARDCODED_COUNT} built-in</Badge>
              <Badge variant="outline">{uploadedCount} uploaded</Badge>
              <Badge className="bg-primary text-primary-foreground">{totalCount} total</Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchAllModules()}
                disabled={loadingModules}
                className="h-7 px-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingModules ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Responsive module list */}
          <div className="max-h-64 overflow-y-auto divide-y divide-border">
            {allModules.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">Loading...</p>
            )}
            {allModules.map((m) => (
              <div key={m.id} className="flex items-center gap-2 px-3 py-2.5 hover:bg-muted/30 transition-colors">
                {/* Number */}
                <span className="text-xs font-bold text-muted-foreground w-6 shrink-0 text-center">
                  {m.module_number ?? "—"}
                </span>

                {/* Thumbnail — hidden on very small screens */}
                <div className="hidden sm:block shrink-0">
                  {m.image_url ? (
                    <img src={m.image_url} alt={m.title} className="w-10 h-7 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-7 bg-muted rounded flex items-center justify-center">
                      <ImagePlus className="w-3 h-3 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{m.title}</p>
                  <p className="text-[10px] text-muted-foreground capitalize truncate">
                    {m.era.replace("-", " ")} • {m.country}
                    {m.created_at && ` • ${new Date(m.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                  </p>
                </div>

                {/* Badges — collapse on mobile to just icons */}
                <div className="flex items-center gap-1 shrink-0">
                  {m.source === "hardcoded" ? (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 hidden sm:flex items-center gap-0.5">
                      <Lock className="w-2 h-2" /> Built-in
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 hidden sm:flex items-center gap-0.5 text-primary border-primary/30">
                      <Upload className="w-2 h-2" /> Uploaded
                    </Badge>
                  )}
                  {m.has_questions ? (
                    <Badge className="text-[9px] px-1.5 py-0 bg-accent/20 text-accent-foreground border-0 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2 h-2" />
                      <span className="hidden sm:inline">Quiz</span>
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 opacity-50 hidden sm:flex">
                      No quiz
                    </Badge>
                  )}
                  {/* Edit + Delete — only for uploaded modules */}
                  {m.source === "uploaded" && (
                    <>
                      <button
                        onClick={() => loadForEdit(m)}
                        disabled={loadingEdit}
                        className={`p-1 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors ${editingId === m.id ? "bg-primary/10 text-primary" : ""}`}
                        title="Edit module"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(m)}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        title="Delete module"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload / Edit form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card id="module-form" className={editingId ? "ring-2 ring-primary/30" : ""}>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                {editingId ? (
                  <><Pencil className="w-4 h-4 text-primary" /> Edit Module</>
                ) : (
                  <><Upload className="w-4 h-4" /> Add New Module</>
                )}
              </span>
              {editingId && (
                <Button variant="ghost" size="sm" onClick={cancelEdit} className="h-7 gap-1 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" /> Cancel
                </Button>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              {editingId
                ? "Editing an existing module. Save when done."
                : `Module #${moduleNumber} will be auto-assigned. Image and quiz questions are AI-generated.`}
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

              {/* Title + auto module number */}
              <div className="space-y-1.5">
                <Label htmlFor="mod-title">Module Title *</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="mod-title"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setGeneratedImageUrl(null); }}
                    placeholder="e.g. The Benin Kingdom"
                    required
                    className="flex-1"
                  />
                  <div className="flex items-center gap-1.5 bg-muted/50 border border-border rounded-md px-3 h-9 shrink-0">
                    <Hash className="w-3 h-3 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      value={moduleNumber}
                      onChange={(e) => setModuleNumber(e.target.value)}
                      className="border-0 bg-transparent p-0 h-auto w-10 text-sm font-bold focus-visible:ring-0"
                    />
                  </div>
                </div>
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
                  <Label htmlFor="mod-desc">Description</Label>
                  <Input
                    id="mod-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="One-line summary..."
                  />
                </div>
              </div>

              {/* AI Image preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Header Image (AI)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateImage}
                    disabled={generatingImage || !title.trim()}
                    className="gap-1.5 h-7 text-xs"
                  >
                    {generatingImage ? (
                      <><RefreshCw className="w-3 h-3 animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles className="w-3 h-3" /> {generatedImageUrl ? "Regenerate" : "Preview"}</>
                    )}
                  </Button>
                </div>
                <div className="rounded-lg overflow-hidden border border-border bg-muted/30 h-32 relative">
                  {generatingImage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs text-muted-foreground">Generating from topic...</p>
                    </div>
                  )}
                  {generatedImageUrl && !generatingImage && (
                    <img src={generatedImageUrl} alt="preview" className="w-full h-full object-cover" />
                  )}
                  {!generatedImageUrl && !generatingImage && (
                    <div className="h-full flex flex-col items-center justify-center gap-1 text-muted-foreground/40">
                      <ImagePlus className="w-5 h-5" />
                      <p className="text-[11px]">{title.trim() ? 'Click "Preview" or just Upload' : "Enter a title first"}</p>
                    </div>
                  )}
                </div>
                {imagePromptUsed && (
                  <p className="text-[10px] text-muted-foreground/50 italic truncate" title={imagePromptUsed}>
                    Prompt: {imagePromptUsed.slice(0, 80)}...
                  </p>
                )}
              </div>

              {/* Content — Rich Text Editor */}
              <div className="space-y-1.5">
                <Label>
                  Module Content *{" "}
                  <span className="text-muted-foreground font-normal text-xs">
                    (paste from Google Docs, Word, or type directly)
                  </span>
                </Label>
                <RichTextEditor
                  key={editingId ?? "new"}
                  value={content}
                  onChange={setContent}
                  placeholder="Start with a section heading (H2), then paste or type your content..."
                />
                <p className="text-xs text-muted-foreground">
                  Use H2 for section headings — each becomes a separate card on the module page.
                </p>
              </div>

              {error && (
                <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
              )}

              {success && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                  {editingId ? "Module updated successfully!" : `Module ${moduleNumber} uploaded successfully!`}
                </div>
              )}

              {/* Upload progress */}
              {uploading && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{uploadStatusLabel[uploadStatus] || "Processing..."}</span>
                    <span>
                      {uploadStatus === "image" ? "1/3" : uploadStatus === "questions" ? "2/3" : "3/3"}
                    </span>
                  </div>
                  <Progress
                    value={uploadStatus === "image" ? 33 : uploadStatus === "questions" ? 66 : 90}
                    className="h-1.5"
                  />
                </div>
              )}

              <Button type="submit" className="w-full gap-2" disabled={uploading}>
                {uploading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> {uploadStatusLabel[uploadStatus] || "Working..."}</>
                ) : editingId ? (
                  <><CheckCircle2 className="w-4 h-4" /> Save Changes</>
                ) : (
                  <><Upload className="w-4 h-4" /> Upload Module #{moduleNumber}</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick stats panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Module Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total modules</span>
                <span className="font-bold text-foreground">{totalCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Built-in (hardcoded)</span>
                <span className="font-bold text-foreground">{HARDCODED_COUNT}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Admin uploaded</span>
                <span className="font-bold text-foreground">{uploadedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">With quiz questions</span>
                <span className="font-bold text-foreground">
                  {allModules.filter((m) => m.has_questions).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next module #</span>
                <Badge variant="secondary">#{moduleNumber || "—"}</Badge>
              </div>
              <div className="pt-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Modules with quizzes</span>
                  <span>{allModules.filter((m) => m.has_questions).length}/{totalCount}</span>
                </div>
                <Progress
                  value={totalCount > 0 ? (allModules.filter((m) => m.has_questions).length / totalCount) * 100 : 0}
                  className="h-1.5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Countries breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">By Country</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {Array.from(new Set(allModules.map((m) => m.country))).map((c) => {
                const count = allModules.filter((m) => m.country === c).length;
                return (
                  <div key={c} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground capitalize">{c}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(count / totalCount) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-4 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Era breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">By Era</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["pre-colonial", "colonial", "post-colonial"].map((e) => {
                const count = allModules.filter((m) => m.era === e).length;
                return (
                  <div key={e} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground capitalize">{e.replace("-", " ")}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: totalCount > 0 ? `${(count / totalCount) * 100}%` : "0%" }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground w-4 text-right">{count}</span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    {/* Delete confirmation dialog */}
    <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this module?</AlertDialogTitle>
          <AlertDialogDescription>
            <strong>{deleteTarget?.title}</strong> (Module #{deleteTarget?.module_number}) will be permanently deleted including its quiz questions and image reference. This cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
          >
            {deleting ? (
              <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Deleting...</>
            ) : (
              <><Trash2 className="w-3.5 h-3.5" /> Delete Module</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default AdminModuleUpload;
