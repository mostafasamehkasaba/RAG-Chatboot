"use client"
import { useRef, useState } from "react"
import { FilePdf, Spinner, UploadSimple } from "@phosphor-icons/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { processPdfFile } from "./action"

export default function PdfUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [message, setMessage] = useState<{
    type: "error" | "success"
    text: string
  } | null>(null)

  const handleFile = async (file: File | undefined) => {
    if (!file) return

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setMessage({ type: "error", text: "الملف لازم يكون PDF" })
      return
    }

    setFileName(file.name)
    setMessage(null)
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("pdf", file)

      const result = await processPdfFile(formData)

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "PDF processed successfully"
        })
        if (inputRef.current) inputRef.current.value = ""
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to process PDF"
        })
      }
    } catch {
      setMessage({
        type: "error",
        text: "حدث خطأ غير متوقع"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-6">
        <h1 className="font-heading text-sm font-medium tracking-tight">PDF Upload</h1>
        <p className="mt-1 text-xs text-muted-foreground">ارفع مستند ليعالج ويترتب في قاعدة البيانات</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>رفع الملف</CardTitle>
          <CardDescription>PDF واحدة بحد أقصى — هتتقسم تلقائياً وتتخزن</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <Label htmlFor="pdf-upload" className="mb-2 block">
              اختر ملف
            </Label>
            <Input
              ref={inputRef}
              id="pdf-upload"
              type="file"
              accept=".pdf,application/pdf"
              className="sr-only"
              onChange={(e) => handleFile(e.target.files?.[0])}
              disabled={isLoading}
            />
            <label
              htmlFor="pdf-upload"
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                handleFile(e.dataTransfer.files?.[0])
              }}
              className={cn(
                "flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-border px-6 text-center transition-colors",
                "hover:border-foreground/40 hover:bg-secondary/50",
                isDragging && "border-foreground bg-secondary",
                isLoading && "pointer-events-none opacity-60"
              )}
            >
              <FilePdf size={28} weight="duotone" className="text-foreground/60" />
              {fileName ? (
                <span className="text-xs text-foreground">{fileName}</span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  اسحب الملف هنا أو <span className="underline underline-offset-2">اضغط للاختيار</span>
                </span>
              )}
            </label>
          </div>

          {isLoading && (
            <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
              <Spinner size={14} className="animate-spin" />
              جاري معالجة الملف...
            </div>
          )}

          {message && (
            <div
              role="status"
              className={cn(
                "border px-3 py-2 text-xs",
                message.type === "error"
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-border bg-secondary text-foreground"
              )}
            >
              <UploadSimple size={14} weight="bold" className="mr-1.5 inline" />
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}