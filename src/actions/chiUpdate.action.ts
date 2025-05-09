"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDbUserId } from "./user.action";

/* 新建一条记录 ----------------------------------------------------- */
export async function createChiUpdate(title: string, link: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, error: "Unauthorized" };

    const update = await prisma.chiUpdate.create({
      data: { title, link, authorId: userId },
    });

    revalidatePath("/"); // 刷新首页
    return { success: true, update };
  } catch (err) {
    console.error("Failed to create CHI update:", err);
    return { success: false, error: "Failed to create CHI update" };
  }
}

/* <form> 专用包装器 ------------------------------------------------- */
export async function createChiUpdateAction(form: FormData) {
  const title = form.get("title") as string;
  const link = form.get("link") as string;
  return createChiUpdate(title.trim(), link.trim());
}

/* 读取最新 N 条 ----------------------------------------------------- */
export async function getLatestChiUpdates(limit = 5) {
  try {
    return await prisma.chiUpdate.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        author: { select: { id: true, name: true, image: true, username: true } },
      },
    });
  } catch (err) {
    console.error("Error in getLatestChiUpdates:", err);
    throw new Error("Failed to fetch CHI updates");
  }
}

/* 删除（作者本人） -------------------------------------------------- */
export async function deleteChiUpdate(updateId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) throw new Error("Unauthorized");

    const update = await prisma.chiUpdate.findUnique({
      where: { id: updateId },
      select: { authorId: true },
    });
    if (!update) throw new Error("Update not found");
    if (update.authorId !== userId) throw new Error("No permission");

    await prisma.chiUpdate.delete({ where: { id: updateId } });
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete CHI update:", err);
    return { success: false, error: "Failed to delete CHI update" };
  }
}