"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { createPost } from "@/actions/post.action";

const MAX_LENGTH = 280;

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // 恢复草稿
  useEffect(() => {
    const saved = localStorage.getItem("draft");
    if (saved) setContent(saved);
  }, []);

  // 自动保存草稿
  useEffect(() => {
    localStorage.setItem("draft", content);
  }, [content]);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);
        localStorage.removeItem("draft");
        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6 shadow-sm border border-gray-200">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="What's on your mind?"
                className="min-h-[100px] resize-none border-none focus-visible:ring-0 bg-muted/20 text-base p-3 rounded-md"
                value={content}
                onChange={(e) =>
                  setContent(e.target.value.slice(0, MAX_LENGTH))
                }
                disabled={isPosting}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {content.length}/{MAX_LENGTH}
              </div>
            </div>
          </div>

          {/* {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )} */}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              variant="default"
              className="flex items-center px-4 py-2 rounded-full"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
