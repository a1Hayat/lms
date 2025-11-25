import abl_logo from "../../public/images/abl.png"
import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Smartphone, 
  CreditCard, 
  Info, 
  ShieldCheck,
  Landmark,
  MapPin,
  Banknote,
  ExternalLink
} from 'lucide-react';

// ============================================================================
//  COPY THIS SECTION INTO YOUR PROJECT
// ============================================================================

// UNCOMMENT THESE IMPORTS IN YOUR REAL SHADCN PROJECT:
  import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import { Card } from "@/components/ui/card"
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image";


// --- INTERFACES ---
interface PaymentInstructionProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: string;
  orderId: number;
  whatsappNumber: string;
}

interface CenterDetails {
  name: string;
  address: string;
  mapLink: string;
}

const BankTransferModal: React.FC<PaymentInstructionProps> = ({
  isOpen,
  onClose,
  amount,
  currency = "PKR",
  orderId,
  whatsappNumber = "+92 332 4040614"
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("bank");

  // --- DATA ---
  const bankDetails = {
    bankName: "Allied Bank Limited",
    branchName: "Wapda Town, Lahore",
    accountName: "Umaid Shafiq",
    accountNumber: "0010149534160019",
    iban: "PK13ABPA0010149534160019",
  };

  const cashCenters: CenterDetails[] = [
    {
      name: "Vision Academy - Johar Town",
      address: "10, Block L, Johar Town, Lahore",
      // Link 1: Johar Town Direct Link
      mapLink: "https://www.google.com/maps/dir//Vision+Academy,+10,+Block+L+Johar+Town,+Lahore/"
    },
    {
      name: "Vision Academy - Gulberg",
      address: "47-A, Chaudhary Muhammad Yousaf Rd, Block A-2, Gulberg III, Lahore",
      // Link 2: Gulberg Direct Link (Extracted from your search query for cleaner direction)
      mapLink: "https://www.google.com/maps/dir/?api=1&destination=47+A+Chaudhary+Muhammad+Yousaf+Rd+Block+A-2+Gulberg+III+Lahore"
    },
    {
      name: "Vision Academy - Bankers Town",
      address: "Block B, Bankers Town, Lahore",
      // Link 3: Bankers Town Direct Link
      mapLink: "https://www.google.com/maps/dir//C9XV%2BVFQ,+Bankers+Co-operative+Society+Block+B+Bankers+Town,+Lahore/"
    }
  ];

  // --- HELPERS ---
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const DetailRow = ({ label, value, copyable = false, isMono = false }: { label: string, value: string, copyable?: boolean, isMono?: boolean }) => (
    <div className="flex items-center justify-between py-2 text-sm border-b border-border/50 last:border-0">
      <span className="text-muted-foreground font-medium text-xs sm:text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className={`font-semibold text-foreground text-xs sm:text-sm ${isMono ? 'font-mono tracking-wide' : ''} text-right`}>{value}</span>
        {copyable && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7 bg-muted/50 hover:bg-muted shrink-0"
            onClick={() => handleCopy(value, label)}
          >
            {copiedField === label ? (
              <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Increased max-width for horizontal layout */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-background text-foreground border-border p-0 gap-0">
        
        {/* Header Section */}
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-xl">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                Payment Methods
              </span>
              <div className="flex items-center gap-2 text-base font-normal bg-muted/50 px-3 py-1 rounded-full border border-border">
                <span className="text-muted-foreground text-sm">Total:</span>
                <span className="font-bold text-foreground">
                  {new Intl.NumberFormat('en-PK', { style: 'currency', currency }).format(amount)}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription>
              Order ID: <span className="font-mono font-medium text-primary">{orderId}</span>
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="bank" className="w-full" onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="bank" className="flex items-center gap-2">
                <Landmark className="h-4 w-4" />
                Bank Transfer
              </TabsTrigger>
              <TabsTrigger value="cash" className="flex items-center gap-2">
                <Banknote className="h-4 w-4" />
                Cash at Center
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 pb-6">
            {/* --- BANK TRANSFER TAB --- */}
            <TabsContent value="bank" className="mt-0 space-y-4 focus-visible:ring-0">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Left Col: Account Details */}
                <Card className="overflow-hidden shadow-sm bg-card text-card-foreground border-border h-full">
                  <div className="bg-primary/5 p-3 flex items-center gap-3 border-b border-border">
                    <div className="h-8 w-8 rounded bg-background border border-border flex items-center justify-center shrink-0">
                      <Image src={abl_logo} alt="abl_logo" width={35} height={30} className="text-primary rounded" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm truncate">{bankDetails.bankName}</h3>
                      <p className="text-[10px] text-muted-foreground truncate">{bankDetails.branchName}</p>
                    </div>
                  </div>
                  <div className="px-3 py-2">
                    <DetailRow label="Account Name" value={bankDetails.accountName} />
                    <DetailRow label="Account Number" value={bankDetails.accountNumber} copyable isMono />
                    <DetailRow label="IBAN" value={bankDetails.iban} copyable isMono />
                  </div>
                </Card>

                {/* Right Col: Instructions */}
                <div className="flex flex-col justify-between rounded-lg border border-blue-200 bg-blue-50 p-4 dark:bg-blue-950/20 dark:border-blue-800/50 h-full">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                        Instruction
                      </p>
                      <p className="text-blue-800 dark:text-blue-400/90 text-xs leading-relaxed">
                        Send payment screenshot & Order ID to WhatsApp.
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    className="flex items-center justify-center gap-2 mt-3 font-bold text-blue-800 dark:text-blue-300 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/40 bg-white/50 dark:bg-black/20 border border-blue-200 dark:border-blue-800 p-2 rounded-md transition-colors w-full"
                    onClick={() => handleCopy(whatsappNumber, 'whatsapp')}
                  >
                    <Smartphone className="h-4 w-4" />
                    {whatsappNumber}
                    {copiedField === 'whatsapp' && <Check className="h-3 w-3 text-green-600 dark:text-green-400" />}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* --- CASH PAYMENT TAB --- */}
            <TabsContent value="cash" className="mt-0 space-y-4 focus-visible:ring-0">
              <div className="rounded-md bg-muted/50 border border-border p-4 text-sm text-muted-foreground text-center mb-4">
                Please visit any of our centers below to pay in cash. 
                <br/> Mention Order ID <span className="font-mono font-bold text-foreground">{orderId}</span> at the counter.
              </div>
              
              <div className="grid gap-3 max-h-[250px] overflow-y-auto pr-1">
                {cashCenters.map((center, idx) => (
                  <Card key={idx} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors">
                    <div className="flex gap-3">
                      <div className="mt-1 sm:mt-0 h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{center.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{center.address}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-2 text-xs h-8 shrink-0"
                      onClick={() => window.open(center.mapLink, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Map
                    </Button>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="p-6 pt-2 bg-muted/10 justify-center border-t border-border sm:justify-between gap-2">
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Close
          </Button>
          {/* <Button 
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" 
            onClick={() => {
              onClose();
              // Add actual confirmation logic here
              if (activeTab === 'bank') {
                alert("Please don't forget to send the WhatsApp screenshot!");
              } else {
                alert("Order placed! Please visit the center to pay.");
              }
            }}
          >
             {activeTab === 'bank' ? 'I have sent the payment' : 'Confirm Cash Order'}
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BankTransferModal;
