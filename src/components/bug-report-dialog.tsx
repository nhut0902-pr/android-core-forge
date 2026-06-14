"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Bug, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
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
    try {
      const { error } = await supabase.from("bugs").insert([
        {
          title: values.title,
          description: values.description,
          email: values.email || null,
        },
      ]);

      if (error) throw error;

      toast.success("Báo cáo bug đã được gửi thành công!");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting bug:", error);
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      toast.error("Có lỗi xảy ra khi gửi báo cáo: " + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="gap-2">
            <Bug className="h-4 w-4" /> Báo Bug
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-primary" /> Báo cáo lỗi
          </DialogTitle>
          <DialogDescription>
            Giúp chúng tôi cải thiện ứng dụng bằng cách mô tả lỗi bạn gặp phải.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: Lỗi không thể tải file APK"
                      {...field}
                      className="bg-secondary/50 border-primary/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả chi tiết</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả các bước tái hiện lỗi..."
                      {...field}
                      className="bg-secondary/50 border-primary/10 min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email liên hệ (tùy chọn)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="email@example.com"
                      {...field}
                      className="bg-secondary/50 border-primary/10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="launch"
                className="w-full sm:w-auto"
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
