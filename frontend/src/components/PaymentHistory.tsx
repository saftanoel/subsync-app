import React, { useState } from "react";
import { toast } from "sonner";
import { History, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscriptions } from "@/contexts/SubscriptionContext"; // 1. IMPORTĂM CREIERUL GLOBAL

interface Payment {
  id: string;
  amount: number;
  date: string;
}

interface PaymentHistoryProps {
  subscriptionId: string;
  payments: Payment[];
}

export function PaymentHistory({ subscriptionId, payments: initialPayments }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments || []);
  const [newAmount, setNewAmount] = useState("");
  const [newDate, setNewDate] = useState("");
  
  // 2. EXTRAGEM FUNCȚIA DE UPDATE DIN CONTEXT
  const { updateSubscription } = useSubscriptions();

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const handleAddPayment = async () => {
    if (!newAmount || !newDate) {
      toast.error("Completează suma și data!");
      return;
    }

    const query = `
      mutation {
        addPayment(subscriptionId: "${subscriptionId}", amount: ${parseFloat(newAmount)}, date: "${newDate}") {
          id
          amount
          date
        }
      }
    `;

    try {
      const res = await fetch("http://127.0.0.1:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      
      const json = await res.json();
      
      if (json.errors) throw new Error(json.errors[0].message);

      const newPaymentFromServer = json.data.addPayment;
      const updatedPayments = [newPaymentFromServer, ...payments];
      
      // Actualizăm interfața locală
      setPayments(updatedPayments);
      
      // 3. AICI E SECRETUL: Trimitem lista actualizată în "Creierul" global ca să fie salvată și la refresh!
      updateSubscription(subscriptionId, { payments: updatedPayments });
      
      setNewAmount("");
      setNewDate("");
      toast.success("Plată salvată în baza de date!");
      
    } catch (error) {
      toast.error("Eroare la salvarea plății!");
      console.error(error);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    const query = `
      mutation {
        deletePayment(subscriptionId: "${subscriptionId}", paymentId: "${paymentId}")
      }
    `;

    try {
      const res = await fetch("http://127.0.0.1:8000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });
      
      const json = await res.json();
      
      if (json.errors || !json.data.deletePayment) {
         throw new Error("Nu s-a putut șterge de pe server.");
      }

      const updatedPayments = payments.filter((p) => p.id !== paymentId);
      
      // Actualizăm interfața locală
      setPayments(updatedPayments);
      
      // actualizam globalul cu noua lista de payments
      updateSubscription(subscriptionId, { payments: updatedPayments });
      
      toast.info("Plata a fost ștearsă definitiv.");
      
    } catch (error) {
      toast.error("Eroare la ștergerea plății!");
    }
  };

  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-bold">Istoric Plăți</h3>
        </div>
        <div className="text-sm font-medium">
          Total investit: <span className="text-primary font-bold">${totalPaid.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-2 mb-4 bg-secondary/30 p-3 rounded-xl border border-border">
        <input
          type="number"
          placeholder="Sumă ($)"
          className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
        />
        <input
          type="date"
          className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary [color-scheme:dark]"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
        <Button onClick={handleAddPayment} size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Adaugă
        </Button>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
        {payments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Nicio plată înregistrată pentru acest abonament.
          </p>
        ) : (
          payments.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-2 border border-border"
            >
              <span className="text-sm text-muted-foreground font-medium">{p.date}</span>
              <div className="flex items-center gap-4">
                <span className="font-bold text-primary">${p.amount.toFixed(2)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive/20 hover:text-destructive"
                  onClick={() => handleDeletePayment(p.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}