"use client";

import { useRef, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "react-hot-toast";
import { createChiUpdateAction } from "@/actions/chiUpdate.action";

export default function CreateCHIUpdate() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  /** optional：提交后清表单 & 弹 toast */
  async function clientAction(formData: FormData) {
    startTransition(async () => {
      const res = await createChiUpdateAction(formData);
      if (res?.success) {
        toast.success("Update submitted!");
        formRef.current?.reset();
      } else {
        toast.error(res?.error ?? "Failed to submit");
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={clientAction}      // ← 直接把 clientAction 传给表单
      className="space-y-3"
    >
      <Input name="title" placeholder="Update title" required />
      <Input name="link"  placeholder="Link (e.g. /events/keynote)" required />
      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit CHI Update"}
      </Button>
    </form>
  );
}