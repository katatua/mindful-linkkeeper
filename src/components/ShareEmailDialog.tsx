
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

interface ShareEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  contentType: string;
}

export const ShareEmailDialog: React.FC<ShareEmailDialogProps> = ({
  open,
  onOpenChange,
  title,
  contentType
}) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter a recipient email address",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    // Simulate sending email - in a real app, this would call a serverless function
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Shared successfully",
        description: `${contentType} has been shared with ${email}`
      });
      
      setEmail("");
      setMessage("");
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Sharing failed",
        description: "There was an error sharing this content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share via Email</DialogTitle>
          <DialogDescription>
            Share this {contentType.toLowerCase()} with colleagues via email
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Content</Label>
            <div className="p-2 bg-gray-50 rounded text-sm">{title}</div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Recipient Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="I thought you might find this interesting..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSend} disabled={isSending}>
            <Mail className="h-4 w-4 mr-2" />
            {isSending ? "Sending..." : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
