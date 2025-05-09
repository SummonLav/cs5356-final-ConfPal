
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import Link from "next/link";
import { CalendarIcon, LinkIcon } from "lucide-react";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";
import { UrlObject } from "url";
import { getLatestChiUpdates } from "@/actions/chiUpdate.action";
import CreateCHIUpdate from "./CreateCHIUpdate";


export default async function CHIUpdates() {
  const updates = await getLatestChiUpdates();

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Conference Blog</CardTitle>
        {/* “允许用户创建”的表单 */}
        <CreateCHIUpdate />
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {updates.map((update: { id: Key | null | undefined; link: string | UrlObject; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; createdAt: string | number | Date; }) => (
          <div key={update.id} className="space-y-1">
            <Link href={update.link} className="font-medium text-primary hover:underline flex items-center gap-1">
              <LinkIcon className="size-3" />
              {update.title}
            </Link>
            <div className="flex items-center text-muted-foreground text-xs gap-1">
              <CalendarIcon className="size-3" />
              {new Date(update.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
