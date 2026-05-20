import { beforeEach } from "vitest";
import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

const initialData = [
  { id: "1", serviceName: "Netflix", category: "Entertainment", monthlyCost: 15.99, billingCycle: "Monthly", nextPayment: "2024-12-01", valueRating: 4 },
  { id: "2", serviceName: "Adobe Cloud", category: "Software", monthlyCost: 52.99, billingCycle: "Monthly", nextPayment: "2024-12-05", valueRating: 3 },
  { id: "3", serviceName: "Amazon Prime", category: "Shopping", monthlyCost: 14.99, billingCycle: "Monthly", nextPayment: "2024-12-10", valueRating: 5 },
  { id: "4", serviceName: "Spotify Family", category: "Entertainment", monthlyCost: 16.99, billingCycle: "Monthly", nextPayment: "2024-12-15", valueRating: 5 },
  { id: "5", serviceName: "ChatGPT Plus", category: "Software", monthlyCost: 20.00, billingCycle: "Monthly", nextPayment: "2024-12-20", valueRating: 4 },
  { id: "6", serviceName: "iCloud+", category: "Cloud Storage", monthlyCost: 2.99, billingCycle: "Monthly", nextPayment: "2024-12-25", valueRating: 3 },
  { id: "7", serviceName: "Gym Membership", category: "Fitness", monthlyCost: 45.00, billingCycle: "Monthly", nextPayment: "2025-01-01", valueRating: 4 },
  { id: "8", serviceName: "NYT Digital", category: "News", monthlyCost: 4.00, billingCycle: "Monthly", nextPayment: "2025-01-05", valueRating: 4 },
];

const localStorageMock = (function () {
  let store: Record<string, string> = {
    "subsync_data": JSON.stringify(initialData)
  };
  return {
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem: function (key: string) {
      delete store[key];
    },
    clear: function () {
      store = {
        "subsync_data": JSON.stringify(initialData)
      };
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

beforeEach(() => {
  window.localStorage.clear();
});

