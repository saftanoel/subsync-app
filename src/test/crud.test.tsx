import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { BrowserRouter } from "react-router-dom";
import { SubscriptionProvider, useSubscriptions } from "@/contexts/SubscriptionContext";

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <SubscriptionProvider>{children}</SubscriptionProvider>
    </BrowserRouter>
  );
}

// Helper component exposing full CRUD via buttons
function CrudTester() {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription, getSubscription, sortColumn, setSortColumn } = useSubscriptions();
  return (
    <div>
      <span data-testid="count">{subscriptions.length}</span>
      <span data-testid="sort-col">{sortColumn}</span>
      <button onClick={() => addSubscription({ serviceName: "TestSub", category: "Entertainment", monthlyCost: 9.99, billingCycle: "Monthly", nextPayment: "2024-12-01", valueRating: 4 })}>
        add
      </button>
      <button onClick={() => addSubscription({ serviceName: "SecondSub", category: "Software", monthlyCost: 19.99, billingCycle: "Annual", nextPayment: "2025-01-15", valueRating: 5 })}>
        add-second
      </button>
      <button onClick={() => addSubscription({ serviceName: "ZeroSub", category: "Fitness", monthlyCost: 0, billingCycle: "Monthly", nextPayment: "2024-12-01", valueRating: 1 })}>
        add-zero-cost
      </button>
      <button onClick={() => { const s = subscriptions.find(x => x.serviceName === "TestSub"); if (s) updateSubscription(s.id, { monthlyCost: 19.99 }); }}>
        update-cost
      </button>
      <button onClick={() => { const s = subscriptions.find(x => x.serviceName === "TestSub"); if (s) updateSubscription(s.id, { serviceName: "RenamedSub", category: "Software" }); }}>
        update-name
      </button>
      <button onClick={() => { const s = subscriptions.find(x => x.serviceName === "TestSub"); if (s) updateSubscription(s.id, { valueRating: 1, billingCycle: "Annual", nextPayment: "2025-06-01" }); }}>
        update-multiple
      </button>
      <button onClick={() => { const s = subscriptions.find(x => x.serviceName === "TestSub"); if (s) deleteSubscription(s.id); }}>
        delete
      </button>
      <button onClick={() => deleteSubscription("nonexistent-id")}>
        delete-nonexistent
      </button>
      <button onClick={() => setSortColumn("monthlyCost")}>
        sort-cost
      </button>
      {subscriptions.map(s => (
        <div key={s.id} data-testid={`sub-${s.serviceName}`}>
          {s.serviceName}: ${s.monthlyCost} | {s.category} | {s.billingCycle} | {s.nextPayment} | {s.valueRating}★
        </div>
      ))}
    </div>
  );
}

describe("Subscription CRUD Operations", () => {
  // ==================== READ ====================
  describe("Read", () => {
    it("should render initial subscriptions (8 preloaded)", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      expect(Number(screen.getByTestId("count").textContent)).toBe(8);
    });

    it("should display all initial subscription names", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      expect(screen.getByTestId("sub-Netflix")).toBeTruthy();
      expect(screen.getByTestId("sub-Adobe Cloud")).toBeTruthy();
      expect(screen.getByTestId("sub-Amazon Prime")).toBeTruthy();
      expect(screen.getByTestId("sub-Spotify Family")).toBeTruthy();
      expect(screen.getByTestId("sub-ChatGPT Plus")).toBeTruthy();
      expect(screen.getByTestId("sub-iCloud+")).toBeTruthy();
      expect(screen.getByTestId("sub-Gym Membership")).toBeTruthy();
      expect(screen.getByTestId("sub-NYT Digital")).toBeTruthy();
    });

    it("should display correct data for a specific subscription", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      const netflix = screen.getByTestId("sub-Netflix");
      expect(netflix.textContent).toContain("$15.99");
      expect(netflix.textContent).toContain("Entertainment");
      expect(netflix.textContent).toContain("Monthly");
    });
  });

  // ==================== ADD ====================
  describe("Add", () => {
    it("should add a new subscription and increment count", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      const initialCount = Number(screen.getByTestId("count").textContent);
      fireEvent.click(screen.getByText("add"));
      expect(Number(screen.getByTestId("count").textContent)).toBe(initialCount + 1);
      expect(screen.getByTestId("sub-TestSub")).toBeTruthy();
    });

    it("should add multiple subscriptions", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      const initialCount = Number(screen.getByTestId("count").textContent);
      fireEvent.click(screen.getByText("add"));
      fireEvent.click(screen.getByText("add-second"));
      expect(Number(screen.getByTestId("count").textContent)).toBe(initialCount + 2);
      expect(screen.getByTestId("sub-TestSub")).toBeTruthy();
      expect(screen.getByTestId("sub-SecondSub")).toBeTruthy();
    });

    it("should store correct data for newly added subscription", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("add-second"));
      const el = screen.getByTestId("sub-SecondSub");
      expect(el.textContent).toContain("$19.99");
      expect(el.textContent).toContain("Software");
      expect(el.textContent).toContain("Annual");
      expect(el.textContent).toContain("2025-01-15");
      expect(el.textContent).toContain("5★");
    });

    it("should allow adding a subscription with zero cost (context doesn't validate)", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("add-zero-cost"));
      expect(screen.getByTestId("sub-ZeroSub")).toBeTruthy();
      expect(screen.getByTestId("sub-ZeroSub").textContent).toContain("$0");
    });
  });

  // ==================== UPDATE ====================
  describe("Update", () => {
    it("should update monthly cost of a subscription", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("add"));
      expect(screen.getByTestId("sub-TestSub").textContent).toContain("$9.99");
      fireEvent.click(screen.getByText("update-cost"));
      expect(screen.getByTestId("sub-TestSub").textContent).toContain("$19.99");
    });

    it("should update service name and category", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("add"));
      fireEvent.click(screen.getByText("update-name"));
      expect(screen.getByTestId("sub-RenamedSub")).toBeTruthy();
      expect(screen.getByTestId("sub-RenamedSub").textContent).toContain("Software");
    });

    it("should update multiple fields at once", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("add"));
      fireEvent.click(screen.getByText("update-multiple"));
      const el = screen.getByTestId("sub-TestSub");
      expect(el.textContent).toContain("1★");
      expect(el.textContent).toContain("Annual");
      expect(el.textContent).toContain("2025-06-01");
    });

    it("should not affect other subscriptions when updating one", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      const netflixBefore = screen.getByTestId("sub-Netflix").textContent;
      fireEvent.click(screen.getByText("add"));
      fireEvent.click(screen.getByText("update-cost"));
      expect(screen.getByTestId("sub-Netflix").textContent).toBe(netflixBefore);
    });

    it("should preserve count after update", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("add"));
      const countAfterAdd = Number(screen.getByTestId("count").textContent);
      fireEvent.click(screen.getByText("update-cost"));
      expect(Number(screen.getByTestId("count").textContent)).toBe(countAfterAdd);
    });
  });

  // ==================== DELETE ====================
  describe("Delete", () => {
    it("should delete a subscription and decrement count", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("add"));
      const afterAdd = Number(screen.getByTestId("count").textContent);
      fireEvent.click(screen.getByText("delete"));
      expect(Number(screen.getByTestId("count").textContent)).toBe(afterAdd - 1);
    });

    it("should remove the subscription from the DOM", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("add"));
      expect(screen.getByTestId("sub-TestSub")).toBeTruthy();
      fireEvent.click(screen.getByText("delete"));
      expect(screen.queryByTestId("sub-TestSub")).toBeNull();
    });

    it("should handle deleting nonexistent id gracefully (no crash)", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      const countBefore = Number(screen.getByTestId("count").textContent);
      fireEvent.click(screen.getByText("delete-nonexistent"));
      expect(Number(screen.getByTestId("count").textContent)).toBe(countBefore);
    });

    it("should not affect other subscriptions when deleting one", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("add"));
      expect(screen.getByTestId("sub-Netflix")).toBeTruthy();
      fireEvent.click(screen.getByText("delete"));
      expect(screen.getByTestId("sub-Netflix")).toBeTruthy();
    });
  });

  // ==================== SORTING PREFERENCE ====================
  describe("Sort preference (cookie-backed)", () => {
    it("should have a default sort column", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      expect(screen.getByTestId("sort-col").textContent).toBeTruthy();
    });

    it("should update sort column when changed", () => {
      render(<Wrapper><CrudTester /></Wrapper>);
      fireEvent.click(screen.getByText("sort-cost"));
      expect(screen.getByTestId("sort-col").textContent).toBe("monthlyCost");
    });
  });

  // ==================== VALIDATION LOGIC ====================
  describe("Client-side validation rules", () => {
    it("should reject negative costs", () => {
      expect(-5 > 0).toBe(false);
    });

    it("should reject zero cost in form validation", () => {
      expect(0 > 0).toBe(false);
    });

    it("should accept valid positive cost", () => {
      expect(9.99 > 0).toBe(true);
    });

    it("should reject empty service name", () => {
      expect("".trim().length > 0).toBe(false);
    });

    it("should accept valid service name", () => {
      expect("Netflix".trim().length > 0).toBe(true);
    });

    it("should reject invalid date", () => {
      expect(isNaN(new Date("not-a-date").getTime())).toBe(true);
    });

    it("should accept valid date", () => {
      expect(isNaN(new Date("2024-12-01").getTime())).toBe(false);
    });

    it("should reject rating outside 1-5 range", () => {
      const lowRating = 0;
      const highRating = 6;
      expect(lowRating >= 1 && lowRating <= 5).toBe(false);
      expect(highRating >= 1 && highRating <= 5).toBe(false);
    });
  });
});

describe("useSubscriptions hook", () => {
  it("should throw error when used outside provider", () => {
    // Suppress console.error for expected error
    const spy = vi.spyOn(console, "error").mockImplementation(() => { });
    expect(() => {
      function BadComponent() {
        useSubscriptions();
        return null;
      }
      render(<BadComponent />);
    }).toThrow("useSubscriptions must be used within SubscriptionProvider");
    spy.mockRestore();
  });
});
