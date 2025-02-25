export const customers = [
    {
        id: "USR123456",
        name: "John Doe",
        phoneId: "+918003074521",
        email: "johndoe@example.com",
        city: "New York",
        country: "USA",
        age: 28,
        gender: "Male",
        tags: ["VIP", "Frequent Buyer", "Tech Enthusiast"],
        registrationDate: "2024-01-15",
        lastLogin: "2025-02-10",
        lastPayment: {
            date: "2025-02-05",
            amount: 199.99,
        },
        totalSpent: 1299.99,
        purchaseHistory: [
            { date: "2024-12-10", amount: 499.99, item: "Smartphone" },
            { date: "2025-01-05", amount: 599.99, item: "Laptop" },
            { date: "2025-02-05", amount: 199.99, item: "Smartwatch" }
        ],
        subscription: {
            status: "Active",
            plan: "Premium",
            renewalDate: "2025-03-05"
        },
        isNewRegistration: false,
    }

]