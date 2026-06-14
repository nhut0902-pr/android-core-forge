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
  DialogPortal,
  DialogOverlay,
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

export function BugReportDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
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
    const toastId = toast.loading("Đang gửi báo cáo lỗi...");
    console.log("Submitting bug report to Supabase:", values);

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
        console.error("Supabase Error:", supabaseError);
        throw new Error(
          `Lỗi cơ sở dữ liệu: ${supabaseError.message}. Hãy đảm bảo bạn đã tạo bảng 'bugs' với chính sách RLS cho phép insert.`,
        );
      }

      // 2. Gửi email xác nhận (không đợi kết quả để tránh delay UI)
      if (values.email) {
        sendBugReportEmail({
          data: {
            email: values.email,
            title: values.title,
            description: values.description,
          },
        })
          .then((res) => {
            if (res && "error" in res && res.error) {
              console.error("Email API internal error:", res.error);
            }
          })
          .catch((err) => console.error("Email system failed:", err));
      }

      toast.success("Đã gửi báo cáo! Cảm ơn đóng góp của bạn.", { id: toastId });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Bug submission catch block:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Không thể kết nối đến máy chủ.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="z-[100]" />
        <DialogContent className="z-[101] sm:max-w-[380px] bg-background/95 backdrop-blur-2xl border-primary/20 p-4 shadow-2xl overflow-hidden">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Bug className="h-5 w-5 text-red-500" /> Báo cáo lỗi
            </DialogTitle>
            <DialogDescription className="text-xs">
              Mô tả ngắn gọn lỗi bạn gặp phải.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-2">
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
      </DialogPortal>
    </Dialog>
  );
}
