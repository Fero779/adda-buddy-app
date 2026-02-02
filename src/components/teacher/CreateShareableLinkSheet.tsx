import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Link2, Copy, Share2, Check, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data - will come from API
const teacherBatches = [
  { id: 'batch-1', name: 'SSC CGL 2025 Complete', exam: 'SSC CGL', category: 'Government Exams' },
  { id: 'batch-2', name: 'Bank PO Crash Course', exam: 'Bank PO', category: 'Banking' },
  { id: 'batch-3', name: 'Railway NTPC Foundation', exam: 'RRB NTPC', category: 'Railways' },
];

const teacherCoupons = [
  { id: 'coupon-1', code: 'TEACH500', discount: '₹500 off', type: 'flat' },
  { id: 'coupon-2', code: 'GURU10', discount: '10% off', type: 'percent' },
  { id: 'coupon-3', code: 'SPECIAL200', discount: '₹200 off', type: 'flat' },
];

interface CreateShareableLinkSheetProps {
  trigger: React.ReactNode;
}

export const CreateShareableLinkSheet: React.FC<CreateShareableLinkSheetProps> = ({ trigger }) => {
  const [selectedBatch, setSelectedBatch] = useState<string>('');
  const [selectedCoupon, setSelectedCoupon] = useState<string>('');
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const selectedBatchData = teacherBatches.find(b => b.id === selectedBatch);
  const selectedCouponData = teacherCoupons.find(c => c.id === selectedCoupon);

  const handleGenerateLink = async () => {
    if (!selectedBatch || !selectedCoupon) {
      toast({
        title: 'Selection Required',
        description: 'Please select both a batch and a coupon.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call - will be replaced with actual API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const couponCode = selectedCouponData?.code || '';
    const link = `https://adda247.com/batch/${selectedBatch}?coupon=${couponCode}`;
    setGeneratedLink(link);
    setIsGenerating(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast({
        title: 'Link Copied!',
        description: 'Shareable link copied to clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Copy Failed',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedBatchData?.name || 'Check out this course!',
          text: `Get ${selectedCouponData?.discount} on ${selectedBatchData?.name}!`,
          url: generatedLink,
        });
      } catch (err) {
        // User cancelled or share failed
        if ((err as Error).name !== 'AbortError') {
          toast({
            title: 'Share Failed',
            description: 'Could not share the link.',
            variant: 'destructive',
          });
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleReset = () => {
    setSelectedBatch('');
    setSelectedCoupon('');
    setGeneratedLink('');
    setCopied(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      setTimeout(handleReset, 300);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" />
              Create Shareable Link
            </DrawerTitle>
            <DrawerDescription>
              Generate a link with your coupon auto-applied
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-4 space-y-4">
            {!generatedLink ? (
              <>
                {/* Step 1: Select Batch */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Select Batch
                  </label>
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherBatches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{batch.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {batch.exam} • {batch.category}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Step 2: Select Coupon */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Select Coupon
                  </label>
                  <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a coupon" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherCoupons.map((coupon) => (
                        <SelectItem key={coupon.id} value={coupon.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-medium text-primary">
                              {coupon.code}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({coupon.discount})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              /* Result State */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium text-success">Link Generated!</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Coupon <span className="font-mono font-medium text-primary">{selectedCouponData?.code}</span> will be auto-applied
                  </p>
                  <div className="p-3 rounded-lg bg-background border border-border">
                    <p className="text-xs text-foreground break-all font-mono">
                      {generatedLink}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Selected Batch</p>
                  <p className="text-sm font-medium text-foreground">{selectedBatchData?.name}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 mr-2" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? 'Copied!' : 'Copy Link'}
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            )}
          </div>

          <DrawerFooter>
            {!generatedLink ? (
              <>
                <Button
                  onClick={handleGenerateLink}
                  disabled={!selectedBatch || !selectedCoupon || isGenerating}
                >
                  {isGenerating ? 'Generating...' : 'Generate Link'}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleReset}>
                  Create Another Link
                </Button>
                <DrawerClose asChild>
                  <Button variant="ghost">Done</Button>
                </DrawerClose>
              </>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
