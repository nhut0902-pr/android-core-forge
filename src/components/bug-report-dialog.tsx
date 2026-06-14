"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Bug, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { sendBugReportEmail } from "@/lib/api/email";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải ít nhất 5 ký tự"),
  description: z.string().min(10, "Mô tả phải ít nhất 10 ký tự"),
  email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

interface BugReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BugReportDialog({ open, onOpenChange }: BugReportDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      email: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const toastId = toast.loading("Đang kết nối đến hệ thống...");
    console.log("DEBUG: Submission started", values);

    try {
      // 1. Gửi lên Supabase
      const { error: supabaseError } = await supabase.from("bugs").insert([
        {
          title: values.title,
          description: values.description,
          email: values.email || null,
          status: "pending",
        },
      ]);

      if (supabaseError) {
        console.error("DEBUG: Supabase Insert Failed", supabaseError);
        if (supabaseError.code === "42P01") {
          const msg =
            "Lỗi: Bảng 'bugs' chưa được tạo trong Supabase. Hãy chạy script SQL tôi đã gửi.";
          toast.error(msg, { id: toastId, duration: 10000 });
          return;
        }
        throw new Error(supabaseError.message);
      }

      console.log("DEBUG: Supabase success");

      // 2. Gửi email xác nhận (không đợi)
      if (values.email) {
        sendBugReportEmail({
          data: {
            email: values.email,
            title: values.title,
            description: values.description,
          },
        }).catch((e) => console.error("DEBUG: Background email failed", e));
      }

      toast.success("Đã báo cáo thành công! Admin sẽ sớm phản hồi qua email của bạn.", {
        id: toastId,
        duration: 5000,
      });

      // Delay closing to let user see success message
      setTimeout(() => {
        onOpenChange(false);
        form.reset();
      }, 1500);
    } catch (error) {
      console.error("DEBUG: Final catch", error);
      const errorMessage = error instanceof Error ? error.message : "Không xác định";
      toast.error(`Lỗi: ${errorMessage}`, {
        id: toastId,
        duration: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-[9999] sm:max-w-[380px] bg-background/95 backdrop-blur-2xl border-primary/20 p-4 shadow-2xl overflow-hidden">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Bug className="h-5 w-5 text-red-500" /> Báo cáo lỗi
          </DialogTitle>
          <DialogDescription className="text-xs">
            Mô tả ngắn gọn lỗi bạn gặp phải.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("Validation errors:", errors);
              toast.error("Vui lòng kiểm tra lại thông tin nhập vào.");
            })}
            className="space-y-3 pt-2"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Lỗi..."
                      {...field}
                      className="h-9 bg-secondary/30 border-primary/10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Các bước tái hiện..."
                      {...field}
                      className="bg-secondary/30 border-primary/10 min-h-[80px] text-sm resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs">Email (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      className="h-9 bg-secondary/30 border-primary/10 text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="launch"
                className="w-full h-10 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang gửi...
                  </>
                ) : (
                  "Gửi báo cáo"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
